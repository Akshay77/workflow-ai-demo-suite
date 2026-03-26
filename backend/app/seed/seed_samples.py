from random import choice, uniform

from app.db import Base, SessionLocal, engine
from app.models import Sample


def seed_samples() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Sample).count()
        if existing >= 15:
            print(f"Skipping seed. Existing sample count: {existing}")
            return

        assay_statuses = ["PENDING", "IN_PROGRESS", "COMPLETE"]
        lab_results = ["PASS", "FAIL", "INCONCLUSIVE", "RETEST"]

        records: list[Sample] = []
        for i in range(1, 19):
            records.append(
                Sample(
                    sample_id=f"SMP-{1000 + i}",
                    cross_id=f"CR-{200 + (i % 6)}",
                    trait_score=round(uniform(45, 98), 2),
                    assay_status=choice(assay_statuses),
                    lab_result=choice(lab_results),
                    approval_status="PENDING",
                    approved_by=None,
                )
            )

        db.add_all(records)
        db.commit()
        print(f"Seeded {len(records)} sample records.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_samples()

