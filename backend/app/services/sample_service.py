from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models import Sample
from app.services.audit_service import create_audit_event


def list_samples(db: Session, query: str | None = None) -> list[Sample]:
    q = db.query(Sample).order_by(Sample.created_at.desc())
    if query:
        like_query = f"%{query.strip()}%"
        q = q.filter(or_(Sample.sample_id.ilike(like_query), Sample.cross_id.ilike(like_query)))
    return q.all()


def get_sample_by_id(db: Session, sample_db_id: int) -> Sample | None:
    return db.query(Sample).filter(Sample.id == sample_db_id).first()


def approve_sample(db: Session, sample: Sample, actor: str) -> Sample:
    sample.approval_status = "APPROVED"
    sample.approved_by = actor
    create_audit_event(
        db,
        entity_type="Sample",
        entity_id=str(sample.id),
        action="APPROVED",
        actor=actor,
        metadata_json={
            "sample_id": sample.sample_id,
            "cross_id": sample.cross_id,
            "approval_status": sample.approval_status,
        },
    )
    db.add(sample)
    db.commit()
    db.refresh(sample)
    return sample

