from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class SampleBase(BaseModel):
    sample_id: str
    cross_id: str
    trait_score: float | None = None
    assay_status: str
    lab_result: str | None = None
    approval_status: str
    approved_by: str | None = None


class SampleRead(SampleBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ApproveSampleRequest(BaseModel):
    actor: str = Field(default="demo_reviewer", min_length=1, max_length=128)


class ApproveSampleResponse(BaseModel):
    sample: SampleRead
    message: str


class AuditEventRead(BaseModel):
    id: int
    entity_type: str
    entity_id: str
    action: str
    actor: str
    metadata_json: dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


class BreedingDocumentRead(BaseModel):
    id: int
    doc_id: str
    doc_type: str
    title: str
    content: str
    trait_tags: str
    season: str
    region: str
    created_at: datetime

    model_config = {"from_attributes": True}


class RagSourceSnippet(BaseModel):
    doc_id: str
    title: str
    snippet: str


class RagQueryRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    top_k: int = Field(default=3, ge=1, le=5)


class RagQueryResponse(BaseModel):
    answer: str
    sources: list[RagSourceSnippet]
    retrieved_doc_ids: list[str]


class RagFeedbackRequest(BaseModel):
    query_log_id: int
    feedback: str = Field(min_length=1, max_length=1024)


class RagFeedbackResponse(BaseModel):
    query_log_id: int
    message: str


class RagQueryLogRead(BaseModel):
    id: int
    question: str
    answer: str
    retrieved_doc_ids: list[str]
    feedback: str | None
    created_at: datetime

    model_config = {"from_attributes": True}

