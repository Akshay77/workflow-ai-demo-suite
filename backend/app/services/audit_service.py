from sqlalchemy.orm import Session

from app.models import AuditEvent


def create_audit_event(
    db: Session,
    *,
    entity_type: str,
    entity_id: str,
    action: str,
    actor: str,
    metadata_json: dict,
) -> AuditEvent:
    event = AuditEvent(
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        actor=actor,
        metadata_json=metadata_json,
    )
    db.add(event)
    return event


def list_audit_events(db: Session) -> list[AuditEvent]:
    return db.query(AuditEvent).order_by(AuditEvent.created_at.desc()).all()

