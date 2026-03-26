from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import ApproveSampleRequest, ApproveSampleResponse, SampleRead
from app.services.sample_service import approve_sample, get_sample_by_id, list_samples

router = APIRouter(prefix="/samples", tags=["samples"])


@router.get("", response_model=list[SampleRead])
def get_samples(
    q: str | None = Query(default=None, description="Search by sample_id or cross_id"),
    db: Session = Depends(get_db),
) -> list[SampleRead]:
    return list_samples(db, query=q)


@router.get("/{sample_id}", response_model=SampleRead)
def get_sample(sample_id: int, db: Session = Depends(get_db)) -> SampleRead:
    sample = get_sample_by_id(db, sample_id)
    if sample is None:
        raise HTTPException(status_code=404, detail="Sample not found")
    return sample


@router.post("/{sample_id}/approve", response_model=ApproveSampleResponse)
def approve_sample_endpoint(
    sample_id: int,
    payload: ApproveSampleRequest,
    db: Session = Depends(get_db),
) -> ApproveSampleResponse:
    sample = get_sample_by_id(db, sample_id)
    if sample is None:
        raise HTTPException(status_code=404, detail="Sample not found")

    updated_sample = approve_sample(db, sample=sample, actor=payload.actor)
    return ApproveSampleResponse(sample=updated_sample, message="Sample approved")

