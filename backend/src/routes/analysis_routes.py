from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import Session
from ..config.db import (
    get_corpus_by
)
from ..config import models
from ..config.models import get_db
from ..services.model_handler import run_lda_analysis

router = APIRouter()

class AnalysisRequest(BaseModel):
    file_id: int
    num_topics: int
    iteration: int
    date_analyzed: datetime


@router.post("/analyze")
def start_analysis(payload: AnalysisRequest, db: Session = Depends(get_db)):
    # Validasi file
    file = db.query(models.FilesUploaded).filter(models.FilesUploaded.id == payload.file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    # Ambil metadata terkait file_id
    metadata = (
        db.query(models.Metadata)
        .filter(models.Metadata.file_id == payload.file_id)
        .all()
    )

    if not metadata:
        raise HTTPException(status_code=404, detail="No metadata found for file")

    # Gabungkan title dan abstract
    texts = [f"{m.title} {m.abstract}" for m in metadata]

    # Simpan ke AnalysisBaseFile
    base = models.AnalysisBaseFile(
        file_id=payload.file_id,
        num_topics=payload.num_topics,
        iteration=payload.iteration,
        date_analyzed=datetime.now()
    )
    db.add(base)
    db.commit()
    db.refresh(base)

    # Jalankan LDA
    topic_result, coherence = run_lda_analysis(texts, payload.num_topics, payload.iteration)

    # Simpan hasil ke AnalysisResult
    result = models.AnalysisResult(
        file_id=payload.file_id,
        file_name=file.file_name,
        coherence=coherence,
        topic_count=payload.num_topics,
        topic_result=topic_result,  # list of string
    )
    db.add(result)
    db.commit()

    return {
        "message": "Analisis selesai",
        "result": {
            "file_name": result.file_name,
            "coherence": result.coherence,
            "topic_count": result.topic_count,
            "topics": result.topic_result,
        },
    }
