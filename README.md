# AI Resume Analyzer & Career Mentor

A database-first recruitment platform built for a DBMS academic project and realistic product demonstration.

## Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Recharts, Lucide
- Backend: FastAPI, SQLAlchemy, JWT, bcrypt/Argon2-compatible password hashing
- Database: PostgreSQL 16
- AI layer: local deterministic NLP fallback for skill extraction, scoring, matching and truthful resume improvement; can be replaced by an external LLM provider.

## Run locally
### 1. Start PostgreSQL
`docker compose up -d db`

### 2. Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. API docs: http://localhost:8000/docs.

## Environment
Copy `.env.example` to `.env` and change `SECRET_KEY` before deployment.

## Database
`database/init.sql` creates normalized relational tables, constraints and indexes. `database/queries.sql` contains DBMS-viva-ready SELECT/JOIN/GROUP BY/HAVING/subquery-style reporting queries. `database/seed_demo.sql` contains demo records.

## Important security behavior
- Passwords are hashed; the raw password is never stored or returned.
- Admin APIs should never return `password_hash`.
- File uploads must be validated and stored outside public static directories in production.
- The sample frontend has demo login routing for presentation. Production authentication should use the FastAPI JWT endpoint and authenticated-user dependencies on every protected route.

## AI behavior
The included local AI service is deliberately conservative. It extracts only recognized skills and does not invent qualifications. Scores are application-generated indicators, not guarantees of an actual ATS outcome. For production, replace the service implementation with a vetted model provider while retaining PostgreSQL as the source of truth.
