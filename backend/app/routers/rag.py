from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import (
    RagFeedbackRequest,
    RagFeedbackResponse,
    RagQueryLogRead,
    RagQueryRequest,
    RagQueryResponse,
)
from app.services.rag_service import (
    add_feedback,
    build_grounded_answer,
    get_query_history,
    log_rag_query,
    retrieve_documents,
)

router = APIRouter(prefix="/rag", tags=["rag"])


@router.get("/health")
def rag_health() -> dict[str, str]:
    return {"status": "ok", "message": "RAG router scaffolded"}


@router.post("/query", response_model=RagQueryResponse)
def query_rag(payload: RagQueryRequest, db: Session = Depends(get_db)) -> RagQueryResponse:
    retrieved = retrieve_documents(db, question=payload.question, top_k=payload.top_k)
    answer, sources, retrieved_doc_ids = build_grounded_answer(payload.question, retrieved)
    log_rag_query(db, question=payload.question, answer=answer, retrieved_doc_ids=retrieved_doc_ids)
    return RagQueryResponse(answer=answer, sources=sources, retrieved_doc_ids=retrieved_doc_ids)


@router.post("/feedback", response_model=RagFeedbackResponse)
def feedback_rag(payload: RagFeedbackRequest, db: Session = Depends(get_db)) -> RagFeedbackResponse:
    updated = add_feedback(db, query_log_id=payload.query_log_id, feedback=payload.feedback)
    if updated is None:
        raise HTTPException(status_code=404, detail="RAG query log not found")
    return RagFeedbackResponse(query_log_id=updated.id, message="Feedback saved")


@router.get("/history", response_model=list[RagQueryLogRead])
def rag_history(db: Session = Depends(get_db)) -> list[RagQueryLogRead]:
    return get_query_history(db)

