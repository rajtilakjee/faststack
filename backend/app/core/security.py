import secrets
from datetime import UTC, datetime, timedelta

from pwdlib import PasswordHash

from app.config import settings

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def generate_session_token() -> str:
    return secrets.token_urlsafe(32)


def session_expires_at() -> datetime:
    return datetime.now(tz=UTC) + timedelta(seconds=settings.session_max_age_seconds)
