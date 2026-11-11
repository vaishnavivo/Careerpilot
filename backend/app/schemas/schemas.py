from pydantic import BaseModel,EmailStr,Field
class RegisterIn(BaseModel): name:str; email:EmailStr; password:str=Field(min_length=8); role:str
class LoginIn(BaseModel): email:EmailStr; password:str
class JobIn(BaseModel):
    title: str
    description: str
    location: str = ''
    employment_type: str = 'Full-time'
    experience_required: int = 0
    industry: str = ''
class MatchIn(BaseModel): resume_id:int; job_id:int
class JDMatchIn(BaseModel): resume_id:int; job_description:str
class ApplicationIn(BaseModel):
    job_id: int
    resume_id: int
