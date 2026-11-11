from sqlalchemy import Column, BigInteger, Integer, String, Text, DateTime, Boolean, ForeignKey, Numeric, JSON, Date, Enum
from sqlalchemy.sql import func
from ..db import Base

class User(Base):
    __tablename__ = 'users'
    user_id = Column(BigInteger, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(String(30), nullable=False)

class Student(Base):
    __tablename__ = 'students'

    student_id = Column(BigInteger, primary_key=True)
    user_id = Column(
        BigInteger,
        ForeignKey('users.user_id', ondelete='CASCADE'),
        unique=True
    )

    college = Column(String(180))
    degree = Column(String(160))
    branch = Column(String(160))
    current_year = Column(Integer)
    expected_graduation = Column(Integer)
    cgpa = Column(Numeric)
    career_interests = Column(Text)
    preferred_roles = Column(Text)
    preferred_locations = Column(Text)



class JobSeeker(Base):
    __tablename__ = 'job_seekers'

    seeker_id = Column(BigInteger, primary_key=True)
    user_id = Column(
        BigInteger,
        ForeignKey('users.user_id', ondelete='CASCADE'),
        unique=True
    )
    experience_level = Column(String(100))
    career_goal = Column(Text)
    bio = Column(Text)
    preferred_roles = Column(Text)
    preferred_industries = Column(Text)


class Recruiter(Base):
    __tablename__ = 'recruiters'

    recruiter_id = Column(BigInteger, primary_key=True)
    user_id = Column(
        BigInteger,
        ForeignKey('users.user_id', ondelete='CASCADE'),
        unique=True
    )
    company_id = Column(
        BigInteger,
        ForeignKey('companies.company_id')
    )


class Company(Base):
    __tablename__ = 'companies'

    company_id = Column(BigInteger, primary_key=True)
    name = Column(String(180), nullable=False)
    description = Column(Text)
    industry = Column(String(120))
    website = Column(Text)
    location = Column(String(160))


class Resume(Base):
    __tablename__ = 'resumes'

    resume_id = Column(BigInteger, primary_key=True)
    user_id = Column(
        BigInteger,
        ForeignKey('users.user_id')
    )
    resume_name = Column(String(180))
    file_path = Column(Text)
    file_type = Column(String(50))
    extracted_text = Column(Text)
    is_primary = Column(Boolean, default=False)
    visibility = Column(String(30), default='private')
    status = Column(String(30), default='uploaded')
    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class Job(Base):
    __tablename__ = 'jobs'
    job_id = Column(BigInteger, primary_key=True)
    recruiter_id = Column(BigInteger, ForeignKey('recruiters.recruiter_id'))
    company_id = Column(BigInteger, ForeignKey('companies.company_id'), nullable=False)
    title = Column(String(180))
    description = Column(Text)
    location = Column(String(160))
    employment_type = Column(String(50))
    experience_required = Column(Integer)
    industry = Column(String(120))
    status = Column(String(30), default='DRAFT')
    posted_at = Column(DateTime(timezone=True), server_default=func.now())

class Application(Base):
    __tablename__ = 'applications'

    application_id = Column(BigInteger, primary_key=True)
    job_id = Column(BigInteger, ForeignKey('jobs.job_id'))
    user_id = Column(BigInteger, ForeignKey('users.user_id'))
    resume_id = Column(BigInteger, ForeignKey('resumes.resume_id'))
    application_status = Column(
        String(20),
        default='applied'
    )
    applied_at = Column(
        DateTime(timezone=False),
        server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=False),
        server_default=func.now()
    )

class Interview(Base):
    __tablename__ = 'interviews'

    interview_id = Column(Integer, primary_key=True)
    application_id = Column(
        BigInteger,
        ForeignKey('applications.application_id'),
        nullable=False
    )
    recruiter_id = Column(
        Integer,
        ForeignKey('recruiters.recruiter_id'),
        nullable=False
    )
    scheduled_date = Column(DateTime, nullable=False)
    interview_type = Column(String(50), nullable=False)
    status = Column(
        String(30),
        nullable=False,
        default='scheduled'
    )
    meeting_link = Column(String(500), nullable=True)

class ResumeAnalysis(Base):
    __tablename__ = 'resume_analysis'

    analysis_id = Column(BigInteger, primary_key=True)
    resume_id = Column(
        BigInteger,
        ForeignKey('resumes.resume_id')
    )
    overall_score = Column(Numeric)
    ats_score = Column(Numeric)
    skills_score = Column(Numeric)
    experience_score = Column(Numeric)
    education_score = Column(Numeric)
    projects_score = Column(Numeric)
    formatting_score = Column(Numeric)
    keyword_score = Column(Numeric)
    analyzed_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
class JobMatch(Base):
    __tablename__ = 'job_matches'

    match_id = Column(BigInteger, primary_key=True)
    resume_id = Column(BigInteger, ForeignKey('resumes.resume_id'))
    job_id = Column(BigInteger, ForeignKey('jobs.job_id'))
    match_percentage = Column(Numeric)
    matching_skills = Column(JSON)
    missing_skills = Column(JSON)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())


class Notification(Base):
    __tablename__ = 'notifications'

    notification_id = Column(BigInteger, primary_key=True)
    user_id = Column(
        BigInteger,
        ForeignKey('users.user_id')
    )
    title = Column(String(180))
    message = Column(Text)
    notification_type = Column(String(60))
    is_read = Column(Boolean, default=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class ResumeView(Base):
    __tablename__ = 'resume_views'

    view_id = Column(BigInteger, primary_key=True)
    resume_id = Column(
        BigInteger,
        ForeignKey('resumes.resume_id'),
        nullable=False
    )
    recruiter_id = Column(
        Integer,
        ForeignKey('recruiters.recruiter_id'),
        nullable=False
    )
    viewed_at = Column(
        DateTime,
        server_default=func.now()
    )