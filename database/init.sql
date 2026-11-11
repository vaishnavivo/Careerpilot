CREATE TYPE user_role AS ENUM ('STUDENT','JOB_SEEKER','RECRUITER','ADMIN');
CREATE TYPE account_status AS ENUM ('ACTIVE','SUSPENDED','PENDING');
CREATE TYPE application_status AS ENUM ('APPLIED','UNDER_REVIEW','SHORTLISTED','INTERVIEW','SELECTED','REJECTED');
CREATE TYPE job_status AS ENUM ('DRAFT','PUBLISHED','CLOSED');

CREATE TABLE users (
 user_id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL,
 password_hash TEXT NOT NULL, role user_role NOT NULL, phone VARCHAR(30), location VARCHAR(160),
 profile_image TEXT, status account_status NOT NULL DEFAULT 'ACTIVE', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE students (student_id BIGSERIAL PRIMARY KEY, user_id BIGINT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
 education_level VARCHAR(100), university VARCHAR(180), degree VARCHAR(160), specialization VARCHAR(160), graduation_year INT, cgpa NUMERIC(4,2), career_goal TEXT, bio TEXT,
 linkedin_url TEXT, github_url TEXT, portfolio_url TEXT);
CREATE TABLE job_seekers (seeker_id BIGSERIAL PRIMARY KEY, user_id BIGINT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
 experience_level VARCHAR(100), career_goal TEXT, bio TEXT, preferred_roles TEXT, preferred_industries TEXT, preferred_work_mode VARCHAR(30), expected_salary VARCHAR(80), linkedin_url TEXT, github_url TEXT, portfolio_url TEXT);
CREATE TABLE companies (company_id BIGSERIAL PRIMARY KEY, name VARCHAR(180) NOT NULL, description TEXT, industry VARCHAR(120), website TEXT, location VARCHAR(160), created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE recruiters (recruiter_id BIGSERIAL PRIMARY KEY, user_id BIGINT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, company_id BIGINT REFERENCES companies(company_id) ON DELETE SET NULL);
CREATE TABLE resumes (resume_id BIGSERIAL PRIMARY KEY, seeker_id BIGINT REFERENCES job_seekers(seeker_id) ON DELETE CASCADE, student_id BIGINT REFERENCES students(student_id) ON DELETE CASCADE,
 resume_name VARCHAR(180) NOT NULL, file_path TEXT, extracted_text TEXT, visibility VARCHAR(30) NOT NULL DEFAULT 'PRIVATE', is_primary BOOLEAN NOT NULL DEFAULT false,
 status VARCHAR(30) NOT NULL DEFAULT 'UPLOADED', uploaded_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now(), CHECK ((seeker_id IS NOT NULL) OR (student_id IS NOT NULL)));
CREATE TABLE resume_versions (version_id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE, version_name VARCHAR(180) NOT NULL,
 version_number INT NOT NULL, target_job VARCHAR(180), job_description TEXT, resume_content JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now(), UNIQUE(resume_id,version_number));
CREATE TABLE skills (skill_id BIGSERIAL PRIMARY KEY, skill_name VARCHAR(120) UNIQUE NOT NULL, skill_category VARCHAR(100));
CREATE TABLE student_skills (student_id BIGINT REFERENCES students(student_id) ON DELETE CASCADE, skill_id BIGINT REFERENCES skills(skill_id) ON DELETE CASCADE, proficiency_level VARCHAR(40), PRIMARY KEY(student_id,skill_id));
CREATE TABLE seeker_skills (seeker_id BIGINT REFERENCES job_seekers(seeker_id) ON DELETE CASCADE, skill_id BIGINT REFERENCES skills(skill_id) ON DELETE CASCADE, proficiency_level VARCHAR(40), PRIMARY KEY(seeker_id,skill_id));
CREATE TABLE education (education_id BIGSERIAL PRIMARY KEY, student_id BIGINT REFERENCES students(student_id) ON DELETE CASCADE, seeker_id BIGINT REFERENCES job_seekers(seeker_id) ON DELETE CASCADE,
 degree VARCHAR(160) NOT NULL, institution VARCHAR(180) NOT NULL, field_of_study VARCHAR(160), start_year INT, end_year INT, grade VARCHAR(40));
CREATE TABLE experience (experience_id BIGSERIAL PRIMARY KEY, seeker_id BIGINT REFERENCES job_seekers(seeker_id) ON DELETE CASCADE, student_id BIGINT REFERENCES students(student_id) ON DELETE CASCADE,
 company VARCHAR(180) NOT NULL, job_title VARCHAR(160) NOT NULL, description TEXT, start_date DATE, end_date DATE);
CREATE TABLE projects (project_id BIGSERIAL PRIMARY KEY, seeker_id BIGINT REFERENCES job_seekers(seeker_id) ON DELETE CASCADE, student_id BIGINT REFERENCES students(student_id) ON DELETE CASCADE,
 project_name VARCHAR(180) NOT NULL, description TEXT, technologies TEXT, project_url TEXT);
CREATE TABLE certifications (certification_id BIGSERIAL PRIMARY KEY, seeker_id BIGINT REFERENCES job_seekers(seeker_id) ON DELETE CASCADE, student_id BIGINT REFERENCES students(student_id) ON DELETE CASCADE,
 certification_name VARCHAR(180) NOT NULL, issuing_organization VARCHAR(180), issue_date DATE, credential_url TEXT);
CREATE TABLE jobs (job_id BIGSERIAL PRIMARY KEY, recruiter_id BIGINT NOT NULL REFERENCES recruiters(recruiter_id) ON DELETE CASCADE, title VARCHAR(180) NOT NULL, description TEXT NOT NULL,
 location VARCHAR(160), employment_type VARCHAR(50), experience_required VARCHAR(100), salary_range VARCHAR(100), industry VARCHAR(120), posted_at TIMESTAMPTZ DEFAULT now(), closing_date DATE, status job_status NOT NULL DEFAULT 'DRAFT');
CREATE TABLE job_skills (job_id BIGINT REFERENCES jobs(job_id) ON DELETE CASCADE, skill_id BIGINT REFERENCES skills(skill_id) ON DELETE CASCADE, required_level VARCHAR(40), PRIMARY KEY(job_id,skill_id));
CREATE TABLE applications (application_id BIGSERIAL PRIMARY KEY, job_id BIGINT NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE, resume_id BIGINT NOT NULL REFERENCES resumes(resume_id) ON DELETE RESTRICT,
 seeker_id BIGINT REFERENCES job_seekers(seeker_id) ON DELETE CASCADE, student_id BIGINT REFERENCES students(student_id) ON DELETE CASCADE, application_status application_status NOT NULL DEFAULT 'APPLIED', applied_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now(), CHECK ((seeker_id IS NOT NULL) OR (student_id IS NOT NULL)), UNIQUE(job_id,resume_id));
CREATE TABLE resume_analysis (analysis_id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE, overall_score NUMERIC(5,2), ats_score NUMERIC(5,2), skills_score NUMERIC(5,2), experience_score NUMERIC(5,2), education_score NUMERIC(5,2), projects_score NUMERIC(5,2), formatting_score NUMERIC(5,2), keyword_score NUMERIC(5,2), strengths JSONB, analyzed_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE resume_suggestions (suggestion_id BIGSERIAL PRIMARY KEY, analysis_id BIGINT NOT NULL REFERENCES resume_analysis(analysis_id) ON DELETE CASCADE, category VARCHAR(80), suggestion_text TEXT NOT NULL, priority VARCHAR(30));
CREATE TABLE job_matches (match_id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE, job_id BIGINT NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
 match_percentage NUMERIC(5,2), matching_skills JSONB, missing_skills JSONB, missing_keywords JSONB, generated_at TIMESTAMPTZ DEFAULT now(), UNIQUE(resume_id,job_id));
CREATE TABLE saved_jobs (saved_job_id BIGSERIAL PRIMARY KEY, student_id BIGINT REFERENCES students(student_id) ON DELETE CASCADE, seeker_id BIGINT REFERENCES job_seekers(seeker_id) ON DELETE CASCADE, job_id BIGINT NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE, saved_at TIMESTAMPTZ DEFAULT now(), UNIQUE(job_id,student_id,seeker_id));
CREATE TABLE saved_candidates (saved_candidate_id BIGSERIAL PRIMARY KEY, recruiter_id BIGINT NOT NULL REFERENCES recruiters(recruiter_id) ON DELETE CASCADE, resume_id BIGINT NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE, saved_at TIMESTAMPTZ DEFAULT now(), UNIQUE(recruiter_id,resume_id));
CREATE TABLE resume_views (view_id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE, recruiter_id BIGINT NOT NULL REFERENCES recruiters(recruiter_id) ON DELETE CASCADE, viewed_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE notifications (notification_id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, title VARCHAR(180) NOT NULL, message TEXT NOT NULL, notification_type VARCHAR(60), is_read BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE announcements (announcement_id BIGSERIAL PRIMARY KEY, admin_id BIGINT NOT NULL REFERENCES users(user_id), title VARCHAR(180) NOT NULL, message TEXT NOT NULL, target_role user_role, created_at TIMESTAMPTZ DEFAULT now(), expires_at TIMESTAMPTZ);
CREATE TABLE interviews (interview_id BIGSERIAL PRIMARY KEY, application_id BIGINT NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE, recruiter_id BIGINT NOT NULL REFERENCES recruiters(recruiter_id), seeker_id BIGINT REFERENCES job_seekers(seeker_id), student_id BIGINT REFERENCES students(student_id), scheduled_date TIMESTAMPTZ NOT NULL, interview_type VARCHAR(50), status VARCHAR(40) DEFAULT 'SCHEDULED', meeting_link TEXT);
CREATE TABLE feedback (feedback_id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, rating INT CHECK(rating BETWEEN 1 AND 5), comments TEXT, created_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX idx_users_role ON users(role); CREATE INDEX idx_jobs_status ON jobs(status); CREATE INDEX idx_jobs_title ON jobs USING gin(to_tsvector('english',title));
CREATE INDEX idx_jobs_description ON jobs USING gin(to_tsvector('english',description)); CREATE INDEX idx_resumes_text ON resumes USING gin(to_tsvector('english',coalesce(extracted_text,'')));
CREATE INDEX idx_notifications_user_read ON notifications(user_id,is_read); CREATE INDEX idx_applications_job_status ON applications(job_id,application_status); CREATE INDEX idx_resume_analysis_score ON resume_analysis(overall_score DESC);

INSERT INTO skills(skill_name,skill_category) VALUES
('Python','Programming'),('Java','Programming'),('JavaScript','Programming'),('SQL','Database'),('PostgreSQL','Database'),('FastAPI','Backend'),('React','Frontend'),('Machine Learning','AI/ML'),('Docker','Cloud'),('AWS','Cloud'),('Power BI','Analytics'),('Figma','Design'),('Excel','Business'),('Communication','Soft Skills'),('Project Management','Management'),('AutoCAD','Engineering') ON CONFLICT DO NOTHING;
