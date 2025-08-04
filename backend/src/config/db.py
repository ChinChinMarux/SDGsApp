from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from . import models

def get_corpus_uploaded(db: Session):
    return db.query(models.Corpus).all()


def insert_file_record(db: Session, user_id: str, file_name: str) -> int:
    file_record = models.FilesUploaded(
        uploaded_by=user_id,
        file_name=file_name
    )
    db.add(file_record)
    db.commit()
    db.refresh(file_record)
    return file_record.id

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
    file_real: bytes
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
        file_real=file_real
    )
    db.add(db_upload)
    db.commit()
    db.refresh(db_upload)
    return db_upload


def upload_merged(
    db:Session, 
    title:str, 
    abstract:str
):
    db_merged=models.Metadata(
        title=title, 
        abstract=abstract)
    db.add(db_merged)
    db.commit()
    db.refresh(db_merged)
    
    return db_merged
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
    
