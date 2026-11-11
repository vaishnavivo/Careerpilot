from datetime import datetime,timedelta,timezone
from passlib.context import CryptContext
from jose import jwt
from .config import settings
pwd=CryptContext(schemes=['bcrypt'],deprecated='auto')
def hash_password(p): return pwd.hash(p)
def verify_password(p,h): return pwd.verify(p,h)
def create_token(user_id,role):
 exp=datetime.now(timezone.utc)+timedelta(minutes=settings.access_token_expire_minutes)
 return jwt.encode({'sub':str(user_id),'role':role,'exp':exp},settings.secret_key,algorithm='HS256')
def get_current_user(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=['HS256']
        )
        return {
            'user_id': int(payload['sub']),
            'role': payload['role']
        }
    except Exception:
        raise ValueError('Invalid token')