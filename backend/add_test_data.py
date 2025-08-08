from datetime import datetime
import json
from sqlalchemy.orm import Session

# Pastikan import ini sesuai dengan struktur folder Anda
from src.config.db import insert_corpus
from src.config import models
from src.config.models import get_db, SDGMapping, SessionLocal, Base, engine

# Memastikan semua tabel di database dibuat sebelum memasukkan data
Base.metadata.create_all(engine)

def add_sdg_mapping_data(db: Session):
    """Menambahkan data pemetaan SDG contoh ke database."""
    mappings = [
        {"topic_id": "topic_1", "sdg_id": 1, "sdg_name": "No Poverty", "mapping_weight": 0.85},
        {"topic_id": "topic_1", "sdg_id": 2, "sdg_name": "Zero Hunger", "mapping_weight": 0.55},
        {"topic_id": "topic_2", "sdg_id": 7, "sdg_name": "Affordable and Clean Energy", "mapping_weight": 0.92},
        # -- Data pemetaan SDG tambahan --
        {"topic_id": "topic_3", "sdg_id": 3, "sdg_name": "Good Health and Well-being", "mapping_weight": 0.95},
        {"topic_id": "topic_3", "sdg_id": 4, "sdg_name": "Quality Education", "mapping_weight": 0.70},
        {"topic_id": "topic_4", "sdg_id": 5, "sdg_name": "Gender Equality", "mapping_weight": 0.88},
    ]

    for data in mappings:
        sdg_exists = db.query(SDGMapping).filter_by(
            topic_id=data["topic_id"],
            sdg_id=data["sdg_id"]
        ).first()

        if not sdg_exists:
            new_mapping = SDGMapping(**data)
            db.add(new_mapping)
    
    db.commit()
    print("Data SDG Mapping berhasil ditambahkan.")

def add_corpus_data(db: Session):
    """Menambahkan data publikasi contoh ke database."""
    # Data publikasi contoh pertama.
    corpus_data_1 = {
        "user_id": "user_clerk_123",
        "file_id": 1,
        "file_name": "test_paper.pdf",
        "file_size": 1024,
        "file_type": "pdf",
        "title": "A New Method for Poverty Alleviation",
        "abstract": "This paper presents a new approach to alleviate poverty using sustainable economic models.",
        "date_uploaded": datetime.now(),
        "file_real": b"dummy content",
        "doi": "10.1234/test.paper",
        "authors": json.dumps([
            {"full_name": "John Doe", "orcid": "0000-0002-1825-0097", "institution": {"name": "Test University", "ror_id": "ror.01abcde"}},
            {"full_name": "Jane Smith", "orcid": "0000-0002-1825-0098", "institution": {"name": "Tech Institute", "ror_id": "ror.02fghij"}},
        ]),
        "topics": json.dumps([
            {"topic_id": "topic_1", "keywords": ["poverty", "alleviation", "economy"], "topic_probability": 0.75},
            {"topic_id": "topic_2", "keywords": ["energy", "policy", "sustainability"], "topic_probability": 0.20},
        ])
    }

    # Data publikasi contoh kedua yang berbeda.
    corpus_data_2 = {
        "user_id": "user_clerk_456",
        "file_id": 2,
        "file_name": "education_report.pdf",
        "file_size": 2048,
        "file_type": "pdf",
        "title": "Impact of Technology on Gender Equality in Education",
        "abstract": "This report analyzes how technology can be leveraged to achieve gender equality goals in educational settings.",
        "date_uploaded": datetime.now(),
        "file_real": b"more dummy content",
        "doi": "10.5678/report.education",
        "authors": json.dumps([
            {"full_name": "Alice Johnson", "orcid": "0000-0003-1234-5678", "institution": {"name": "Global Education Institute", "ror_id": "ror.03klmno"}},
            {"full_name": "Michael Brown", "orcid": "0000-0004-9876-5432", "institution": {"name": "Innovations Lab", "ror_id": "ror.04pqrst"}},
        ]),
        "topics": json.dumps([
            {"topic_id": "topic_3", "keywords": ["education", "technology", "gender equality"], "topic_probability": 0.90},
            {"topic_id": "topic_4", "keywords": ["gender parity", "policy", "social impact"], "topic_probability": 0.65},
        ])
    }
    
    # Memeriksa dan menambahkan data pertama
    corpus_exists_1 = db.query(models.Corpus).filter_by(doi=corpus_data_1["doi"]).first()
    if not corpus_exists_1:
        insert_corpus(db, **corpus_data_1)
        print("Data Corpus pertama berhasil ditambahkan.")
    else:
        print("Data Corpus pertama sudah ada, tidak ada yang ditambahkan.")
    
    # Memeriksa dan menambahkan data kedua
    corpus_exists_2 = db.query(models.Corpus).filter_by(doi=corpus_data_2["doi"]).first()
    if not corpus_exists_2:
        insert_corpus(db, **corpus_data_2)
        print("Data Corpus kedua berhasil ditambahkan.")
    else:
        print("Data Corpus kedua sudah ada, tidak ada yang ditambahkan.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        add_sdg_mapping_data(db)
        add_corpus_data(db)
    finally:
        db.close()