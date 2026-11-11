from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = 'postgresql+psycopg://postgres:Resume12345@localhost:5432/resume_analyzer'
    secret_key: str = 'change-this-in-production'
    access_token_expire_minutes: int = 120
    cors_origins: str = 'http://localhost:5173,http://127.0.0.1:5173'
    openai_api_key: str = ''

    smtp_host: str = ''
    smtp_port: int = 587
    smtp_username: str = ''
    smtp_password: str = ''
    smtp_from: str = ''
    frontend_url: str = 'http://localhost:5173'

    class Config:
        env_file = '.env'


settings = Settings()