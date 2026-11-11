-- 1. Users by role
SELECT role, COUNT(*) AS total_users FROM users GROUP BY role ORDER BY total_users DESC;
-- 2. Jobs with highest applicants
SELECT j.job_id,j.title,COUNT(a.application_id) applicants FROM jobs j LEFT JOIN applications a ON a.job_id=j.job_id GROUP BY j.job_id,j.title ORDER BY applicants DESC;
-- 3. Most demanded skills
SELECT s.skill_name,COUNT(js.job_id) demand FROM skills s JOIN job_skills js ON js.skill_id=s.skill_id GROUP BY s.skill_id,s.skill_name ORDER BY demand DESC;
-- 4. Candidates above score
SELECT u.name,r.resume_name,ra.overall_score FROM users u JOIN students st ON st.user_id=u.user_id JOIN resumes r ON r.student_id=st.student_id JOIN resume_analysis ra ON ra.resume_id=r.resume_id WHERE ra.overall_score>=80 ORDER BY ra.overall_score DESC;
-- 5. Average resume score by education level
SELECT st.degree,AVG(ra.overall_score) avg_score FROM students st JOIN resumes r ON r.student_id=st.student_id JOIN resume_analysis ra ON ra.resume_id=r.resume_id GROUP BY st.degree HAVING AVG(ra.overall_score)>60;
-- 6. Jobs and recruiter/company information
SELECT j.title,c.name AS company,j.location,j.status FROM jobs j JOIN recruiters r ON r.recruiter_id=j.recruiter_id LEFT JOIN companies c ON c.company_id=r.company_id ORDER BY j.posted_at DESC;
-- 7. Application status report
SELECT application_status,COUNT(*) total FROM applications GROUP BY application_status ORDER BY total DESC;
-- 8. Missing skills across match records
SELECT x.skill,COUNT(*) missing_count FROM job_matches jm CROSS JOIN LATERAL jsonb_array_elements_text(jm.missing_skills) x(skill) GROUP BY x.skill ORDER BY missing_count DESC;
