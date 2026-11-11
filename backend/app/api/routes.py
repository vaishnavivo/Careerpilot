from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session
from sqlalchemy import select, func, text

from ..db import get_db

from ..models import (
    User,
    Student,
    JobSeeker,
    Recruiter,
    Job,
    Resume,
    Application,
    Interview,
    ResumeAnalysis,
    JobMatch,
    Notification,
    ResumeView
)

from ..schemas.schemas import (
    RegisterIn,
    LoginIn,
    JobIn,
    MatchIn,
    JDMatchIn,
    ApplicationIn
)

from ..core.security import (
    hash_password,
    verify_password,
    create_token,
    get_current_user
)

from ..core.config import settings

from ..services.ai_service import (
    analyze_resume,
    match_resume_job,
    improve_resume
)

from pypdf import PdfReader
from docx import Document
from io import BytesIO

from datetime import datetime
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import os
import smtplib
import secrets
import hashlib

from email.message import EmailMessage
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode
bearer_scheme = HTTPBearer()

router = APIRouter(prefix='/api')


def current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    try:
        return get_current_user(credentials.credentials)
    except Exception:
        raise HTTPException(
            status_code=401,
            detail='Invalid or expired token'
        )


def extract_upload(f, path):
    data = f.file.read()

    open(path, 'wb').write(data)

    filename = f.filename.lower()

    if filename.endswith('.pdf'):
        reader = PdfReader(path)

        return '\n'.join(
            (p.extract_text() or '')
            for p in reader.pages
        )

    if filename.endswith('.docx'):
        doc = Document(BytesIO(data))

        return '\n'.join(
            p.text
            for p in doc.paragraphs
            if p.text.strip()
        )

    if filename.endswith('.doc'):
        raise HTTPException(
            status_code=400,
            detail='Old .doc files are not supported. Please upload a .docx or .pdf file.'
        )

    return data.decode('utf-8', 'ignore')


# ---------------------------------------------------------
# AUTHENTICATION
# ---------------------------------------------------------

@router.post('/auth/register')
def register(
    x: RegisterIn,
    db: Session = Depends(get_db)
):
    if x.role not in {
        'student',
        'job_seeker',
        'recruiter'
    }:
        raise HTTPException(
            status_code=400,
            detail='Invalid public role'
        )

    if db.scalar(
        select(User).where(User.email == x.email)
    ):
        raise HTTPException(
            status_code=409,
            detail='Email already registered'
        )

    u = User(
        name=x.name,
        email=x.email,
        password_hash=hash_password(x.password),
        role=x.role
    )

    db.add(u)
    db.flush()

    if x.role == 'student':
        db.add(
            Student(user_id=u.user_id)
        )

    elif x.role == 'job_seeker':
        db.add(
            JobSeeker(user_id=u.user_id)
        )

    else:
        db.add(
            Recruiter(user_id=u.user_id)
        )

    db.commit()

    return {
        'message': 'Account created',
        'access_token': create_token(
            u.user_id,
            u.role
        ),
        'role': u.role
    }


def _ensure_otp_table(db: Session):
    db.execute(text('''
        CREATE TABLE IF NOT EXISTS email_login_otps (
            otp_id BIGSERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp_hash VARCHAR(64) NOT NULL,
            expires_at TIMESTAMPTZ NOT NULL,
            used BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    '''))
    db.execute(text('''
        CREATE INDEX IF NOT EXISTS idx_email_login_otps_email
        ON email_login_otps(email)
    '''))
    db.commit()

def _ensure_registration_otp_table(db: Session):
    db.execute(text('''
        CREATE TABLE IF NOT EXISTS email_registration_otps (
            registration_id BIGSERIAL PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password_hash TEXT NOT NULL,
            role VARCHAR(30) NOT NULL,
            otp_hash VARCHAR(64) NOT NULL,
            expires_at TIMESTAMPTZ NOT NULL,
            used BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    '''))

    db.execute(text('''
        CREATE INDEX IF NOT EXISTS idx_registration_otps_email
        ON email_registration_otps(email)
    '''))

    db.commit()

def _send_login_otp(email: str, otp: str):
    host = settings.smtp_host.strip()
    port = settings.smtp_port
    username = settings.smtp_username.strip()
    password = settings.smtp_password.strip()
    sender = settings.smtp_from.strip() or username

    if not host or not username or not password or not sender:
        raise HTTPException(
            status_code=503,
            detail='Email service is not configured. Check SMTP settings in backend/.env.'
        )

    message = EmailMessage()
    message['Subject'] = 'CareerAI Login OTP'
    message['From'] = sender
    message['To'] = email

    message.set_content(
        f'''Your CareerAI login OTP is: {otp}

This OTP is valid for 5 minutes. Do not share this code with anyone.

If you did not request this code, you can safely ignore this email.'''
    )

    try:
        with smtplib.SMTP_SSL(
            host,
            port,
            timeout=30
        ) as server:
            server.login(username, password)
            server.send_message(message)

    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f'Could not send OTP email: {type(e).__name__}: {str(e)}'
        )

