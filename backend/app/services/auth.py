from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.security import (
    generate_session_token,
    hash_password,
    session_expires_at,
    verify_password,
)
from app.models.session import UserSession
from app.models.user import User, UserRole


class AuthError(Exception):
    pass


class EmailAlreadyRegisteredError(AuthError):
    pass


class InvalidCredentialsError(AuthError):
    pass


class InactiveUserError(AuthError):
    pass


def register_user(db: Session, *, email: str, password: str) -> User:
    existing = db.scalar(select(User).where(User.email == email))
    if existing is not None:
        raise EmailAlreadyRegisteredError

    user = User(
        email=email,
        hashed_password=hash_password(password),
        role=UserRole.USER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, *, email: str, password: str) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if user is None or not verify_password(password, user.hashed_password):
        raise InvalidCredentialsError
    if not user.is_active:
        raise InactiveUserError
    return user


def create_session(db: Session, *, user: User) -> UserSession:
    session = UserSession(
        token=generate_session_token(),
        user_id=user.id,
        expires_at=session_expires_at(),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_session_by_token(db: Session, token: str) -> UserSession | None:
    session = db.scalar(
        select(UserSession)
        .where(UserSession.token == token)
        .options(joinedload(UserSession.user))
    )
    if session is None:
        return None
    if session.expires_at <= datetime.now(tz=UTC):
        db.delete(session)
        db.commit()
        return None
    return session


def revoke_session(db: Session, token: str) -> None:
    session = db.scalar(select(UserSession).where(UserSession.token == token))
    if session is not None:
        db.delete(session)
        db.commit()
