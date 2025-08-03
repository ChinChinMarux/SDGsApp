from fastapi import APIRouter
from src.models.sdg_mapping_models import SDGMapping
from src.config.db import db

router = APIRouter()

@router.post("/sdg-mapping")
async def add_mapping(mapping: SDGMapping):
    await db["SDG_Mapping"].insert_one(mapping.dict())
    return {"message": "Mapping added"}

@router.get("/sdg-mapping/by-analysis/{analysis_id}")
async def get_mapping_by_analysis(analysis_id: str):
    result = await db["SDG_Mapping"].find_one({"analysis_id": analysis_id})
    return result

@router.get("/sdg-mapping/distribution")
async def sdg_distribution():
    pipeline = [
        {"$group": {"_id": "$mapping_result", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    result = await db["SDG_Mapping"].aggregate(pipeline).to_list(None)
    return [{"name": r["_id"], "value": r["count"]} for r in result]