@router.post('/auth/register/request-otp')
def request_registration_otp(
    data: dict,
    db: Session = Depends(get_db)
):
    name = str(data.get('name', '')).strip()
    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))
    role = str(data.get('role', 'student')).strip().lower()

    if not name:
        raise HTTPException(
            status_code=400,
            detail='Please enter your name'
        )

    if not email or '@' not in email or '.' not in email.split('@')[-1]:
        raise HTTPException(
            status_code=400,
            detail='Please enter a valid email address'
        )

    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail='Password must contain at least 8 characters'
        )

    allowed_roles = {
        'student',
        'job_seeker',
        'recruiter'
    }

    if role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail='Invalid account role'
        )

    existing_user = db.scalar(
        select(User).where(User.email == email)
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail='An account with this email already exists. Please login.'
        )

    _ensure_registration_otp_table(db)

    otp = f'{secrets.randbelow(1000000):06d}'

    otp_hash = hashlib.sha256(
        otp.encode()
    ).hexdigest()

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=5)
    )

    password_hash = hash_password(password)

    db.execute(
        text('''
            DELETE FROM email_registration_otps
            WHERE email = :email
              AND used = FALSE
        '''),
        {
            'email': email
        }
    )

    db.execute(
        text('''
            INSERT INTO email_registration_otps
            (
                name,
                email,
                password_hash,
                role,
                otp_hash,
                expires_at,
                used
            )
            VALUES
            (
                :name,
                :email,
                :password_hash,
                :role,
                :otp_hash,
                :expires_at,
                FALSE
            )
        '''),
        {
            'name': name,
            'email': email,
            'password_hash': password_hash,
            'role': role,
            'otp_hash': otp_hash,
            'expires_at': expires_at
        }
    )

    db.commit()

    try:
        _send_login_otp(email, otp)

    except HTTPException:
        db.execute(
            text('''
                DELETE FROM email_registration_otps
                WHERE email = :email
                  AND used = FALSE
            '''),
            {
                'email': email
            }
        )

        db.commit()
        raise

    return {
        'message': 'OTP sent to your email',
        'email': email
    }

@router.post('/auth/register/verify-otp')
def verify_registration_otp(
    data: dict,
    db: Session = Depends(get_db)
):
    email = str(data.get('email', '')).strip().lower()
    otp = str(data.get('otp', '')).strip()

    if not email:
        raise HTTPException(
            status_code=400,
            detail='Email is required'
        )

    if not otp.isdigit() or len(otp) != 6:
        raise HTTPException(
            status_code=400,
            detail='Enter the 6-digit OTP sent to your email'
        )

    _ensure_registration_otp_table(db)

    row = db.execute(
        text('''
            SELECT
                registration_id,
                name,
                email,
                password_hash,
                role,
                otp_hash,
                expires_at
            FROM email_registration_otps
            WHERE email = :email
              AND used = FALSE
            ORDER BY created_at DESC
            LIMIT 1
        '''),
        {
            'email': email
        }
    ).mappings().first()

    if not row:
        raise HTTPException(
            status_code=401,
            detail='OTP not found. Please request a new OTP.'
        )

    expires_at = row['expires_at']

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if expires_at < datetime.now(timezone.utc):
        db.execute(
            text('''
                UPDATE email_registration_otps
                SET used = TRUE
                WHERE registration_id = :id
            '''),
            {
                'id': row['registration_id']
            }
        )

        db.commit()

        raise HTTPException(
            status_code=401,
            detail='OTP expired. Please request a new OTP.'
        )

    entered_hash = hashlib.sha256(
        otp.encode()
    ).hexdigest()

    if entered_hash != row['otp_hash']:
        raise HTTPException(
            status_code=401,
            detail='Invalid OTP'
        )

    existing_user = db.scalar(
        select(User).where(User.email == email)
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail='An account with this email already exists. Please login.'
        )

    user = User(
        name=row['name'],
        email=row['email'],
        password_hash=row['password_hash'],
        role=row['role']
    )

    db.add(user)
    db.flush()

    if row['role'] == 'student':
        db.add(
            Student(user_id=user.user_id)
        )

    elif row['role'] == 'job_seeker':
        db.add(
            JobSeeker(user_id=user.user_id)
        )

    elif row['role'] == 'recruiter':
        db.add(
            Recruiter(user_id=user.user_id)
        )

    db.execute(
        text('''
            UPDATE email_registration_otps
            SET used = TRUE
            WHERE registration_id = :id
        '''),
        {
            'id': row['registration_id']
        }
    )

    db.commit()

    return {
        'message': 'Account created successfully',
        'name': user.name,
        'email': user.email,
        'role': user.role
    }

