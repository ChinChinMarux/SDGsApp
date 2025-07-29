from pydantic import BaseModel
from typing import List

class SDGMapping(BaseModel):
    mapping_id: str
    analysis_id: str
    mapping_result: str
    confidence_score: float
    topic_distribution: List[float]
