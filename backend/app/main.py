from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from .core.config import settings
app=FastAPI(title='AI Resume Analyzer & Career Mentor',version='1.0.0',description='Database-first career platform with AI resume intelligence.')
app.add_middleware(CORSMiddleware,allow_origins=settings.cors_origins.split(','),allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
app.include_router(router)
@app.get('/health')
def health(): return {'status':'ok','database':'PostgreSQL'}
