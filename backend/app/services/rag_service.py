import re
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.models import BreedingDocument, RagQueryLog


STOPWORDS = {
    "the",
    "a",
    "an",
    "for",
    "and",
    "or",
    "to",
    "of",
    "in",
    "on",
    "with",
    "is",
    "are",
    "what",
    "how",
    "why",
    "which",
    "show",
    "me",
    "about",
}


@dataclass
class RetrievedDoc:
    doc: BreedingDocument
    score: int


def _tokenize(text: str) -> set[str]:
    words = set(re.findall(r"[a-zA-Z0-9]+", text.lower()))
    return {w for w in words if w not in STOPWORDS and len(w) > 1}


def _build_snippet(content: str, query_terms: set[str], max_chars: int = 220) -> str:
    normalized = " ".join(content.split())
    if not normalized:
        return ""
    best_term = next((t for t in query_terms if t in normalized.lower()), None)
    if best_term is None:
        return normalized[:max_chars] + ("..." if len(normalized) > max_chars else "")

    idx = normalized.lower().find(best_term)
    start = max(0, idx - 70)
    end = min(len(normalized), idx + 150)
    snippet = normalized[start:end].strip()
    if start > 0:
        snippet = "..." + snippet
    if end < len(normalized):
        snippet += "..."
    return snippet


def retrieve_documents(db: Session, question: str, top_k: int = 3) -> list[RetrievedDoc]:
    docs = db.query(BreedingDocument).all()
    if not docs:
        return []

    query_terms = _tokenize(question)
    ranked: list[RetrievedDoc] = []
    for doc in docs:
        haystack = " ".join([doc.title, doc.content, doc.trait_tags, doc.doc_type, doc.season, doc.region]).lower()
        score = 0
        for term in query_terms:
            if term in haystack:
                score += 2
            if term in doc.title.lower():
                score += 1
            if term in doc.trait_tags.lower():
                score += 1
        if score > 0:
            ranked.append(RetrievedDoc(doc=doc, score=score))

    if not ranked:
        # Fallback to latest notes if nothing matched.
        fallback_docs = sorted(docs, key=lambda d: d.created_at, reverse=True)[:top_k]
        return [RetrievedDoc(doc=d, score=0) for d in fallback_docs]

    ranked.sort(key=lambda x: (x.score, x.doc.created_at), reverse=True)
    return ranked[:top_k]


def build_grounded_answer(question: str, docs: list[RetrievedDoc]) -> tuple[str, list[dict], list[str]]:
    query_terms = _tokenize(question)
    if not docs:
        return (
            "I could not find matching breeding notes in the current dataset.",
            [],
            [],
        )

    retrieved_doc_ids = [item.doc.doc_id for item in docs]
    sources: list[dict] = []
    answer_points: list[str] = []

    for item in docs:
        doc = item.doc
        snippet = _build_snippet(doc.content, query_terms)
        sources.append({"doc_id": doc.doc_id, "title": doc.title, "snippet": snippet})
        answer_points.append(
            f"{doc.doc_id} ({doc.doc_type}, {doc.region}, {doc.season}) highlights {snippet}"
        )

    answer = (
        "Grounded summary from breeding notes:\n- "
        + "\n- ".join(answer_points)
        + "\n\nThis answer is based only on the cited notes above."
    )
    return answer, sources, retrieved_doc_ids


def log_rag_query(
    db: Session, question: str, answer: str, retrieved_doc_ids: list[str]
) -> RagQueryLog:
    log = RagQueryLog(question=question, answer=answer, retrieved_doc_ids=retrieved_doc_ids)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def add_feedback(db: Session, query_log_id: int, feedback: str) -> RagQueryLog | None:
    log = db.query(RagQueryLog).filter(RagQueryLog.id == query_log_id).first()
    if log is None:
        return None
    log.feedback = feedback
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_query_history(db: Session) -> list[RagQueryLog]:
    return db.query(RagQueryLog).order_by(RagQueryLog.created_at.desc()).limit(100).all()

