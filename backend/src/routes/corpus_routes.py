from fastapi import APIRouter, HTTPException, Request, Depends, UploadFile, File, Query, WebSocket
import pandas as pd
from typing import List
from io import BytesIO
from sqlalchemy.orm import Session
from ..config import models
from ..config.db import (
    get_corpus_uploaded, 
    insert_corpus, 
    get_corpus_by, 
    upload_merged, 
    insert_file_record,
    download_file)
from ..utils import authenticate_and_get_user_details
from ..config.models import get_db
import asyncio
from pathlib import Path
from pydantic import BaseModel
from datetime import datetime
from pathlib import Path
router = APIRouter()
progress_store ={}
# class RequestModel(BaseModel):
#     id: int
#     title: str
#     abstract: str
#     uploaded_by: str
#     file_name: str
#     date_uploaded: datetime
#     class Config:
#         orm_mode = True

class RequestModelByUser(BaseModel):
    id: int
    file_name: str
    uploaded_by: str
    file_size: int
    file_type: str
    date_uploaded: datetime
    status: str
    class Config:
        orm_mode = True

@router.delete #hapus file

@router.get #view file

@router.get("/c/download")
async def download_corpus(file_id: int = Query(...), db: Session = Depends(get_db)):
    return download_file(db, file_id)
    
@router.get("/c/uploaded")
async def get_uploaded_files(request: Request, db: Session = Depends(get_db)):
    user_details= authenticate_and_get_user_details(request, db)
    user_id = user_details.get("user_id")
    files = get_corpus_by(db, user_id)
    
    return [
        {"id": f.id, 
         "file_name": f.file_name,
         "file_size": f.file_size,
         "extension": f.file_type,
         "uploaded_at": f.date_uploaded
         }
        for f in files
    ]

    
@router.get("/c/u/analyse")
async def get_uploaded_for_analyse(request: Request, db: Session = Depends(get_db)):
    user_details= authenticate_and_get_user_details(request, db)
    user_id = user_details.get("user_id")
    files = get_corpus_by(db, user_id)
    
    return {
        "files": [{"id": f.id, "file_name": f.file_name} for f in files]
    }

@router.websocket("/ws/progress/{file_id}")
async def websocket_progress(websocket: WebSocket, file_id: str):
    await websocket.accept()
    while True:
        progress = progress_store.get(file_id, 0)
        await websocket.send_json({"progress": progress})
        await asyncio.sleep(1) 


@router.post("/c/upload")
async def upload_corpus(
    request: Request, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    user_details = authenticate_and_get_user_details(request, db)
    user_id = user_details.get("user_id")

    fileName = file.filename
    file_type = Path(fileName).suffix.lower()
    file_name_stemmed = Path(fileName).stem
    status = "completed"
    if file_type not in [".csv", ".xlsx", ".json"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    contents = await file.read()
    file_size = len(contents)
    file_binary = bytes(contents)

    try:
        if file_type == ".csv":
            df = pd.read_csv(BytesIO(contents))
        elif file_type == ".xlsx":
            df = pd.read_excel(BytesIO(contents))
        elif file_type == ".json":
            df = pd.read_json(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")

    df.columns = df.columns.str.lower().str.strip()
    total_rows = len(df)
    rows_inserted = 0
    
    required_title=["title", "titles"]
    required_abstract=["abstract", "abstracts", "summaries", "summary"]
    required_columns = [required_title, required_abstract]
    
    def has_required_columns(columns):
        return all(any(col in columns for col in group) for group in required_columns)
    columns_in_file = set(df.columns)
    if not has_required_columns(columns_in_file):
        raise ValueError("Missing required columns")

    title_col = next((col for col in required_title if col in df.columns), None)
    abstract_col = next((col for col in required_abstract if col in df.columns), None)
    
    existing_file=db.query(models.FilesUploaded).filter(
            models.FilesUploaded.file_name==file_name_stemmed,
            models.FilesUploaded.file_size==file_size
        ).first()
    
    if not existing_file:
    # Simpan metadata file ke tabel FilesUploaded
        file_id = insert_file_record(
            db=db, 
            user_id=user_id,    
            file_name=file_name_stemmed,
            file_size=file_size,
            file_type=file_type,
            date_uploaded=datetime.now(),
            status=status
            )
        progress_store[file_id] = 0
    else:
        return {
                "message": "Upload Skipped, File's Already Stored!"
            }
    
    # Ambil kombinasi title-abstract unik dari database
    existing_pairs = set(
        db.query(models.Metadata.title, models.Metadata.abstract).all()
    )

    corpus_entries = []
    merged_entries = []
    
    duplicate_col = 0

    for _, row in df.iterrows():
        title = str(row[title_col]).strip()
        abstract = str(row[abstract_col]).strip()

        if not title or not abstract:
            continue
        
        if (title, abstract) in existing_pairs:
            duplicate_col += 1
            continue

        new_corpus = insert_corpus(
            db=db,
            file_name=file.filename,
            file_size=len(file_binary),
            file_type=file_type,
            file_id=file_id,
            user_id=user_id,
            date_uploaded=datetime.utcnow(),
            file_real=file_binary
        )
        db.add(new_corpus)
        db.flush()

        merged_entries = upload_merged(
            db=db,
            file_id=file_id,  
            title=title,
            abstract=abstract
        )
        db.add(merged_entries)
        corpus_entries.append(new_corpus)
        rows_inserted += 1
        progress_store[file_id] = round((rows_inserted / total_rows) * 100, 2)
    
    db.commit()  
    if not corpus_entries:
        return {
            "message": "Upload skipped. All entries are duplicates.",
            "duplicate_count": duplicate_col
        }

    return {
        "message": "Upload successful",
        "total_uploaded": len(corpus_entries),
        "duplicate_skipped": duplicate_col,
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