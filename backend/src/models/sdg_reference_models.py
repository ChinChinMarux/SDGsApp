from pydantic import BaseModel
from typing import List

class SDGReference(BaseModel):
    title: str
    description: str
    keywords: List[str]
