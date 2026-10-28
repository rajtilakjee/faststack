# FastStack

A starter template for full-stack apps: **FastAPI** + **uv** on the backend and **Next.js** on the frontend.

## What's included (phase 1)

- FastAPI application with **versioned API routes** under `/api/v1`
- **Environment configuration** via `.env` (Pydantic Settings on the backend, `NEXT_PUBLIC_*` on the frontend)
- Next.js App Router frontend with **backend health-check** on the home page
- **Tests** (pytest) and **linting** (Ruff, ESLint)
- **CI** (GitHub Actions) for backend and frontend
- [ARCHITECTURE.md](./ARCHITECTURE.md) with system diagrams

## Prerequisites

- [uv](https://docs.astral.sh/uv/) (Python 3.13+)
- [Node.js](https://nodejs.org/) 22+ and npm

## Quick start

### Backend

```bash
cd backend
cp .env.example .env   # optional; defaults work for local dev
uv sync
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
| Backend  | `uv run pytest`      | Run API tests      |
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

### Frontend (`frontend/.env.local`)

| Variable               | Default                  | Description              |
|------------------------|--------------------------|--------------------------|
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8000`  | Base URL for the FastAPI |

## Project layout

```
faststack/
├── backend/          # FastAPI + uv
│   ├── app/          # Application code
│   └── tests/        # Pytest suite
├── frontend/         # Next.js App Router
└── .github/workflows # CI
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for request flow and extension points.

## License

Use this template freely for your own projects.
