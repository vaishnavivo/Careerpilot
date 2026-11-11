import re

SKILL_ALIASES = {
    'python': 'Python',
    'java': 'Java',
    'javascript': 'JavaScript',
    'sql': 'SQL',
    'postgresql': 'PostgreSQL',
    'fastapi': 'FastAPI',
    'react': 'React',
    'machine learning': 'Machine Learning',
    'docker': 'Docker',
    'aws': 'AWS',
    'power bi': 'Power BI',
    'figma': 'Figma',
    'excel': 'Excel',
    'communication': 'Communication',
    'project management': 'Project Management',
    'autocad': 'AutoCAD'
}


def extract_skills(text):
    text_lower = text.lower()

    return sorted({
        value
        for key, value in SKILL_ALIASES.items()
        if key in text_lower
    })


def contains_any(text, words):
    text_lower = text.lower()
    return any(word in text_lower for word in words)


def analyze_resume(text):

    text_lower = text.lower()

    skills = extract_skills(text)

    sections = {
        'summary': contains_any(
            text,
            ['summary', 'profile', 'objective']
        ),
        'education': 'education' in text_lower,
        'experience': contains_any(
            text,
            ['experience', 'internship', 'work experience']
        ),
        'projects': 'projects' in text_lower,
        'skills': 'skills' in text_lower,
        'certification': contains_any(
            text,
            ['certification', 'certifications']
        )
    }

    section_count = sum(sections.values())

    word_count = len(
        re.findall(r'\b\w+\b', text)
    )

    quantified_results = len(
        re.findall(
            r'\b\d+%|\b\d+\+|\b\d+\s*(?:users|projects|months|years|clients)',
            text_lower
        )
    )

    # -------------------------
    # ATS SCORE
    # -------------------------

    ats_score = 40

    ats_score += section_count * 5

    if word_count >= 250:
        ats_score += 5

    if word_count >= 500:
        ats_score += 5

    if len(skills) >= 3:
        ats_score += 5

    if len(skills) >= 7:
        ats_score += 5

    if quantified_results > 0:
        ats_score += 5

    ats_score = min(95, ats_score)

    # -------------------------
    # SKILLS SCORE
    # -------------------------

    skills_score = 25 + min(len(skills) * 6, 60)

    if sections['skills']:
        skills_score += 5

    skills_score = min(95, skills_score)

    # -------------------------
    # EXPERIENCE SCORE
    # -------------------------

    if sections['experience']:

        experience_score = 55

        if quantified_results > 0:
            experience_score += 15

        if word_count >= 500:
            experience_score += 10

        if word_count >= 800:
            experience_score += 5

        experience_score = min(90, experience_score)

    else:
        experience_score = 30

    # -------------------------
    # EDUCATION SCORE
    # -------------------------

    if sections['education']:

        education_score = 60

        if contains_any(
            text,
            [
                'b.tech',
                'btech',
                'b.e',
                'bachelor',
                'm.tech',
                'mtech',
                'master',
                'degree'
            ]
        ):
            education_score += 20

        education_score = min(90, education_score)

    else:
        education_score = 30

    # -------------------------
    # PROJECT SCORE
    # -------------------------

    if sections['projects']:

        projects_score = 55

        if quantified_results > 0:
            projects_score += 10

        if len(skills) >= 3:
            projects_score += 10

        if word_count >= 500:
            projects_score += 10

        projects_score = min(90, projects_score)

    else:
        projects_score = 30

    # -------------------------
    # FORMATTING SCORE
    # -------------------------

    formatting_score = 40

    if section_count >= 3:
        formatting_score += 15

    if section_count >= 5:
        formatting_score += 15

    if 250 <= word_count <= 900:
        formatting_score += 15

    formatting_score = min(90, formatting_score)

    # -------------------------
    # KEYWORD SCORE
    # -------------------------

    keyword_score = 30 + min(len(skills) * 5, 50)

    if section_count >= 4:
        keyword_score += 10

    keyword_score = min(90, keyword_score)

    # -------------------------
    # SUGGESTIONS
    # -------------------------

    suggestions = []

    if not sections['summary']:
        suggestions.append(
            (
                'Content',
                'Add a concise professional summary.',
                'high'
            )
        )

    if not sections['experience']:
        suggestions.append(
            (
                'Experience',
                'Add experience, internship, or relevant practical work.',
                'high'
            )
        )

    if not sections['projects']:
        suggestions.append(
            (
                'Projects',
                'Add 2-3 relevant projects with measurable outcomes.',
                'medium'
            )
        )

    if not sections['education']:
        suggestions.append(
            (
                'Education',
                'Add your degree, institution, and graduation details.',
                'high'
            )
        )

    if len(skills) < 5:
        suggestions.append(
            (
                'Skills',
                'Add more relevant technical and professional skills.',
                'medium'
            )
        )

    if quantified_results == 0:
        suggestions.append(
            (
                'Achievements',
                'Add measurable results such as percentages, numbers, or outcomes.',
                'medium'
            )
        )

    if word_count < 250:
        suggestions.append(
            (
                'Content',
                'Add more detail about your experience, projects, and achievements.',
                'medium'
            )
        )

    # -------------------------
    # OVERALL SCORE
    # -------------------------

    overall_score = round(
        (
            ats_score * 0.20 +
            skills_score * 0.15 +
            experience_score * 0.15 +
            education_score * 0.10 +
            projects_score * 0.15 +
            formatting_score * 0.10 +
            keyword_score * 0.15
        )
    )

    overall_score = min(95, max(0, overall_score))

    return {
        'overall_score': overall_score,
        'ats_score': ats_score,
        'skills_score': skills_score,
        'experience_score': experience_score,
        'education_score': education_score,
        'projects_score': projects_score,
        'formatting_score': formatting_score,
        'keyword_score': keyword_score,
        'skills': skills,
        'suggestions': suggestions
    }

def match_resume_job(resume, job):

    resume_skills = set(
        extract_skills(resume)
    )

    job_skills = set(
        extract_skills(job)
    )

    matching = sorted(
        resume_skills & job_skills
    )

    missing = sorted(
        job_skills - resume_skills
    )

    percentage = round(
        (len(matching) / max(1, len(job_skills))) * 100,
        2
    )

    return {
        'match_percentage': percentage,
        'matching_skills': matching,
        'missing_skills': missing,
        'missing_keywords': missing
    }


def improve_resume(text, job_description=''):

    skills = extract_skills(text)

    target = extract_skills(
        job_description
    )

    intro = (
        'Professional profile optimized from your existing information. '
        + (
            'Targeted toward '
            + ', '.join(target)
            + '.'
            if target
            else ''
        )
    )

    return {
        'summary': intro,
        'skills': skills,
        'improvement_notes': [
            'Use action verbs and measurable outcomes.',
            'Prioritize skills relevant to the target role.',
            'Keep all claims truthful and supported by the original resume.'
        ],
        'source_preserved': True
    }