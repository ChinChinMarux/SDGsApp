from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from .object import PyObjectId

class Analysis(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId,alias="_id")
    corpus_id: str
    result: str
    coherence_score: int
    topic_distribution: List[float]
    result_date: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}
