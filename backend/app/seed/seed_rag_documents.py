from app.db import Base, SessionLocal, engine
from app.models import BreedingDocument


SYNTHETIC_DOCS = [
    {
        "doc_id": "DOC-001",
        "doc_type": "breeding_note",
        "title": "High brix candidate in northern trial",
        "content": "Line C12xR4 showed strong sweetness and clean aroma in week 10 sampling. Fruit firmness remained acceptable under cool nights.",
        "trait_tags": "sweetness,brix,firmness,aroma",
        "season": "2026-Q1",
        "region": "North",
    },
    {
        "doc_id": "DOC-002",
        "doc_type": "sensory_note",
        "title": "Panel feedback on berry aroma",
        "content": "Panel rated berry aroma highest for cross CR-203. Slight tart finish noted by 2 out of 8 reviewers.",
        "trait_tags": "aroma,tartness,sensory",
        "season": "2026-Q1",
        "region": "Central",
    },
    {
        "doc_id": "DOC-003",
        "doc_type": "trial_note",
        "title": "Drought stress tolerance check",
        "content": "Under reduced irrigation, cross CR-200 maintained canopy vigor with moderate yield drop. Candidate lines recovered quickly after re-watering.",
        "trait_tags": "drought,vigor,yield",
        "season": "2026-Q1",
        "region": "West",
    },
]


def _expanded_docs() -> list[dict]:
    docs = SYNTHETIC_DOCS.copy()
    counter = 4
    variants = [
        ("disease screen update", "Powdery mildew pressure remained low; line response stable.", "disease,resistance,mildew", "South"),
        ("yield stability checkpoint", "Yield variance across blocks remained within expected range.", "yield,stability,trial", "North"),
        ("texture assessment", "Texture held after 72h cold storage with minimal softening.", "texture,storage,firmness", "Central"),
        ("flavor consistency", "Flavor profile remained consistent across harvest windows.", "flavor,consistency,sensory", "West"),
    ]
    while len(docs) < 24:
        title, content, tags, region = variants[(counter - 4) % len(variants)]
        docs.append(
            {
                "doc_id": f"DOC-{counter:03d}",
                "doc_type": "trial_note" if counter % 2 == 0 else "breeding_note",
                "title": f"{title.title()} #{counter}",
                "content": f"{content} Observation batch {counter} tied to cross CR-{200 + (counter % 6)}.",
                "trait_tags": tags,
                "season": "2026-Q1" if counter % 3 else "2026-Q2",
                "region": region,
            }
        )
        counter += 1
    return docs


def seed_rag_documents() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(BreedingDocument).count()
        if existing >= 20:
            print(f"Skipping RAG seed. Existing breeding document count: {existing}")
            return

        records = [BreedingDocument(**doc) for doc in _expanded_docs()]
        db.add_all(records)
        db.commit()
        print(f"Seeded {len(records)} breeding documents.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_rag_documents()

