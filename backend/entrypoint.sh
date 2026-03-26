#!/usr/bin/env sh
set -eu

: "${DATABASE_URL:?DATABASE_URL is required}"

echo "[backend] Waiting for Postgres to be reachable..."
python3 - <<'PY'
import os
import time

import psycopg

url = os.environ["DATABASE_URL"]
# DATABASE_URL is SQLAlchemy-flavored (postgresql+psycopg://...). psycopg expects postgresql://
url = url.replace("postgresql+psycopg://", "postgresql://", 1)

retries = 60
for i in range(retries):
    try:
        conn = psycopg.connect(url)
        conn.close()
        print("[backend] Postgres is reachable.")
        break
    except Exception as e:
        if i == retries - 1:
            raise
        time.sleep(1)
PY

echo "[backend] Seeding mock data (idempotent)..."
python3 -m app.seed.seed_samples
python3 -m app.seed.seed_rag_documents

echo "[backend] Starting API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000

