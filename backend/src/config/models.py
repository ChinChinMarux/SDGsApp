# Import semua modul yang diperlukan untuk model
from sqlalchemy import Column, JSON, Integer, String, DateTime, ForeignKey, LargeBinary, Float, create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime

# Membuat koneksi ke database SQLite dan mengaktifkan logging echo.
# PRAGMA foreign_keys=ON digunakan untuk memastikan integritas data.
engine = create_engine('sqlite:///database.db', echo=True)
@event.listens_for(engine, "connect")
def enforce_foreign_keys(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

<<<<<<< HEAD
# Mendeklarasikan base untuk model
Base = declarative_base()

# Mendefinisikan kelas model untuk tabel 'users'
class User(Base):
    __tablename__ = 'users'
    
    id = Column(String, primary_key=True)
    user_name = Column(String, nullable=False, default="Researcher")
    email = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    organization = Column(String, nullable=False, default="No Organization")
=======
class User(Base):
    __tablename__ = 'users'
    
    id=Column(String, primary_key=True)
    user_name=Column(String, nullable=False, default="Researcher")
    email=Column(String, nullable=False)
>>>>>>> 4e73095e06b1994bd6c16400150647e864023857
    
    # Mendefinisikan relasi ke tabel lain
    uploaded = relationship("FilesUploaded", back_populates="users", cascade="all, delete-orphan")
    corpuses = relationship("Corpus", back_populates="users", cascade="all, delete-orphan")
    
# Mendefinisikan kelas model untuk tabel 'files_uploaded'
class FilesUploaded(Base):
    __tablename__ = 'files_uploaded'
    
    id = Column(Integer, primary_key=True)
    uploaded_by = Column(String, ForeignKey(User.id, ondelete="CASCADE"), nullable=False)
    file_name = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    file_type = Column(String, nullable=False)
    date_uploaded = Column(DateTime, default=datetime.now)
    status = Column(String, default="completed")
    
    # Mendefinisikan relasi ke tabel lain
    users = relationship("User", back_populates="uploaded")
    corpuses = relationship("Corpus", back_populates="uploaded", cascade="all, delete-orphan")
    metadatas = relationship("Metadata", back_populates="uploaded", cascade="all, delete-orphan")
    basefile = relationship("AnalysisBaseFile", back_populates="uploaded", cascade="all, delete-orphan")
    result = relationship("AnalysisResult", back_populates="uploaded", cascade="all, delete-orphan")
    
# Mendefinisikan kelas model untuk tabel 'corpus'
class Corpus(Base):
    __tablename__ = 'corpus'
    
    id = Column(Integer, primary_key=True)
<<<<<<< HEAD
    file_name = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    file_type = Column(String, nullable=False)
    file_id = Column(Integer, ForeignKey(FilesUploaded.id, ondelete="CASCADE"), nullable=False)
    uploaded_by = Column(String, ForeignKey(User.id, ondelete="CASCADE"), nullable=False)
    date_uploaded = Column(DateTime, default=datetime.now)
    title = Column(String, nullable=False)
    abstract = Column(String, nullable=False)
    # Kolom untuk DOI
    doi = Column(String, unique=True, nullable=True)
    file_real = Column(LargeBinary, nullable=False)
=======
    file_name=Column(String, nullable=False)
    file_size=Column(Integer, nullable=False)
    file_type=Column(String, nullable=False)
    file_id=Column(Integer, ForeignKey(FilesUploaded.id, ondelete="CASCADE"), nullable=False)
    uploaded_by=Column(String,  ForeignKey(User.id, ondelete="CASCADE"), nullable=False)
    date_uploaded=Column(DateTime, default=datetime.now)
    file_real=Column(LargeBinary, nullable=False)
>>>>>>> 4e73095e06b1994bd6c16400150647e864023857
    
    # TAMBAHAN KOLOM UNTUK DATA GRAFIK
    authors = Column(JSON, nullable=True)
    topics = Column(JSON, nullable=True)
    
    # Mendefinisikan relasi ke tabel lain
    users = relationship("User", back_populates="corpuses")
    uploaded = relationship("FilesUploaded", back_populates="corpuses")
    
# Mendefinisikan kelas model untuk tabel 'corpus_metadata'
class Metadata(Base):
    __tablename__ = 'corpus_metadata'
    
    id = Column(Integer, primary_key=True)
    file_id = Column(Integer, ForeignKey(FilesUploaded.id, ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    abstract = Column(String, nullable=False)
    
    uploaded = relationship("FilesUploaded", back_populates="metadatas")
    
# Mendefinisikan kelas model untuk tabel 'analysis_base_file'
class AnalysisBaseFile(Base):
    __tablename__ = 'analysis_base_file'
    
    id = Column(Integer, primary_key=True)
    file_id = Column(Integer, ForeignKey(FilesUploaded.id, ondelete="CASCADE"), nullable=False)
    num_topics = Column(Integer, nullable=False)
    iteration = Column(Integer, nullable=False)
    date_analyzed = Column(DateTime, default=datetime.now)
    
    uploaded = relationship("FilesUploaded", back_populates="basefile")
    
# Mendefinisikan kelas model untuk tabel 'analysis_result'
class AnalysisResult(Base):
    __tablename__ = "analysis_result"
    
    id = Column(Integer, primary_key=True)
    file_id = Column(Integer, ForeignKey(FilesUploaded.id, ondelete="CASCADE"), nullable=False)
    file_name = Column(String, nullable=False)
    coherence = Column(Integer, nullable=False)
    topic_count = Column(Integer, nullable=False)
    topic_result = Column(JSON, nullable=False)
    
    uploaded = relationship("FilesUploaded", back_populates="result")

# Mendefinisikan kelas model untuk tabel 'sdg_mapping'
class SDGMapping(Base):
    __tablename__ = "sdg_mapping"
    
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, index=True)
    sdg_id = Column(Integer, index=True)
    mapping_weight = Column(Float)
    sdg_name = Column(String)
    
    def __repr__(self):
        return f"<SDGMapping(id={self.id}, topic_id={self.topic_id}, sdg_id={self.sdg_id}, mapping_weight={self.mapping_weight})>"

# Memastikan semua tabel dibuat di database
Base.metadata.create_all(engine)

# Mendeklarasikan SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Fungsi untuk mendapatkan sesi database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()