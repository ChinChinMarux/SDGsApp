from fastapi import APIRouter
from src.models.analysis_models import Analysis
from src.config import db

router = APIRouter()

@router.post("/analysis")
async def create_analysis(analysis: Analysis):
    await db["Analysis"].insert_one(analysis.dict())
    return {"message": "Analysis stored successfully"}

@router.get("/analysis/by-corpus/{corpus_id}")
async def get_analysis_by_corpus(corpus_id: str):
    results = await db["Analysis"].find({"corpus_id": corpus_id}).to_list(100)
    return results

@router.get("/analysis/{analysis_id}")
async def get_analysis_by_id(analysis_id: str):
    result = await db["Analysis"].find_one({"analysis_id": analysis_id})
    return result

@router.get("/analysis/accuracy/average")
async def average_accuracy():
    analyses = await db["Analysis"].find({}, {"result": 1}).to_list(1000)
    if not analyses:
        return {"average": 0.0}
    avg = sum(a["result"] for a in analyses) / len(analyses)
    return {"average": round(avg, 2)}

@router.get("/analysis/recent")
async def get_recent_analysis(limit: int = 5):
    data = await db["Analysis"].find().sort("result_date", -1).to_list(length=limit)
    return data