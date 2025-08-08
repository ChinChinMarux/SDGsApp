from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from . import models

def get_user(user_data: dict, db: Session):
    user = db.query(models.User).filter(models.User.id == user_data["user_id"]).first()
    if not user:
        user = models.User(
            id=user_data["user_id"],
            user_name=user_data["user_name"],
            email=user_data["email"],
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            organization=user_data["organization"]
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def get_corpus_uploaded(db: Session):
    return db.query(models.Corpus).all()

def insert_file_record(
    db: Session, 
    user_id: str, 
    file_name: str,
    file_size: int,
    file_type: str,
    date_uploaded: datetime,
    status:str
    ) -> int:
    file_record = models.FilesUploaded(
        uploaded_by=user_id,
        file_name=file_name,
        file_size=file_size,
        file_type=file_type,
        date_uploaded=date_uploaded,
        status=status
    )
    db.add(file_record)
    db.commit()
    db.refresh(file_record)
    return file_record.id

# --- FUNGSI insert_corpus YANG SUDAH DIPERBARUI ---
def insert_corpus(
    db: Session,
    user_id: str,
    file_id: int,
    file_name: str,
    file_size: int,
    file_type: str,
    title: str,
    abstract: str,
    date_uploaded: datetime,
    file_real: bytes,
    doi: str,  
    authors: str, 
    topics: str 
):
    db_upload = models.Corpus(
        uploaded_by=user_id,
        file_id=file_id,
        file_name=file_name,
        file_size=file_size,
        file_type=file_type,
        title=title,
        abstract=abstract,
        date_uploaded=date_uploaded,
        file_real=file_real,
        doi=doi,      # Simpan data baru
        authors=authors, # Simpan data baru
        topics=topics    # Simpan data baru
    )
    db.add(db_upload)
    db.commit()
    db.refresh(db_upload)
    return db_upload
# ---------------------------------------------------

def upload_merged(
    db:Session,
    file_id: int, 
    title:str, 
    abstract:str
):
    db_merged=models.Metadata(
        file_id=file_id,
        title=title, 
        abstract=abstract)
    db.add(db_merged)
    db.commit()
    db.refresh(db_merged)
    
    return db_merged

def get_corpus_by(db: Session, uploaded_by: str):
    return (db.query(models.FilesUploaded)
            .filter(models.FilesUploaded.uploaded_by==uploaded_by)
            .all()
            )
    

# from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
# from dotenv import load_dotenv
# import os

# load_dotenv()

# uri = os.getenv("MONGO_URI")

# # Create a new client and connect to the server
# client = AsyncIOMotorClient(uri)
# db = client["SDGAppTools"]
# fs = AsyncIOMotorGridFSBucket(db)

# # Send a ping to confirm a successful connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)
    
