from fastapi import APIRouter, HTTPException, Request, Depends, UploadFile, File
import pandas as pd
from typing import List
from sqlalchemy.orm import Session
from ..config import models
from ..config.db import (get_corpus_uploaded, insert_corpus, insert_file_record, upload_merged, get_user)
from ..utils import authhenticate_and_get_user_details
from ..config.models import get_db
from pathlib import Path
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class RequestModel(BaseModel):
    id: int
    title: str
    abstract: str
    uploaded_by: str
    file_name: str
    date_uploaded: datetime

    class Config:
        orm_mode = True


@router.get("/c", response_model=List[RequestModel])
async def get_all_corpus(request: Request, db: Session = Depends(get_db)):
  corpus=get_corpus_uploaded(db)
  
  return corpus

@router.post("/c/upload")
async def upload_corpus(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user_details = authhenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")

    file_name = file.filename
    file_size = 0
    file_type = Path(file_name).suffix.lower()

    if file_type not in [".csv", ".xlsx", ".json"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    contents = await file.read()
    file_size = len(contents)

    try:
        if file_type == ".csv":
            df = pd.read_csv(pd.io.common.BytesIO(contents))
        elif file_type == ".xlsx":
            df = pd.read_excel(pd.io.common.BytesIO(contents))
        elif file_type == ".json":
            df = pd.read_json(pd.io.common.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")

    df.columns = df.columns.str.lower().str.strip()

    required_columns = {"title", "abstract"}
    if not required_columns.issubset(set(df.columns)):
        raise HTTPException(
            status_code=400,
            detail=f"File must contain columns: {required_columns}, but got {df.columns.tolist()}"
        )

    # Simpan metadata file ke tabel FilesUploaded
    file_id = insert_file_record(db=db, user_id=user_id, file_name=file_name)

    # Ambil kombinasi title-abstract unik dari database
    existing_pairs = set(
        db.query(models.Corpus.title, models.Corpus.abstract).all()
    )

    corpus_entries = []
    merged_entries = []
    duplicate_count = 0

    for _, row in df.iterrows():
        title = str(row["title"]).strip()
        abstract = str(row["abstract"]).strip()

        if not title or not abstract:
            continue

        if (title, abstract) in existing_pairs:
            duplicate_count += 1
            continue

        new_corpus = insert_corpus(
            db=db,
            user_id=user_id,
            file_id=file_id,
            file_name=file_name,
            file_size=file_size,
            file_type=file_type,
            title=title,
            abstract=abstract,
            date_uploaded=datetime.now(),
            file_real=contents
        )

        new_merged = upload_merged(
            db=db,
            title=title,
            abstract=abstract
        )

        corpus_entries.append(new_corpus)
        merged_entries.append(new_merged)

    if not corpus_entries:
        return {
            "message": "Upload skipped. All entries are duplicates.",
            "duplicate_count": duplicate_count
        }

    db.add_all(corpus_entries + merged_entries)
    db.commit()

    return {
        "message": "Upload successful",
        "total_uploaded": len(corpus_entries),
        "duplicate_skipped": duplicate_count,
        "example_title": corpus_entries[0].title,
        "example_abstract": corpus_entries[0].abstract
    }



  
  

# @router.post("/c")
# async def upload_corpus(file: Corpus):
#     if not file:
#         return HTTPException(status_code=415, detail="Not supported")
    
#     try:
      
#         metadata = {
#             "idFile":file.idFile,
#           "nameFile": file.nameFile,
#           "typeFile": file.typeFile,
#           "sizeFile": file.sizeFile,
#           "contentFile": file.contentFile,
#           "statusFile": file.statusFile,
#           "uploadDate": file.uploadDate,
#         }
#         db.corpus.insert_one(metadata)
#         return {
#           "message": "Upload successful", 
#           "corpus_id": str(file.idFile),
#           "corpus_name": str(file.nameFile),
#           "corpus_type": str(file.typeFile),
#           "corpus_size": int(file.sizeFile),
#           "content": str(file.contentFile),
#           "uploaded": str(file.uploadDate),
#           "status": str(file.statusFile)
#           }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))