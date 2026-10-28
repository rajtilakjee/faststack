# FastStack architecture

FastStack is a monorepo with two deployable apps: a Python API and a Next.js web UI. They communicate over HTTP with CORS enabled for browser requests during local development.

## High-level view

```mermaid
flowchart LR
  Browser["Browser"]
  Next["Next.js frontend\n:3000"]
  API["FastAPI backend\n:8000"]
  DB[(PostgreSQL\n:5432)]
  Browser --> Next
  Next -->|"GET /api/v1/health"| API
  API --> DB
```

## Backend (FastAPI + uv)

```mermaid
flowchart TB
  subgraph backend ["backend/"]
    Main["app/main.py\nFastAPI app + CORS"]
    Config["app/config.py\nSettings from .env"]
    Session["app/db/session.py\nEngine + get_db"]
    Models["app/models/\nSQLAlchemy models"]
    Alembic["alembic/\nMigrations"]
    V1["app/api/v1/router.py"]
    Health["app/api/v1/endpoints/health.py"]
    Main --> Config
    Main --> Session
    Session --> Models
    Alembic --> Models
    Main --> V1
    V1 --> Health
  end
  Client["HTTP client"] --> Main
  Session --> PG[(PostgreSQL)]
```

### Versioned routes

All public API routes for version 1 live under the configurable prefix (default **`/api/v1`**). New breaking versions can be added as `app/api/v2/` without changing existing clients.

| Method | Path                    | Purpose                          |
|--------|-------------------------|----------------------------------|
| GET    | `/api/v1/health`        | Liveness / connectivity check    |
| POST   | `/api/v1/auth/register` | Create account + session cookie  |
| POST   | `/api/v1/auth/login`    | Authenticate + session cookie    |
| POST   | `/api/v1/auth/logout`   | Revoke session + clear cookie    |
| GET    | `/api/v1/auth/me`       | Current user (authenticated)     |
| GET    | `/api/v1/admin/overview`| Example admin-only route         |

OpenAPI is auto-generated at `/docs` and `/openapi.json`.

### Configuration

[`app/config.py`](backend/app/config.py) loads settings from environment variables and optional `backend/.env` via Pydantic Settings. CORS origins are parsed from a comma-separated list so multiple frontends (e.g. staging URLs) can be allowed.

### Database (phase 2)

- **Engine & sessions** — [`app/db/session.py`](backend/app/db/session.py) creates a SQLAlchemy engine from `DATABASE_URL` and exposes `get_db()` for FastAPI dependencies (request-scoped session, always closed in `finally`).
- **Models** — [`app/models/`](backend/app/models/) defines tables (currently `User`: email, hashed password, timestamps). Import models in Alembic `env.py` so autogenerate sees metadata.
- **Migrations** — Run `uv run alembic upgrade head` after pulling schema changes. Revision scripts live in [`alembic/versions/`](backend/alembic/versions/).
- **Tests** — Integration tests under `tests/integration/` use a real PostgreSQL instance (`DATABASE_URL`). Each test runs in a rolled-back transaction for isolation. CI provides Postgres as a service container.

### Authentication (phase 3)

```mermaid
sequenceDiagram
  participant Client
  participant API as FastAPI
  participant DB as PostgreSQL

  Client->>API: POST /auth/login (email, password)
  API->>DB: Verify User + insert UserSession
  API-->>Client: Set-Cookie faststack_session + User JSON
  Client->>API: GET /auth/me (Cookie)
  API->>DB: Lookup session by token
  API-->>Client: User JSON
  Client->>API: POST /auth/logout (Cookie)
  API->>DB: Delete UserSession
  API-->>Client: Clear cookie
```

- **Passwords** — Hashed with Argon2 ([`app/core/security.py`](backend/app/core/security.py)); never store plaintext.
- **Sessions** — Opaque tokens in the `user_sessions` table; the browser holds only an **HttpOnly** cookie (`faststack_session`). Expired sessions are removed on access.
- **Dependencies** — [`app/api/deps.py`](backend/app/api/deps.py): `get_current_user` for protected routes; `require_roles(UserRole.ADMIN)` for access control.
- **Browser clients** — Send `credentials: "include"` on cross-origin requests and list the frontend origin in `CORS_ORIGINS`. For local dev across ports, prefer an API proxy on the same origin or deploy UI and API under one site so cookies behave predictably.

## Frontend (Next.js)

```mermaid
sequenceDiagram
  participant Page as app/page.tsx
  participant API as lib/api.ts
  participant Backend as FastAPI

  Page->>API: fetchBackendHealth()
  API->>Backend: GET /api/v1/health
  Backend-->>API: JSON status + service
  API-->>Page: HealthResponse or null
  Page->>Page: BackendHealth component
```

The home page is a **Server Component** that calls the backend during render (`cache: "no-store"` so status stays fresh in dev). If the API is down, the UI shows **Unavailable** and hints to start the backend.

Server components call the API with **`BACKEND_URL`**. Browser auth requests go to **`/backend-api/...`**, which Next.js proxies to FastAPI so **HttpOnly session cookies** stay on the frontend origin (see `frontend/app/backend-api/[...path]/route.ts`).

### Auth UI (phase 4)

- **`AuthProvider`** — hydrates the current user in the header from the server and after login/register/logout.
- **`/login` / `/register`** — validated forms with inline API errors and submit loading states.
- **`/dashboard`** — server-side session check; unauthenticated users are redirected to `/login?next=/dashboard`.

## CI pipeline

```mermaid
flowchart LR
  Push["push / PR to main"]
  Push --> BE["Backend job\nruff + pytest"]
  Push --> FE["Frontend job\neslint + build"]
```

GitHub Actions runs both jobs in parallel on every push and pull request to `main`.

## Adding features

1. **New API endpoint** — Add a module under `backend/app/api/v1/endpoints/`, register it on `api_router` in `backend/app/api/v1/router.py`, inject `Session` via `Depends(get_db)`, add tests under `backend/tests/`.
2. **New table** — Add a model in `app/models/`, import it in `app/models/__init__.py`, run `alembic revision --autogenerate`, review the migration, then `alembic upgrade head`.
3. **New page or UI** — Add routes under `frontend/app/`; call the API through helpers in `frontend/lib/`.
4. **New API version** — Copy the `v1` package to `v2`, mount with `app.include_router(..., prefix="/api/v2")` in `main.py`.

Keep health checks cheap and unauthenticated so load balancers and the starter UI can use them without extra setup.
