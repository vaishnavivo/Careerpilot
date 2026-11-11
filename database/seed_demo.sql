-- Demo accounts. Replace password hashes in real deployments. Public registration is preferred.
INSERT INTO users(name,email,password_hash,role) VALUES
('Demo Student','student@demo.local','$2b$12$LQv3c1yqBW5lR7dVwQJ8AOT3r1V9h5uX7o8J4J8Y6M0f9Qq3u4f6a','STUDENT'),
('Demo Recruiter','recruiter@demo.local','$2b$12$LQv3c1yqBW5lR7dVwQJ8AOT3r1V9h5uX7o8J4J8Y6M0f9Qq3u4f6a','RECRUITER'),
('Demo Admin','admin@demo.local','$2b$12$LQv3c1yqBW5lR7dVwQJ8AOT3r1V9h5uX7o8J4J8Y6M0f9Qq3u4f6a','ADMIN') ON CONFLICT(email) DO NOTHING;
INSERT INTO students(user_id,degree,specialization,university,graduation_year,career_goal) SELECT user_id,'B.Tech','Computer Science','Demo University',2027,'Backend Developer' FROM users WHERE email='student@demo.local' ON CONFLICT(user_id) DO NOTHING;
INSERT INTO companies(name,description,industry,website,location) VALUES('NovaTech Solutions','Technology and analytics company','Technology','https://example.com','Hyderabad') ON CONFLICT DO NOTHING;
INSERT INTO recruiters(user_id,company_id) SELECT u.user_id,c.company_id FROM users u CROSS JOIN companies c WHERE u.email='recruiter@demo.local' AND c.name='NovaTech Solutions' ON CONFLICT(user_id) DO NOTHING;
INSERT INTO jobs(recruiter_id,title,description,location,employment_type,experience_required,salary_range,industry,status) SELECT r.recruiter_id,'Backend Python Developer','Python SQL FastAPI PostgreSQL REST APIs Docker','Hyderabad','Full-time','0-2 years','₹6-10 LPA','Technology','PUBLISHED' FROM recruiters r JOIN users u ON u.user_id=r.user_id WHERE u.email='recruiter@demo.local';
