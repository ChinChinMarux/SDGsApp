<<<<<<< HEAD
from fastapi import APIRouter
from src.models.analysis_models import Analysis

router = APIRouter()
=======
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from ..utils import authenticate_and_get_user_details
from ..config import models
from ..config.models import get_db
from ..services.model_handler import run_lda_analysis
import json

router = APIRouter()

class AnalysisRequest(BaseModel):
    file_id: int
    num_topics: int
    iteration: int
    date_analyzed: datetime

@router.post("/analyze")
def start_analysis(request: Request, payload: AnalysisRequest, db: Session = Depends(get_db)):
    # Validasi User
    user_details= authenticate_and_get_user_details(request, db)
    user_id = user_details.get("user_id")
    # Validasi file
    file = db.query(models.FilesUploaded).filter(
        models.FilesUploaded.id == payload.file_id,
        models.FilesUploaded.uploaded_by==user_id).first()
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
    
@router.get("/a/{file_id}")
async def get_latest_analysis(
    request: Request,
    file_id:int,
    db: Session = Depends(get_db)
):
    """Get the most recent completed analysis for the user"""
    try:
        
        user_details = authenticate_and_get_user_details(request, db)
        user = user_details.get("user_id")
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
       
        latest_analysis = db.query(models.AnalysisResult).filter(
            models.AnalysisResult.file_id==file_id,
            models.FilesUploaded.uploaded_by==user).order_by(
            models.AnalysisResult.id.desc()).first()
        
        if not latest_analysis:
            raise HTTPException(status_code=404, detail="No completed analysis found")
        
        
        topics = (
            json.loads(latest_analysis.topic_result)
            if isinstance(latest_analysis.topic_result, str)
            else latest_analysis.topic_result or []
        )

        # sdg_results = (
        #     json.loads(latest_analysis.sdg_result)
        #     if isinstance(latest_analysis.sdg_result, str)
        #     else latest_analysis.sdg_result or []
        # )

        
        return {
            "success": True,
            "data": {
                "topics": topics,  
                "topic_distribution": topics,  
                # "sdg_mapping": sdg_results,
                "file_name": latest_analysis.file_name
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get latest analysis: {str(e)}")
>>>>>>> 4e73095e06b1994bd6c16400150647e864023857
