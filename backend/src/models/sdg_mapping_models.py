from pydantic import BaseModel, Field
from typing import List, Optional
from .object import PyObjectId

class SDGMapping(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId,alias="_id")
    analysis_id: str
    mapping_result: List[str]
    confidence_score: float
    topic_distribution: List[float]

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}
