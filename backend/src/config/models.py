from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, LargeBinary, create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

engine = create_engine('sqlite:///database.db', echo = True)
Base=declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id=Column(String, primary_key=True)
    user_name=Column(String, nullable=False, default="Researcher")
    email=Column(String, nullable=False)
    first_name=Column(String, nullable=False)
    last_name=Column(String, nullable=False)
    organization=Column(String, nullable=False, default="No Organization")
    
    
class FilesUploaded(Base):
    __tablename__ = 'files_uploaded'
    
    id = Column(Integer, primary_key=True)
    uploaded_by=Column(Integer, ForeignKey(User.id), nullable=False)
    file_name=Column(String, nullable=False)
        
class Corpus(Base):
    __tablename__ = 'corpus'
    
    id = Column(Integer, primary_key=True)
    file_name=Column(String, nullable=False)
    file_size=Column(Integer, nullable=False)
    file_type=Column(String, nullable=False)
    file_id=Column(Integer, ForeignKey(FilesUploaded.id), nullable=False)
    uploaded_by=Column(String,  ForeignKey(User.id), nullable=False)
    date_uploaded=Column(DateTime, default=datetime.now)
    title=Column(String, nullable=False)
    abstract=Column(String, nullable=False)
    file_real=Column(LargeBinary, nullable=False)
    
    
class Metadata(Base):
    __tablename__ = 'corpus_metadata'
    
    id = Column(Integer, primary_key=True)
    title=Column(String, nullable=False)
    abstract=Column(String, nullable=False)
    
Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()