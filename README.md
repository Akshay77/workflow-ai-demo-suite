# R&D Workflow AI Demo Suite

Two role-aligned demos (seeded synthetic data) for internal R&D workflow tooling and grounded assistant UX.

- **Sample Workflow**: searchable sample records + approval action + audit log
- **Breeding Knowledge Assistant**: grounded Q&A over seeded notes with cited snippets + history + feedback

Portfolio demo using seeded synthetic data; examples are illustrative.

## Stack

React + TypeScript + Vite • FastAPI + SQLAlchemy • Postgres • Docker Compose

## Run (recommended)

```bash
docker compose up -d --build
```

Open:
- `http://localhost:5173`

Notes:
- Postgres is not published on host `5432` (avoids conflicts with local Postgres).
- Seed data is loaded automatically on backend container startup.

## Quick demo walkthrough

- **Samples**
  - Open `Overview → Samples`
  - Search by `sample_id` / `cross_id`
  - Approve a record → see audit log update

- **Assistant**
  - Open `Overview → Breeding Assistant`
  - Ask a question → see grounded answer + cited snippets
  - Click Helpful / Not Helpful → history updates

## More context

- `DEMO_SUITE_OVERVIEW.md`: what each demo is, what it demonstrates, why it’s relevant
