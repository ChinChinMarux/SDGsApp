from datetime import datetime
import json
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

# Pastikan import ini sesuai dengan struktur folder Anda
from src.config.models import User, FilesUploaded, Corpus, SDGMapping, SessionLocal, Base, engine

# Memastikan semua tabel di database dibuat sebelum memasukkan data
Base.metadata.create_all(engine)

TEST_USER_ID = "user_30ZtmoXdsXdVaZP2FkUAyI5KTnW"

def add_user_and_files(db: Session):
    """Menambahkan data pengguna dan file contoh untuk memenuhi foreign key constraints."""
    try:
        user1 = db.query(User).filter_by(id=TEST_USER_ID).first()
        if not user1:
            user1 = User(
                id=TEST_USER_ID,
                user_name="John Doe",
                email="john.doe@test.com",
                first_name="John",
                last_name="Doe",
                organization="Test University"
            )
            db.add(user1)
            print(f"User dengan ID {TEST_USER_ID} berhasil ditambahkan.")

        file1 = db.query(FilesUploaded).filter_by(id=1).first()
        if not file1:
            file1 = FilesUploaded(
                id=1,
                uploaded_by=TEST_USER_ID,
                file_name="test_paper.pdf",
                file_size=1024,
                file_type="pdf",
                date_uploaded=datetime.now()
            )
            db.add(file1)
            print("File 1 berhasil ditambahkan.")
            
        db.commit()
        print("Data User dan Files berhasil ditambahkan.")
    except IntegrityError:
        db.rollback()
        print("Data User atau Files sudah ada, tidak ada yang ditambahkan.")
    except Exception as e:
        db.rollback()
        print(f"Error saat menambahkan User atau Files: {e}")

def add_sdg_mapping_data(db: Session):
    """Menambahkan data pemetaan SDG contoh ke database."""
    mappings = [
        {"topic_id": 1, "sdg_id": 1, "sdg_name": "No Poverty", "mapping_weight": 0.85},
        {"topic_id": 1, "sdg_id": 2, "sdg_name": "Zero Hunger", "mapping_weight": 0.55},
        {"topic_id": 2, "sdg_id": 7, "sdg_name": "Affordable and Clean Energy", "mapping_weight": 0.92},
        {"topic_id": 3, "sdg_id": 3, "sdg_name": "Good Health and Well-being", "mapping_weight": 0.95},
        {"topic_id": 3, "sdg_id": 4, "sdg_name": "Quality Education", "mapping_weight": 0.70},
        {"topic_id": 4, "sdg_id": 5, "sdg_name": "Gender Equality", "mapping_weight": 0.88},
        {"topic_id": 5, "sdg_id": 10, "sdg_name": "Reduced Inequalities", "mapping_weight": 0.90},
        {"topic_id": 6, "sdg_id": 13, "sdg_name": "Climate Action", "mapping_weight": 0.95},
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
    # Menyiapkan list data publikasi untuk demonstrasi
    corpus_data_list = [
        # Publikasi 1: Untuk membuat dua publikasi terkait SDG 1
        {
            "uploaded_by": TEST_USER_ID,
            "file_id": 1,
            "file_name": "test_paper_1.pdf",
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
                {"topic_id": 1, "keywords": ["poverty", "alleviation", "economy"], "topic_probability": 0.75}, # SDG 1 (No Poverty)
                {"topic_id": 2, "keywords": ["energy", "policy", "sustainability"], "topic_probability": 0.20},
            ])
        },
        # Publikasi 2: Memiliki SDG dan institusi yang berbeda
        {
            "uploaded_by": TEST_USER_ID,
            "file_id": 1,
            "file_name": "test_paper_2.pdf",
            "file_size": 1024,
            "file_type": "pdf",
            "title": "Sustainable Urban Planning",
            "abstract": "An analysis of sustainable urban development strategies and their impact on city well-being.",
            "date_uploaded": datetime.now(),
            "file_real": b"dummy content",
            "doi": "10.5678/urban.planning",
            "authors": json.dumps([
                {"full_name": "Emily White", "orcid": "0000-0001-2345-6789", "institution": {"name": "Tech Institute", "ror_id": "ror.02fghij"}},
                {"full_name": "Michael Brown", "orcid": "0000-0001-9876-5432", "institution": {"name": "Test University", "ror_id": "ror.01abcde"}},
            ]),
            "topics": json.dumps([
                {"topic_id": 11, "keywords": ["urban", "planning", "sustainability"], "topic_probability": 0.90}, # SDG 11
            ])
        },
        # Publikasi 3: Terkait dengan institusi baru dan SDG baru, membuat pie chart lebih beragam
        {
            "uploaded_by": TEST_USER_ID,
            "file_id": 1,
            "file_name": "test_paper_3.pdf",
            "file_size": 1200,
            "file_type": "pdf",
            "title": "Impact of Climate Change on Agriculture",
            "abstract": "Examining the effects of changing climate on food production and a new agricultural approach.",
            "date_uploaded": datetime.now(),
            "file_real": b"dummy content 3",
            "doi": "10.9876/climate.change",
            "authors": json.dumps([
                {"full_name": "Maria Garcia", "orcid": "0000-0003-4567-8901", "institution": {"name": "National Research Center", "ror_id": "ror.03klmno"}},
            ]),
            "topics": json.dumps([
                {"topic_id": 6, "keywords": ["climate", "agriculture", "food"], "topic_probability": 0.85}, # SDG 13
                {"topic_id": 1, "keywords": ["poverty", "food security"], "topic_probability": 0.15}, # SDG 1
            ])
        },
        # Publikasi 4: Terkait dengan SDG yang sama (SDG 1) untuk membuat grafik bar lebih tinggi
        {
            "uploaded_by": TEST_USER_ID,
            "file_id": 1,
            "file_name": "test_paper_4.pdf",
            "file_size": 1500,
            "file_type": "pdf",
            "title": "Economic Policies for Poverty Alleviation",
            "abstract": "A review of economic policies and their effectiveness in reducing poverty.",
            "date_uploaded": datetime.now(),
            "file_real": b"dummy content 4",
            "doi": "10.4321/economic.policy",
            "authors": json.dumps([
                {"full_name": "John Doe", "orcid": "0000-0002-1825-0097", "institution": {"name": "Test University", "ror_id": "ror.01abcde"}},
                {"full_name": "Michael Brown", "orcid": "0000-0001-9876-5432", "institution": {"name": "Test University", "ror_id": "ror.01abcde"}},
                {"full_name": "Sarah Miller", "orcid": "0000-0003-9012-3456", "institution": {"name": "National Research Center", "ror_id": "ror.03klmno"}},
            ]),
            "topics": json.dumps([
                {"topic_id": 1, "keywords": ["poverty", "economic policy"], "topic_probability": 0.95}, # SDG 1
                {"topic_id": 5, "keywords": ["sustainability", "economy"], "topic_probability": 0.10},
            ])
        },
    ]

    for corpus_data in corpus_data_list:
        corpus_exists = db.query(Corpus).filter_by(doi=corpus_data["doi"]).first()
        if not corpus_exists:
            new_corpus = Corpus(**corpus_data)
            db.add(new_corpus)
            print(f"Data Corpus '{corpus_data['title']}' berhasil ditambahkan.")
        else:
            print(f"Data Corpus '{corpus_data['title']}' sudah ada, **tidak ada yang ditambahkan**.")
            
    db.commit()

if __name__ == "__main__":
    db = SessionLocal()
    try:
        # Panggil fungsi untuk menambahkan data
        add_user_and_files(db)
        add_sdg_mapping_data(db)
        add_corpus_data(db)
    finally:
        db.close()