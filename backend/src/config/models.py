from sqlalchemy import Column, JSON, Integer, String, DateTime, ForeignKey, LargeBinary, create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime


engine = create_engine('sqlite:///database.db', echo = True)
@event.listens_for(engine, "connect")
def enforce_foreign_keys(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
Base=declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id=Column(String, primary_key=True)
    user_name=Column(String, nullable=False, default="Researcher")
    email=Column(String, nullable=False)
    
    uploaded=relationship("FilesUploaded", back_populates="users", cascade="all")
    corpuses=relationship("Corpus", back_populates="users", cascade="all")
    
class FilesUploaded(Base):
    __tablename__ = 'files_uploaded'
    
    id = Column(Integer, primary_key=True)
    uploaded_by=Column(String, ForeignKey(User.id, ondelete="CASCADE"), nullable=False)
    file_name=Column(String, nullable=False)
    file_size=Column(Integer, nullable=False)
    file_type=Column(String, nullable=False)
    date_uploaded=Column(DateTime, default=datetime.now)
    status=Column(String, default="completed")
    
    users=relationship("User", back_populates="uploaded", passive_deletes=True)
    corpuses=relationship("Corpus", back_populates="uploaded", passive_deletes=True)
    metadatas=relationship("Metadata", back_populates="uploaded", passive_deletes=True)
    basefile=relationship("AnalysisBaseFile", back_populates="uploaded", passive_deletes=True)
    result=relationship("AnalysisResult", back_populates="uploaded", passive_deletes=True)
    
class Corpus(Base):
    __tablename__ = 'corpus'
    
    id = Column(Integer, primary_key=True)
    file_name=Column(String, nullable=False)
    file_size=Column(Integer, nullable=False)
    file_type=Column(String, nullable=False)
    file_id=Column(Integer, ForeignKey(FilesUploaded.id, ondelete="CASCADE"), nullable=False)
    uploaded_by=Column(String,  ForeignKey(User.id, ondelete="CASCADE"), nullable=False)
    date_uploaded=Column(DateTime, default=datetime.now)
    file_real=Column(LargeBinary, nullable=False)
    
    users=relationship("User", back_populates="corpuses", passive_deletes=True)
    uploaded=relationship("FilesUploaded", back_populates="corpuses", passive_deletes=True)
    
class Metadata(Base):
    __tablename__ = 'corpus_metadata'
    
    id = Column(Integer, primary_key=True)
    file_id=Column(Integer, ForeignKey(FilesUploaded.id, ondelete="CASCADE"), nullable=False)
    title=Column(String, nullable=False)
    abstract=Column(String, nullable=False)
    
    uploaded=relationship("FilesUploaded", back_populates="metadatas", passive_deletes=True)
    
class AnalysisBaseFile(Base):
    __tablename__ = 'analysis_base_file'
    
    id=Column(Integer, primary_key=True)
    file_id=Column(Integer, ForeignKey(FilesUploaded.id, ondelete="CASCADE"), nullable=False)
    num_topics=Column(Integer, nullable=False)
    iteration=Column(Integer, nullable=False)
    date_analyzed=Column(DateTime, default=datetime.now)
    
    uploaded=relationship("FilesUploaded", back_populates="basefile", passive_deletes=True)
    
class AnalysisResult(Base):
    __tablename__ = "analysis_result"
    
    id=Column(Integer, primary_key=True)
    file_id=Column(Integer, ForeignKey(FilesUploaded.id, ondelete="CASCADE"), nullable=False)
    file_name=Column(String, nullable=False)
    coherence=Column(Integer, nullable=False)
    topic_count=Column(Integer, nullable=False)
    topic_result=Column(JSON, nullable=False)
    
    uploaded=relationship("FilesUploaded", back_populates="result", passive_deletes=True)
    
    
Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()