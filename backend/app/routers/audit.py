from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import AuditEventRead
from app.services.audit_service import list_audit_events

router = APIRouter(tags=["audit"])


@router.get("/audit-log", response_model=list[AuditEventRead])
def get_audit_log(db: Session = Depends(get_db)) -> list[AuditEventRead]:
    return list_audit_events(db)

