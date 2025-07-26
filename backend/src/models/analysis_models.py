from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import datetime

class Analysis(BaseModel):
    analysis_id: str
    corpus_id: str
    parameter: dict
    result: str
    topic_distribution: List[float]
    result_date: datetime = Field(default_factory=datetime.utcnow)
