from fastapi import APIRouter
from src.models.sdg_reference_models import SDGReference
from src.config.db import db

router = APIRouter()

@router.post("/sdg-reference")
async def add_sdg_ref(sdg: SDGReference):
    await db["SDG_Reference"].insert_one(sdg.dict())
    return {"message": "SDG reference added"}

@router.get("/sdg-reference")
async def get_all_sdg_refs():
    results = await db["SDG_Reference"].find().to_list(50)
    return results

@router.get("/sdg-reference/{sdg_id}")
async def get_sdg_by_id(sdg_id: int):
    result = await db["SDG_Reference"].find_one({"sdg_id": sdg_id})
    return result
