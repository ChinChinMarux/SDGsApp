from fastapi import APIRouter, HTTPException, Request, Depends, UploadFile, File, Query, WebSocket
import pandas as pd
from typing import List
from io import BytesIO
from sqlalchemy.orm import Session
from ..config import models
from ..config.db import (get_corpus_uploaded, insert_corpus, insert_file_record, upload_merged, get_user)
from ..utils import authenticate_and_get_user_details
from ..config.models import get_db
import asyncio
from pathlib import Path
from pydantic import BaseModel
from datetime import datetime
import json

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
    corpus = get_corpus_uploaded(db)
    return corpus

@router.post("/c/upload")
async def upload_corpus(
    request: Request, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    user_details = authenticate_and_get_user_details(request, db)
    user_id = user_details.get("user_id")

    file_name = file.filename
    file_size = 0
    file_type = Path(file_name).suffix.lower()

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

    # PERBAIKAN: Menambahkan kolom 'doi', 'authors', dan 'topics' sebagai kolom wajib
    required_columns = {"title", "abstract", "doi", "authors", "topics"}
    
    # Memeriksa apakah semua kolom yang dibutuhkan ada, namun tetap fleksibel
    # Anda bisa memilih untuk tidak menjadikannya wajib jika data di file Anda tidak selalu lengkap
    
    # Ganti baris ini jika Anda ingin mengizinkan kolom 'doi', 'authors', 'topics' bersifat opsional
    if not required_columns.issubset(set(df.columns)):
        missing_columns = required_columns - set(df.columns)
        print(f"Warning: Missing columns in uploaded file: {missing_columns}")
        # Anda bisa memilih untuk raise HTTPException di sini, atau melanjutkan dengan peringatan
        # Untuk kemudahan, kita akan melanjutkan, tetapi dengan nilai default None atau "[]"

    # Simpan metadata file ke tabel FilesUploaded
    file_id = insert_file_record(db=db, user_id=user_id, file_name=file_name)

    # Ambil kombinasi title-abstract unik dari database
    existing_pairs = set(
        db.query(models.Metadata.title, models.Metadata.abstract).all()
    )

    corpus_entries = []
    duplicate_count = 0

    for _, row in df.iterrows():
        title = str(row.get("title", "")).strip()
        abstract = str(row.get("abstract", "")).strip()

        # Lewati jika title atau abstract kosong
        if not title or not abstract:
            continue
        
        if (title, abstract) in existing_pairs:
            duplicate_col += 1
            continue

        # PERBAIKAN: Ambil data dari kolom 'doi', 'authors', dan 'topics'
        # Gunakan .get() untuk menghindari KeyError jika kolom tidak ada
        doi = row.get("doi", None)
        authors_data = row.get("authors", "[]") 
        topics_data = row.get("topics", "[]")
        
        # Lakukan validasi dasar untuk data authors dan topics
        # Ini akan membantu mencegah error JSONDecodeError di graphroutes.py
        try:
            json.loads(authors_data)
        except (json.JSONDecodeError, TypeError):
            authors_data = "[]"
            
        try:
            json.loads(topics_data)
        except (json.JSONDecodeError, TypeError):
            topics_data = "[]"

        # PERBAIKAN: Teruskan data yang baru diambil ke fungsi insert_corpus
        new_corpus = insert_corpus(
            db=db,
            file_name=file.filename,
            file_size=len(file_binary),
            file_type=file_type,
            title=title,
            abstract=abstract,
            date_uploaded=datetime.now(),
            file_real=contents,
            doi=doi,
            authors=authors_data,
            topics=topics_data
        )
        db.add(merged_entries)
        corpus_entries.append(new_corpus)
        
    db.add_all(corpus_entries)
    db.commit()

    return {
        "message": "Upload successful",
        "total_uploaded": len(corpus_entries),
        "duplicate_skipped": duplicate_count,
        "example_title": corpus_entries[0].title if corpus_entries else None,
        "example_abstract": corpus_entries[0].abstract if corpus_entries else None,
    }
