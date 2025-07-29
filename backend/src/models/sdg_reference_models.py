from pydantic import BaseModel
from typing import List

class SDGReference(BaseModel):
    sdg_id: int
    title: str
    description: str
    keywords: List[str]
