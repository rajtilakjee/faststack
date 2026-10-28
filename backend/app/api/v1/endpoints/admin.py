from fastapi import APIRouter

from app.api.deps import RequireAdmin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/overview")
def admin_overview(_admin: RequireAdmin) -> dict[str, str]:
    return {"message": "admin access granted"}
