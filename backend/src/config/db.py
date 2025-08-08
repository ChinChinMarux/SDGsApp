from fastapi import HTTPException
from io import BytesIO
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime
from . import models



def get_corpus_uploaded(db: Session):
    return db.query(models.Corpus).all()

def get_corpus_by(db: Session, user_id=str):
    return db.query(
        models.FilesUploaded.id,
        models.FilesUploaded.file_name,
        models.FilesUploaded.file_size,
        models.FilesUploaded.file_type,
        models.FilesUploaded.date_uploaded
    ).filter(models.FilesUploaded.uploaded_by==user_id).all()
    
def download_file(db: Session, file_id: int):
    corpus = db.query(models.Corpus).filter(models.Corpus.file_id == file_id).first()

    if not corpus or not corpus.file_real:
        raise HTTPException(status_code=404, detail="File not found")

    file_stream = BytesIO(corpus.file_real)

    filename = corpus.file_name or "downloaded_file"

    return StreamingResponse(
        file_stream,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
    
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

def insert_corpus(
    db: Session,
    user_id: str,
    file_id: int,
    file_name: str,
    file_size: int,
    file_type: str,
    date_uploaded: datetime,
    file_real: bytes
):
    db_upload = models.Corpus(
        uploaded_by=user_id,
        file_id=file_id,
        file_name=file_name,
        file_size=file_size,
        file_type=file_type,
        date_uploaded=date_uploaded,
        file_real=file_real
    )
    db.add(db_upload)
    db.commit()
    db.refresh(db_upload)
    return db_upload


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
    
