# Demo Suite Overview — R&D Workflow AI Demo Suite

This repository is a small, local-first demo suite built to showcase **role-aligned, full-stack AI engineering capabilities** for R&D workflow tooling.

It intentionally uses **seeded synthetic data** and avoids auth, cloud deployment, and heavy frameworks so the focus stays on core product and engineering signals.

## What’s Included

### 1) Sample Workflow API Demo

**What it is**
- A minimal workflow UI over sample records: search, inspect, approve.

**Why it exists**
- To demonstrate API-driven workflow tooling and governed actions in an internal-tool style product.

**Signals demonstrated**
- FastAPI + SQLAlchemy + Postgres modeling
- Typed JSON responses and clean router/service boundaries
- Approval action writes to an **audit log** (traceability)
- React table → detail panel UX with refresh behavior

### 2) Breeding Knowledge Assistant Demo

**What it is**
- A grounded assistant over seeded breeding/trial/sensory notes that returns:
  - answer text
  - cited source snippets
  - retrieved document IDs

**Why it exists**
- To demonstrate retrieval-augmented decision support UX and “grounding-first” behavior.

**Signals demonstrated**
- Lightweight retrieval (keyword scoring) that is understandable and debuggable
- Citation construction (snippets tied to retrieved docs)
- Query history + feedback persistence
- Frontend state flow for query → answer → sources → feedback → history refresh

## Relevance to an AI Engineer (Full Stack) – R&D Workflow Role

These demos are inspired by a typical R&D IT / internal AI tooling role description and map to role-aligned themes such as:
- **API-driven workflow tooling**: CRUD-lite workflows, approvals, and user-facing actions backed by APIs
- **Auditability / governed systems**: immutable audit events for sensitive actions
- **Grounded assistant experiences**: responses anchored to known internal notes with citations
- **Retrieval-augmented decision support**: retrieve top relevant notes, summarize grounded context, keep traceability
- **Full-stack ownership**: backend + frontend + persistence + repeatable seeded demo setup

Portfolio demo using seeded synthetic data; examples are illustrative.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + SQLAlchemy (Python)
- DB: Postgres
- Packaging: Docker Compose (one command to run full stack)

## What Was Intentionally Simplified

- No auth / SSO / user accounts (demo-only)
- No cloud deployment or managed services
- No external LLM dependency required for answers (template-based grounded responses)
- Lightweight retrieval instead of vector DB + embeddings
- Minimal styling (no design system)

## Walkthrough (Quick)

### Sample Workflow API demo
1. Go to `/samples`
2. Search by `sample_id` or `cross_id`
3. Click a row → see detail
4. Click **Approve** → sample updates + audit log entry appears

### Breeding Knowledge Assistant demo
1. Go to `/assistant`
2. Ask a breeding-related question
3. Review answer and the cited snippets
4. Mark helpful / not helpful
5. See query history update

