# FastStack

A starter template for full-stack apps: **FastAPI** + **uv** on the backend and **Next.js** on the frontend.

## What's included

**Phase 1**

- FastAPI application with **versioned API routes** under `/api/v1`
- **Environment configuration** via `.env` (Pydantic Settings on the backend, `NEXT_PUBLIC_*` on the frontend)
- Next.js App Router frontend with **backend health-check** on the home page
- **Tests** (pytest) and **linting** (Ruff, ESLint)
- **CI** (GitHub Actions) for backend and frontend
- [ARCHITECTURE.md](./ARCHITECTURE.md) with system diagrams

**Phase 2**

- **PostgreSQL** via Docker Compose (`docker compose up -d db`)
- **SQLAlchemy 2.x** models and **session management** (`get_db` dependency)
- **Alembic** migrations (`backend/alembic/`)
- **`User` model** and **database integration tests** (pytest + PostgreSQL)

## Prerequisites

- [uv](https://docs.astral.sh/uv/) (Python 3.13+)
- [Node.js](https://nodejs.org/) 22+ and npm
- [Docker](https://www.docker.com/) (for PostgreSQL)

## Quick start

### Database

From the repo root:

```bash
docker compose up -d db
```

### Backend

```bash
cd backend
cp .env.example .env   # optional; defaults match docker-compose
uv sync
uv run alembic upgrade head
uv run fastapi dev app/main.py
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)  
Health: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000) — shows live backend health when the API is running.

## Development commands

| Area     | Command              | Description        |
|----------|----------------------|--------------------|
| Backend  | `uv run pytest`      | Run all tests (integration needs `DATABASE_URL`) |
| Backend  | `uv run pytest -m integration` | PostgreSQL integration tests only |
| Backend  | `uv run alembic upgrade head` | Apply migrations |
| Backend  | `uv run alembic revision --autogenerate -m "message"` | New migration |
| Backend  | `uv run ruff check .`| Lint Python        |
| Backend  | `uv run ruff format .` | Format Python    |
| Frontend | `npm run lint`       | Lint TypeScript    |
| Frontend | `npm run build`      | Production build   |

## Environment variables

### Backend (`backend/.env`)

| Variable        | Default                 | Description                          |
|-----------------|-------------------------|--------------------------------------|
| `APP_NAME`      | `FastStack API`         | Shown in OpenAPI title and health    |
| `DEBUG`         | `false`                 | FastAPI debug mode                   |
| `API_V1_PREFIX` | `/api/v1`               | Prefix for version 1 routes          |
| `CORS_ORIGINS`  | `http://localhost:3000` | Comma-separated allowed origins      |
| `DATABASE_URL`  | `postgresql+psycopg://faststack:faststack@localhost:5432/faststack` | SQLAlchemy database URL |

### Frontend (`frontend/.env.local`)

| Variable               | Default                  | Description              |
|------------------------|--------------------------|--------------------------|
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8000`  | Base URL for the FastAPI |

## Project layout

```
faststack/
├── backend/          # FastAPI + uv
│   ├── alembic/      # Database migrations
│   ├── app/          # Application code
│   └── tests/        # Pytest suite
├── frontend/         # Next.js App Router
├── docker-compose.yml
└── .github/workflows # CI
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for request flow and extension points.

## License

Use this template freely for your own projects.
