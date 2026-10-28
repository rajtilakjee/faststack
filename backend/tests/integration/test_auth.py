import pytest
from fastapi.testclient import TestClient

from app.config import settings
from app.models.user import User, UserRole
from app.services.auth import hash_password

pytestmark = pytest.mark.integration


def test_register_login_me_logout(client: TestClient) -> None:
    email = "auth-flow@example.com"

    register_response = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123"},
    )
    assert register_response.status_code == 201
    assert register_response.json()["email"] == email
    assert settings.session_cookie_name in register_response.cookies

    me_response = client.get("/api/v1/auth/me")
    assert me_response.status_code == 200
    assert me_response.json()["email"] == email

    logout_response = client.post("/api/v1/auth/logout")
    assert logout_response.status_code == 204

    unauthenticated = client.get("/api/v1/auth/me")
    assert unauthenticated.status_code == 401


def test_login_with_valid_credentials(client: TestClient, db_session) -> None:
    user = User(
        email="login@example.com",
        hashed_password=hash_password("password123"),
        role=UserRole.USER,
    )
    db_session.add(user)
    db_session.commit()

    client.cookies.clear()
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    assert settings.session_cookie_name in response.cookies


def test_protected_admin_route_requires_admin_role(
    client: TestClient,
    db_session,
) -> None:
    user = User(
        email="member@example.com",
        hashed_password=hash_password("password123"),
        role=UserRole.USER,
    )
    db_session.add(user)
    db_session.commit()

    login = client.post(
        "/api/v1/auth/login",
        json={"email": "member@example.com", "password": "password123"},
    )
    assert login.status_code == 200

    forbidden = client.get("/api/v1/admin/overview")
    assert forbidden.status_code == 403

    user.role = UserRole.ADMIN
    db_session.commit()
    db_session.expire_all()

    allowed = client.get("/api/v1/admin/overview")
    assert allowed.status_code == 200
    assert allowed.json()["message"] == "admin access granted"
