from fastapi import APIRouter, Cookie, HTTPException, Response, status

from app.api.deps import CurrentUser, DbSession
from app.config import settings
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, UserPublic
from app.services.auth import (
    EmailAlreadyRegisteredError,
    InactiveUserError,
    InvalidCredentialsError,
    authenticate_user,
    create_session,
    register_user,
    revoke_session,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        max_age=settings.session_max_age_seconds,
        httponly=settings.session_cookie_httponly,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        path="/",
    )


def _clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.session_cookie_name,
        httponly=settings.session_cookie_httponly,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        path="/",
    )


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: RegisterRequest,
    response: Response,
    db: DbSession,
) -> User:
    try:
        user = register_user(db, email=payload.email, password=payload.password)
    except EmailAlreadyRegisteredError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        ) from exc

    session = create_session(db, user=user)
    _set_session_cookie(response, session.token)
    return user


@router.post("/login", response_model=UserPublic)
def login(payload: LoginRequest, response: Response, db: DbSession) -> User:
    try:
        user = authenticate_user(
            db,
            email=payload.email,
            password=payload.password,
        )
    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        ) from exc
    except InactiveUserError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        ) from exc

    session = create_session(db, user=user)
    _set_session_cookie(response, session.token)
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    db: DbSession,
    session_token: str | None = Cookie(
        default=None,
        alias=settings.session_cookie_name,
    ),
) -> None:
    if session_token is not None:
        revoke_session(db, session_token)
    _clear_session_cookie(response)


@router.get("/me", response_model=UserPublic)
def read_current_user(current_user: CurrentUser) -> User:
    return current_user