@router.post('/auth/request-otp')
def request_otp(
    data: dict,
    db: Session = Depends(get_db)
):
    email = str(data.get('email', '')).strip().lower()

    if not email or '@' not in email or '.' not in email.split('@')[-1]:
        raise HTTPException(
            status_code=400,
            detail='Please enter a valid email address'
        )

    _ensure_otp_table(db)

    user = db.scalar(
        select(User).where(User.email == email)
    )

    # New email addresses are allowed to enter the platform.
    # New accounts are created as student accounts. Existing
    # recruiter/admin accounts keep their existing roles.
    if not user:
        display_name = email.split('@')[0].replace('.', ' ').replace('_', ' ').title()

        user = User(
            name=display_name or 'User',
            email=email,
            password_hash=hash_password(secrets.token_urlsafe(32)),
            role='student'
        )
        db.add(user)
        db.flush()
        db.add(Student(user_id=user.user_id))
        db.commit()

    otp = f'{secrets.randbelow(1000000):06d}'
    otp_hash = hashlib.sha256(otp.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    db.execute(
        text('DELETE FROM email_login_otps WHERE email = :email AND used = FALSE'),
        {'email': email}
    )

    db.execute(
        text('''
            INSERT INTO email_login_otps
            (email, otp_hash, expires_at, used)
            VALUES (:email, :otp_hash, :expires_at, FALSE)
        '''),
        {
            'email': email,
            'otp_hash': otp_hash,
            'expires_at': expires_at
        }
    )
    db.commit()

    try:
        _send_login_otp(email, otp)
    except HTTPException:
        db.execute(
            text('DELETE FROM email_login_otps WHERE email = :email AND used = FALSE'),
            {'email': email}
        )
        db.commit()
        raise

    return {
        'message': 'OTP sent to your email',
        'email': email
    }


@router.post('/auth/verify-otp')
def verify_otp(
    data: dict,
    db: Session = Depends(get_db)
):
    email = str(data.get('email', '')).strip().lower()
    otp = str(data.get('otp', '')).strip()

    if not email or not otp.isdigit() or len(otp) != 6:
        raise HTTPException(
            status_code=400,
            detail='Enter the 6-digit OTP sent to your email'
        )

    _ensure_otp_table(db)

    row = db.execute(
        text('''
            SELECT otp_id, otp_hash, expires_at
            FROM email_login_otps
            WHERE email = :email
              AND used = FALSE
            ORDER BY created_at DESC
            LIMIT 1
        '''),
        {'email': email}
    ).mappings().first()

    if not row:
        raise HTTPException(
            status_code=401,
            detail='OTP not found. Please request a new OTP.'
        )

    expires_at = row['expires_at']
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        db.execute(
            text('UPDATE email_login_otps SET used = TRUE WHERE otp_id = :id'),
            {'id': row['otp_id']}
        )
        db.commit()
        raise HTTPException(
            status_code=401,
            detail='OTP expired. Please request a new OTP.'
        )

    if hashlib.sha256(otp.encode()).hexdigest() != row['otp_hash']:
        raise HTTPException(
            status_code=401,
            detail='Invalid OTP'
        )

    user = db.scalar(
        select(User).where(User.email == email)
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail='Account not found'
        )

    db.execute(
        text('UPDATE email_login_otps SET used = TRUE WHERE otp_id = :id'),
        {'id': row['otp_id']}
    )
    db.commit()

    return {
        'access_token': create_token(
            user.user_id,
            user.role
        ),
        'role': user.role,
        'name': user.name
    }


@router.post('/auth/login')
def login_legacy(
    x: LoginIn,
    db: Session = Depends(get_db)
):
    # Kept temporarily so existing API clients do not break.
    u = db.scalar(select(User).where(User.email == x.email))
    if not u or not verify_password(x.password, u.password_hash):
        raise HTTPException(status_code=401, detail='Invalid email or password')
    return {
        'access_token': create_token(u.user_id, u.role),
        'role': u.role,
        'name': u.name
    }


# ---------------------------------------------------------
# JOBS
# ---------------------------------------------------------

@router.get('/jobs')
def jobs(
    db: Session = Depends(get_db)
):
    rows = db.scalars(
        select(Job)
        .where(Job.status.in_(['open', 'OPEN', 'published', 'PUBLISHED']))
        .order_by(Job.posted_at.desc())
    ).all()

    return [
        {
            'job_id': j.job_id,
            'title': j.title,
            'description': j.description,
            'location': j.location,
            'employment_type': j.employment_type,
            'industry': j.industry
        }
        for j in rows
    ]

@router.post('/jobs')
def create_job(
    x: JobIn,
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    if user['role'] != 'recruiter':
        raise HTTPException(
            status_code=403,
            detail='Recruiter access required'
        )

    recruiter = db.scalar(
        select(Recruiter).where(
            Recruiter.user_id == user['user_id']
        )
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail='Recruiter profile not found'
        )

    if not recruiter.company_id:
        raise HTTPException(
            status_code=400,
            detail='Recruiter is not linked to a company'
        )

    j = Job(
        recruiter_id=recruiter.recruiter_id,
        company_id=recruiter.company_id,
        **x.model_dump(),
        status='open'
    )

    db.add(j)
    db.commit()
    db.refresh(j)

    return {
        'job_id': j.job_id,
        'message': 'Job published'
    }

# ---------------------------------------------------------
# RESUME UPLOAD
# ---------------------------------------------------------

@router.post('/resumes/upload')
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    if not file.filename.lower().endswith(
        ('.pdf', '.docx', '.doc')
    ):
        raise HTTPException(
            status_code=400,
            detail='Unsupported resume format'
        )

    os.makedirs(
        'uploads',
        exist_ok=True
    )

    path = os.path.join(
        'uploads',
        file.filename
    )

    text_content = extract_upload(
        file,
        path
    )

    if not text_content.strip():
        raise HTTPException(
            status_code=400,
            detail='Could not extract text from the resume. Please upload a text-based PDF or DOCX file.'
        )

    r = Resume(
        user_id=user['user_id'],
        resume_name=file.filename,
        file_path=path,
        file_type=os.path.splitext(
            file.filename
        )[1].lower().replace('.', ''),
        extracted_text=text_content,
        visibility='public_to_recruiters',
        is_primary=False,
        status='uploaded'
    )

    db.add(r)
    db.commit()
    db.refresh(r)

    return {
        'resume_id': r.resume_id,
        'name': r.resume_name,
        'extracted_characters': len(
            text_content
        )
    }


# ---------------------------------------------------------
# RESUME ANALYSIS
# ---------------------------------------------------------

@router.post('/resumes/{resume_id}/analyze')
def analyze(
    resume_id: int,
    db: Session = Depends(get_db)
):
    r = db.get(
        Resume,
        resume_id
    )

    if not r:
        raise HTTPException(
            status_code=404,
            detail='Resume not found'
        )

    result = analyze_resume(
        r.extracted_text or ''
    )

    a = ResumeAnalysis(
        resume_id=resume_id,
        **{
            k: result[k]
            for k in [
                'overall_score',
                'ats_score',
                'skills_score',
                'experience_score',
                'education_score',
                'projects_score',
                'formatting_score',
                'keyword_score'
            ]
        }
    )

    db.add(a)
    db.flush()

    for cat, msg, priority in result['suggestions']:
        db.execute(
            text(
                'INSERT INTO resume_suggestions '
                '(analysis_id, category, suggestion_text, priority) '
                'VALUES (:a, :c, :s, :p)'
            ),
            {
                'a': a.analysis_id,
                'c': cat,
                's': msg,
                'p': priority.lower()
            }
        )

    db.commit()

    return {
        'analysis_id': a.analysis_id,
        **result
    }


# ---------------------------------------------------------
# JOB MATCH
# ---------------------------------------------------------

@router.post('/job-match')
def job_match(
    x: MatchIn,
    db: Session = Depends(get_db)
):
    r = db.get(
        Resume,
        x.resume_id
    )

    j = db.get(
        Job,
        x.job_id
    )

    if not r or not j:
        raise HTTPException(
            status_code=404,
            detail='Resume or job not found'
        )

    result = match_resume_job(
        r.extracted_text or '',
        j.description
    )

    m = db.scalar(
        select(JobMatch).where(
            JobMatch.resume_id == x.resume_id,
            JobMatch.job_id == x.job_id
        )
    )

    if not m:
        m = JobMatch(
            resume_id=x.resume_id,
            job_id=x.job_id
        )

        db.add(m)

    for k, v in result.items():
        setattr(
            m,
            k,
            v
        )

    db.commit()

    return result


# ---------------------------------------------------------
# JOB DESCRIPTION MATCH
# ---------------------------------------------------------

@router.post('/job-match/description')
def description_match(
    x: JDMatchIn,
    db: Session = Depends(get_db)
):
    r = db.get(
        Resume,
        x.resume_id
    )

    if not r:
        raise HTTPException(
            status_code=404,
            detail='Resume not found'
        )

    return match_resume_job(
        r.extracted_text or '',
        x.job_description
    )


# ---------------------------------------------------------
# RESUME IMPROVEMENT
# ---------------------------------------------------------

@router.post('/resumes/{resume_id}/improve')
def improve(
    resume_id: int,
    job_description: str = '',
    db: Session = Depends(get_db)
):
    r = db.get(
        Resume,
        resume_id
    )

    if not r:
        raise HTTPException(
            status_code=404,
            detail='Resume not found'
        )

    return improve_resume(
        r.extracted_text or '',
        job_description
    )


# ---------------------------------------------------------
# DASHBOARD STATISTICS
# ---------------------------------------------------------

@router.get('/dashboard/stats')
def stats(
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    user_id = user['user_id']
    role = user['role'].lower()

    # ---------------------------------------------------------
    # RECRUITER DASHBOARD
    # ---------------------------------------------------------

    if role == 'recruiter':

        recruiter = db.scalar(
            select(Recruiter).where(
                Recruiter.user_id == user_id
            )
        )

        if not recruiter:
            raise HTTPException(
                status_code=404,
                detail='Recruiter profile not found'
            )

        active_jobs = db.scalar(
            select(func.count(Job.job_id))
            .where(
                Job.recruiter_id == recruiter.recruiter_id,
                Job.status.in_([
                    'open',
                    'OPEN',
                    'published',
                    'PUBLISHED'
                ])
            )
        ) or 0

        applicants = db.scalar(
            select(func.count(Application.application_id))
            .join(
                Job,
                Application.job_id == Job.job_id
            )
            .where(
                Job.recruiter_id == recruiter.recruiter_id
            )
        ) or 0

        interviews = db.scalar(
            select(func.count(Interview.interview_id))
            .where(
                Interview.recruiter_id == recruiter.recruiter_id,
                Interview.status != 'cancelled'
            )
        ) or 0

        return {
            'active_jobs': active_jobs,
            'applicants': applicants,
            'resume_views': 0,
            'interviews': interviews
        }

    # ---------------------------------------------------------
    # ADMIN DASHBOARD
    # ---------------------------------------------------------

    if role == 'admin':

        users = db.scalar(
            select(func.count(User.user_id))
        ) or 0

        jobs = db.scalar(
            select(func.count(Job.job_id))
        ) or 0

        active_jobs = db.scalar(
            select(func.count(Job.job_id))
            .where(
                Job.status.in_([
                    'open',
                    'OPEN',
                    'published',
                    'PUBLISHED'
                ])
            )
        ) or 0

        resumes = db.scalar(
            select(func.count(Resume.resume_id))
        ) or 0

        applications = db.scalar(
            select(func.count(Application.application_id))
        ) or 0

        interviews = db.scalar(
    select(func.count(Interview.interview_id))
) or 0

        avg_resume_score = float(
            db.scalar(
                select(
                    func.avg(
                        ResumeAnalysis.overall_score
                    )
                )
            ) or 0
        )

        resume_views = db.scalar(
    select(func.count(ResumeView.view_id))
) or 0

        return {
            'users': users,
            'jobs': jobs,
            'active_jobs': active_jobs,
            'resumes': resumes,
            'applications': applications,
            'applicants': applications,
            'interviews': interviews,
            'resume_views': resume_views,
            'avg_resume_score': avg_resume_score
        }

    # ---------------------------------------------------------
    # STUDENT / JOB SEEKER DASHBOARD
    # ---------------------------------------------------------

    resume_count = db.scalar(
        select(func.count(Resume.resume_id))
        .where(
            Resume.user_id == user_id
        )
    ) or 0

    application_count = db.scalar(
        select(func.count(Application.application_id))
        .where(
            Application.user_id == user_id
        )
    ) or 0

    latest_score = db.scalar(
        select(ResumeAnalysis.overall_score)
        .where(
            ResumeAnalysis.resume_id.in_(
                select(Resume.resume_id)
                .where(
                    Resume.user_id == user_id
                )
            )
        )
        .order_by(
            ResumeAnalysis.analysis_id.desc()
        )
        .limit(1)
    ) or 0

    return {
        'users': db.scalar(
            select(func.count(User.user_id))
        ) or 0,

        'jobs': db.scalar(
            select(func.count(Job.job_id))
        ) or 0,

        'resumes': resume_count,

        'applications': application_count,

        'avg_resume_score': float(latest_score)
    }

@router.get('/recruiter/analytics')
def recruiter_analytics(
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    role = user['role'].lower()

    # ADMIN: system-wide analytics
    if role == 'admin':
        total_jobs = db.scalar(
            select(func.count(Job.job_id))
        ) or 0

        active_jobs = db.scalar(
            select(func.count(Job.job_id))
            .where(Job.status.in_(['open', 'OPEN', 'published', 'PUBLISHED']))
        ) or 0

        total_applicants = db.scalar(
            select(func.count(Application.application_id))
        ) or 0

        status_rows = db.execute(
            select(
                Application.application_status,
                func.count(Application.application_id)
            )
            .group_by(Application.application_status)
        ).all()

        applications_by_status = [
            {
                'status': status,
                'count': count
            }
            for status, count in status_rows
        ]

        job_rows = db.execute(
            select(
                Job.title,
                func.count(Application.application_id)
            )
            .outerjoin(
                Application,
                Application.job_id == Job.job_id
            )
            .group_by(
                Job.job_id,
                Job.title
            )
            .order_by(
                func.count(Application.application_id).desc()
            )
        ).all()

        applicants_by_job = [
            {
                'job_title': title,
                'applicants': count
            }
            for title, count in job_rows
        ]

        return {
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'total_applicants': total_applicants,
            'applications_by_status': applications_by_status,
            'applicants_by_job': applicants_by_job
        }

    # RECRUITER: recruiter-specific analytics
    if role != 'recruiter':
        raise HTTPException(
            status_code=403,
            detail='Recruiter or admin access required'
        )

    recruiter = db.scalar(
        select(Recruiter).where(
            Recruiter.user_id == user['user_id']
        )
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail='Recruiter profile not found'
        )

    total_jobs = db.scalar(
        select(func.count(Job.job_id))
        .where(
            Job.recruiter_id == recruiter.recruiter_id
        )
    ) or 0

    active_jobs = db.scalar(
        select(func.count(Job.job_id))
        .where(
            Job.recruiter_id == recruiter.recruiter_id,
            Job.status.in_(['open', 'OPEN', 'published', 'PUBLISHED'])
        )
    ) or 0

    total_applicants = db.scalar(
        select(func.count(Application.application_id))
        .join(
            Job,
            Application.job_id == Job.job_id
        )
        .where(
            Job.recruiter_id == recruiter.recruiter_id
        )
    ) or 0

    status_rows = db.execute(
        select(
            Application.application_status,
            func.count(Application.application_id)
        )
        .join(
            Job,
            Application.job_id == Job.job_id
        )
        .where(
            Job.recruiter_id == recruiter.recruiter_id
        )
        .group_by(
            Application.application_status
        )
    ).all()

    applications_by_status = [
        {
            'status': status,
            'count': count
        }
        for status, count in status_rows
    ]

    job_rows = db.execute(
        select(
            Job.title,
            func.count(Application.application_id)
        )
        .outerjoin(
            Application,
            Application.job_id == Job.job_id
        )
        .where(
            Job.recruiter_id == recruiter.recruiter_id
        )
        .group_by(
            Job.job_id,
            Job.title
        )
        .order_by(
            func.count(Application.application_id).desc()
        )
    ).all()

    applicants_by_job = [
        {
            'job_title': title,
            'applicants': count
        }
        for title, count in job_rows
    ]

    return {
        'total_jobs': total_jobs,
        'active_jobs': active_jobs,
        'total_applicants': total_applicants,
        'applications_by_status': applications_by_status,
        'applicants_by_job': applicants_by_job
    }
#----------------------------------------------------------
# NOTIFICATIONS
# ---------------------------------------------------------

@router.get('/notifications')
def notifications(
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    notifications = db.scalars(
        select(Notification)
        .where(Notification.user_id == user['user_id'])
        .order_by(Notification.created_at.desc())
        .limit(20)
    ).all()

    return [
        {
            'notification_id': n.notification_id,
            'title': n.title,
            'message': n.message,
            'notification_type': n.notification_type,
            'is_read': n.is_read,
            'created_at': n.created_at
        }
        for n in notifications
    ]
# ---------------------------------------------------------
# APPLICATIONS
# ---------------------------------------------------------

@router.get('/applications')
def get_applications(
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    rows = db.execute(
        select(
            Application,
            Job.title
        )
        .join(
            Job,
            Application.job_id == Job.job_id
        )
        .where(
            Application.user_id == user['user_id']
        )
        .order_by(
            Application.applied_at.desc()
        )
    ).all()

    return [
        {
            'application_id': app.application_id,
            'job_id': app.job_id,
            'job_title': title,
            'status': app.application_status
        }
        for app, title in rows
    ]


@router.post('/applications')
def create_application(
    x: ApplicationIn,
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    resume = db.scalar(
        select(Resume).where(
            Resume.resume_id == x.resume_id,
            Resume.user_id == user['user_id']
        )
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail='Resume not found or does not belong to you'
        )

    job = db.scalar(
        select(Job).where(
            Job.job_id == x.job_id
        )
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail='Job not found'
        )

    existing = db.scalar(
        select(Application).where(
            Application.job_id == x.job_id,
            Application.user_id == user['user_id']
        )
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail='You have already applied to this job'
        )

    application = Application(
        job_id=x.job_id,
        resume_id=x.resume_id,
        user_id=user['user_id'],
        application_status='applied'
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        'application_id': application.application_id,
        'message': 'Application submitted successfully'
    }
# ---------------------------------------------------------
# RECRUITER APPLICANTS
# ---------------------------------------------------------

@router.get('/recruiter/applicants')
def recruiter_applicants(
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    if user['role'] != 'recruiter':
        raise HTTPException(
            status_code=403,
            detail='Recruiter access required'
        )

    recruiter = db.scalar(
        select(Recruiter).where(
            Recruiter.user_id == user['user_id']
        )
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail='Recruiter profile not found'
        )

    rows = db.execute(
        select(
            Application,
            Job.title,
            User.name,
            User.email,
            Resume.resume_name
        )
        .join(
            Job,
            Application.job_id == Job.job_id
        )
        .join(
            User,
            Application.user_id == User.user_id
        )
        .join(
            Resume,
            Application.resume_id == Resume.resume_id
        )
        .where(
            Job.recruiter_id == recruiter.recruiter_id
        )
        .order_by(
            Application.applied_at.desc()
        )
    ).all()

    return [
        {
            'application_id': app.application_id,
            'job_id': app.job_id,
            'job_title': job_title,
            'applicant_name': name,
            'applicant_email': email,
            'resume_name': resume_name,
            'status': app.application_status,
            'applied_at': app.applied_at
        }
        for app, job_title, name, email, resume_name in rows
    ]

@router.put('/recruiter/applicants/{application_id}/status')
def update_application_status(
    application_id: int,
    status: str,
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    if user['role'] != 'recruiter':
        raise HTTPException(
            status_code=403,
            detail='Recruiter access required'
        )

    allowed_statuses = {
        'applied',
        'shortlisted',
        'rejected',
        'interview'
    }

    status = status.lower()

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail='Invalid application status'
        )

    recruiter = db.scalar(
        select(Recruiter).where(
            Recruiter.user_id == user['user_id']
        )
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail='Recruiter profile not found'
        )

    application = db.scalar(
        select(Application)
        .join(
            Job,
            Application.job_id == Job.job_id
        )
        .where(
            Application.application_id == application_id,
            Job.recruiter_id == recruiter.recruiter_id
        )
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail='Application not found'
        )

    old_status = application.application_status

    application.application_status = status

    job = db.scalar(
        select(Job).where(
            Job.job_id == application.job_id
        )
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail='Job not found'
        )

    if (
        status != old_status
        and status in {'shortlisted', 'rejected', 'interview'}
    ):

        message_map = {
            'shortlisted':
                f'You have been shortlisted for {job.title}.',

            'rejected':
                f'Your application for {job.title} was not selected.',

            'interview':
                f'You have been selected for an interview for {job.title}.'
        }

        notification = Notification(
            user_id=application.user_id,
            title='Application Status Updated',
            message=message_map[status],
            notification_type='application_status',
            is_read=False
        )

        db.add(notification)

    db.commit()
    db.refresh(application)

    return {
        'application_id': application.application_id,
        'status': application.application_status,
        'message': 'Application status updated successfully'
    }
from datetime import datetime

from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session


@router.post('/recruiter/interviews')
def schedule_interview(
    application_id: int,
    scheduled_date: str,
    interview_type: str,
    meeting_link: str = '',
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    if user['role'] != 'recruiter':
        raise HTTPException(
            status_code=403,
            detail='Recruiter access required'
        )

    recruiter = db.scalar(
        select(Recruiter).where(
            Recruiter.user_id == user['user_id']
        )
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail='Recruiter profile not found'
        )

    application = db.scalar(
        select(Application)
        .join(Job, Application.job_id == Job.job_id)
        .where(
            Application.application_id == application_id,
            Job.recruiter_id == recruiter.recruiter_id
        )
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail='Application not found for this recruiter'
        )

    try:
        interview_datetime = datetime.fromisoformat(
            scheduled_date
        )
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail='Invalid date. Use YYYY-MM-DDTHH:MM:SS'
        )

    if interview_type not in ('online', 'offline'):
        raise HTTPException(
            status_code=400,
            detail='Interview type must be online or offline'
        )

    if interview_type == 'online' and not meeting_link.strip():
        raise HTTPException(
            status_code=400,
            detail='Meeting link is required for online interviews'
        )

    interview = Interview(
        application_id=application.application_id,
        recruiter_id=recruiter.recruiter_id,
        scheduled_date=interview_datetime,
        interview_type=interview_type,
        status='scheduled',
        meeting_link=meeting_link.strip() or None
    )

    try:
        db.add(interview)
        db.flush()

        notification = Notification(
            user_id=application.user_id,
            title='Interview Scheduled',
            message=(
                f'Your interview has been scheduled for '
                f'{interview_datetime.strftime("%d %b %Y at %I:%M %p")}.'
            ),
            notification_type='interview',
            is_read=False
        )

        db.add(notification)
        db.commit()
        db.refresh(interview)

        return {
            'interview_id': interview.interview_id,
            'application_id': interview.application_id,
            'scheduled_date': interview.scheduled_date,
            'interview_type': interview.interview_type,
            'status': interview.status,
            'meeting_link': interview.meeting_link,
            'message': 'Interview scheduled successfully'
        }

    except Exception:
        db.rollback()
        raise


@router.get('/recruiter/interviews')
def recruiter_interviews(
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    if user['role'] != 'recruiter':
        raise HTTPException(
            status_code=403,
            detail='Recruiter access required'
        )

    recruiter = db.scalar(
        select(Recruiter).where(
            Recruiter.user_id == user['user_id']
        )
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail='Recruiter profile not found'
        )

    rows = db.execute(
        select(
            Interview,
            Application.job_id,
            Job.title,
            User.name,
            User.email
        )
        .join(
            Application,
            Interview.application_id == Application.application_id
        )
        .join(
            Job,
            Application.job_id == Job.job_id
        )
        .join(
            User,
            Application.user_id == User.user_id
        )
        .where(
            Interview.recruiter_id == recruiter.recruiter_id
        )
        .order_by(Interview.scheduled_date.asc())
    ).all()

    return [
        {
            'interview_id': interview.interview_id,
            'application_id': interview.application_id,
            'job_id': job_id,
            'job_title': job_title,
            'candidate_name': candidate_name,
            'candidate_email': candidate_email,
            'scheduled_date': interview.scheduled_date.isoformat()
                if interview.scheduled_date else None,
            'interview_type': interview.interview_type,
            'status': interview.status,
            'meeting_link': interview.meeting_link
        }
        for (
            interview,
            job_id,
            job_title,
            candidate_name,
            candidate_email
        ) in rows
    ]


@router.put('/recruiter/interviews/{interview_id}/reschedule')
def reschedule_interview(
    interview_id: int,
    scheduled_date: str,
    meeting_link: str = '',
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    if user['role'] != 'recruiter':
        raise HTTPException(
            status_code=403,
            detail='Recruiter access required'
        )

    recruiter = db.scalar(
        select(Recruiter).where(
            Recruiter.user_id == user['user_id']
        )
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail='Recruiter profile not found'
        )

    interview = db.scalar(
        select(Interview).where(
            Interview.interview_id == interview_id,
            Interview.recruiter_id == recruiter.recruiter_id
        )
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail='Interview not found'
        )

    try:
        new_datetime = datetime.fromisoformat(scheduled_date)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail='Invalid date. Use YYYY-MM-DDTHH:MM:SS'
        )

    application = db.scalar(
        select(Application).where(
            Application.application_id == interview.application_id
        )
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail='Application not found'
        )

    job = db.scalar(
        select(Job).where(Job.job_id == application.job_id)
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail='Job not found'
        )

    interview.scheduled_date = new_datetime

    if meeting_link.strip():
        interview.meeting_link = meeting_link.strip()

    interview.status = 'scheduled'

    notification = Notification(
        user_id=application.user_id,
        title='Interview Rescheduled',
        message=(
            f'Your interview for {job.title} has been rescheduled '
            f'to {new_datetime.strftime("%d %b %Y at %I:%M %p")}.'
        ),
        notification_type='interview',
        is_read=False
    )

    try:
        db.add(notification)
        db.commit()
        db.refresh(interview)
    except Exception:
        db.rollback()
        raise

    return {
        'interview_id': interview.interview_id,
        'scheduled_date': interview.scheduled_date.isoformat(),
        'interview_type': interview.interview_type,
        'status': interview.status,
        'meeting_link': interview.meeting_link,
        'message': 'Interview rescheduled successfully'
    }


@router.put('/recruiter/interviews/{interview_id}/cancel')
def cancel_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    if user['role'] != 'recruiter':
        raise HTTPException(
            status_code=403,
            detail='Recruiter access required'
        )

    recruiter = db.scalar(
        select(Recruiter).where(
            Recruiter.user_id == user['user_id']
        )
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail='Recruiter profile not found'
        )

    interview = db.scalar(
        select(Interview).where(
            Interview.interview_id == interview_id,
            Interview.recruiter_id == recruiter.recruiter_id
        )
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail='Interview not found'
        )

    if interview.status == 'cancelled':
        raise HTTPException(
            status_code=400,
            detail='Interview is already cancelled'
        )

    application = db.scalar(
        select(Application).where(
            Application.application_id == interview.application_id
        )
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail='Application not found'
        )

    job = db.scalar(
        select(Job).where(Job.job_id == application.job_id)
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail='Job not found'
        )

    interview.status = 'cancelled'

    notification = Notification(
        user_id=application.user_id,
        title='Interview Cancelled',
        message=f'Your interview for {job.title} has been cancelled.',
        notification_type='interview',
        is_read=False
    )

    try:
        db.add(notification)
        db.commit()
        db.refresh(interview)
    except Exception:
        db.rollback()
        raise

    return {
        'interview_id': interview.interview_id,
        'status': interview.status,
        'message': 'Interview cancelled successfully'
    }
@router.get('/recruiter/candidates')
def find_candidates(
    search: str = '',
    db: Session = Depends(get_db),
    user: dict = Depends(current_user)
):
    if user['role'] != 'recruiter':
        raise HTTPException(
            status_code=403,
            detail='Recruiter access required'
        )

    recruiter = db.scalar(
        select(Recruiter).where(
            Recruiter.user_id == user['user_id']
        )
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail='Recruiter profile not found'
        )

    rows = db.execute(
        select(
            Application,
            Job.title,
            User.name,
            User.email,
            Resume.resume_name,
            Resume.extracted_text
        )
        .join(
            Job,
            Application.job_id == Job.job_id
        )
        .join(
            User,
            Application.user_id == User.user_id
        )
        .join(
            Resume,
            Application.resume_id == Resume.resume_id
        )
        .where(
            Job.recruiter_id == recruiter.recruiter_id
        )
        .order_by(
            Application.applied_at.desc()
        )
    ).all()

    search = search.lower().strip()

    results = []

    for app, job_title, name, email, resume_name, resume_text in rows:

        text_content = (
            f'{name} {email} {resume_text or ""}'
        ).lower()

        if search and search not in text_content:
            continue

        results.append({
            'application_id': app.application_id,
            'job_id': app.job_id,
            'job_title': job_title,
            'candidate_name': name,
            'candidate_email': email,
            'resume_name': resume_name,
            'resume_text': resume_text or '',
            'status': app.application_status,
            'applied_at': app.applied_at
        })

    return results

# ---------------------------------------------------------
# FORGOT PASSWORD
# ---------------------------------------------------------

def _ensure_password_reset_table(db: Session):
    db.execute(text("""
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            reset_id BIGSERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id)
                ON DELETE CASCADE,
            token_hash VARCHAR(64) NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ NOT NULL,
            used BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """))

    db.execute(text("""
        CREATE INDEX IF NOT EXISTS idx_password_reset_user
        ON password_reset_tokens(user_id)
    """))

    db.commit()


def _send_password_reset_email(email: str, reset_link: str):
    host = settings.smtp_host.strip()
    port = settings.smtp_port
    username = settings.smtp_username.strip()
    password = settings.smtp_password.strip()
    sender = settings.smtp_from.strip() or username

    if not host or not username or not password or not sender:
        raise HTTPException(
            status_code=503,
            detail="Email service is not configured."
        )

    message = EmailMessage()
    message["Subject"] = "CareerAI Password Reset"
    message["From"] = sender
    message["To"] = email

    message.set_content(
        f"""We received a request to reset your CareerAI password.

Open this link to create a new password:

{reset_link}

This link expires in 15 minutes and can only be used once.

If you did not request this, you can ignore this email."""
    )

    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, timeout=30) as server:
                server.login(username, password)
                server.send_message(message)
        else:
            with smtplib.SMTP(host, port, timeout=30) as server:
                server.starttls()
                server.login(username, password)
                server.send_message(message)

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Could not send the password reset email."
        )


@router.post("/auth/forgot-password")
def forgot_password(
    data: dict,
    db: Session = Depends(get_db)
):
    email = str(data.get("email", "")).strip().lower()

    if not email or "@" not in email:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid email address."
        )

    user = db.scalar(
        select(User).where(func.lower(User.email) == email)
    )

    # Return the same response whether the account exists or not.
    response = {
        "message": "If an account exists for this email, a reset link will be sent."
    }

    if not user:
        return response

    _ensure_password_reset_table(db)

    # Invalidate previously unused reset links for this user.
    db.execute(
        text("""
            UPDATE password_reset_tokens
            SET used = TRUE
            WHERE user_id = :user_id AND used = FALSE
        """),
        {"user_id": user.user_id}
    )

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    db.execute(
        text("""
            INSERT INTO password_reset_tokens
                (user_id, token_hash, expires_at, used)
            VALUES
                (:user_id, :token_hash, :expires_at, FALSE)
        """),
        {
            "user_id": user.user_id,
            "token_hash": token_hash,
            "expires_at": expires_at
        }
    )
    db.commit()

    reset_link = (
        f"{settings.frontend_url.rstrip('/')}/reset-password?"
        f"{urlencode({'token': token})}"
    )

    try:
        _send_password_reset_email(user.email, reset_link)
    except HTTPException:
        db.execute(
            text("""
                UPDATE password_reset_tokens
                SET used = TRUE
                WHERE token_hash = :token_hash
            """),
            {"token_hash": token_hash}
        )
        db.commit()
        raise

    return response


@router.get("/auth/reset-password/validate")
def validate_password_reset(
    token: str,
    db: Session = Depends(get_db)
):
    if not token:
        raise HTTPException(
            status_code=400,
            detail="Reset token is required."
        )

    _ensure_password_reset_table(db)

    token_hash = hashlib.sha256(token.encode()).hexdigest()

    row = db.execute(
        text("""
            SELECT reset_id, expires_at, used
            FROM password_reset_tokens
            WHERE token_hash = :token_hash
        """),
        {"token_hash": token_hash}
    ).mappings().first()

    if not row or row["used"]:
        raise HTTPException(
            status_code=400,
            detail="This reset link is invalid or has already been used."
        )

    expires_at = row["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=400,
            detail="This reset link has expired. Please request another."
        )

    return {"valid": True}


@router.post("/auth/reset-password")
def reset_password(
    data: dict,
    db: Session = Depends(get_db)
):
    token = str(data.get("token", "")).strip()
    new_password = str(data.get("new_password", ""))

    if not token:
        raise HTTPException(
            status_code=400,
            detail="Reset token is required."
        )

    if (
        len(new_password) < 8
        or not any(c.isupper() for c in new_password)
        or not any(c.islower() for c in new_password)
        or not any(c.isdigit() for c in new_password)
        or not any(not c.isalnum() for c in new_password)
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Password must be at least 8 characters and contain "
                "uppercase, lowercase, number, and special character."
            )
        )

    _ensure_password_reset_table(db)

    token_hash = hashlib.sha256(token.encode()).hexdigest()

    row = db.execute(
        text("""
            SELECT reset_id, user_id, expires_at, used
            FROM password_reset_tokens
            WHERE token_hash = :token_hash
            FOR UPDATE
        """),
        {"token_hash": token_hash}
    ).mappings().first()

    if not row or row["used"]:
        raise HTTPException(
            status_code=400,
            detail="This reset link is invalid or has already been used."
        )

    expires_at = row["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=400,
            detail="This reset link has expired. Please request another."
        )

    user = db.get(User, row["user_id"])

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Account not found."
        )

    user.password_hash = hash_password(new_password)

    db.execute(
        text("""
            UPDATE password_reset_tokens
            SET used = TRUE
            WHERE reset_id = :reset_id
        """),
        {"reset_id": row["reset_id"]}
    )

    # Invalidate any other reset links for this account.
    db.execute(
        text("""
            UPDATE password_reset_tokens
            SET used = TRUE
            WHERE user_id = :user_id
        """),
        {"user_id": user.user_id}
    )

    db.commit()

    return {
        "message": "Password reset successfully. You can now log in."
    }