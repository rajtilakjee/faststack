import pytest
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.models.user import User

pytestmark = pytest.mark.integration


def test_create_and_fetch_user(db_session) -> None:
    user = User(email="alice@example.com", hashed_password="hashed-secret")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    assert user.id is not None
    assert user.is_active is True
    assert user.created_at is not None

    fetched = db_session.scalar(select(User).where(User.email == "alice@example.com"))
    assert fetched is not None
    assert fetched.id == user.id


def test_user_email_must_be_unique(db_session) -> None:
    db_session.add(User(email="dup@example.com", hashed_password="a"))
    db_session.commit()

    db_session.add(User(email="dup@example.com", hashed_password="b"))
    with pytest.raises(IntegrityError):
        db_session.commit()

    db_session.rollback()
