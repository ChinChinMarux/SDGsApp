from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from bson import ObjectId
from src.models.corpus_models import Corpus
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from src.config.db import db
from datetime import datetime
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "../uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/corpus/upload")
async def upload_corpus_file(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    status: str = Form("uploaded")
):
    # Generate corpus_id
    corpus_id = str(uuid.uuid4())
    extension = file.filename.split(".")[-1]
    filename = f"{corpus_id}.{extension}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Simpan file ke disk
    with open(filepath, "wb") as f:
        f.write(await file.read())

    # Simpan metadata ke DB
    corpus = Corpus(
        corpus_id=corpus_id,
        user_id=user_id,
        extension=extension,
        title=file.filename,
        status=status,
        upload_date=datetime.utcnow()
    )
    corpus_dict = corpus.dict()
    corpus_dict["filepath"] = filepath  # optional tambahan
    await db["Corpus"].insert_one(corpus_dict)

    return {"message": "File uploaded successfully", "corpus_id": corpus_id}

@router.get("/corpus/{user_id}")
async def get_user_corpus(user_id: str):
    results = await db["Corpus"].find({"user_id": user_id}).to_list(100)
    return results

@router.get("/corpus/count")
async def get_total_corpus(status: str = None):
    query = {"status": status} if status else {}
    count = await db["Corpus"].count_documents(query)
    return {"count": count}

@router.get("/corpus/list")
async def get_all_corpus():
    results = await db["Corpus"].find().sort("upload_date", -1).to_list(100)
    
@router.delete("/corpus/{corpus_id}")
async def delete_corpus(corpus_id: str):
    result = await db["Corpus"].delete_one({"corpus_id": corpus_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Corpus not found")
    return {"message": "Corpus deleted"}


@router.get("/corpus/download/{corpus_id}")
async def download_file(corpus_id: str):
    fs = AsyncIOMotorGridFSBucket(db)
    try:
        stream = await fs.open_download_stream(ObjectId(corpus_id))
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")

    return StreamingResponse(
        stream,
        media_type='application/octet-stream',
        headers={"Content-Disposition": f"attachment; filename={stream.filename}"}
    )
