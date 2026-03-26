from fastapi import FastAPI
from sqlalchemy.exc import SQLAlchemyError

from app.db import Base, engine
from app.routers import audit, rag, samples

app = FastAPI(title="R&D Workflow AI Demo Suite API", version="0.1.0")

app.include_router(samples.router)
app.include_router(audit.router)
app.include_router(rag.router)


@app.on_event("startup")
def init_db() -> None:
    # Keep startup resilient for local dev: app can boot even if DB is down.
    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError as exc:
        print(f"[startup] Database not reachable yet: {exc}")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

