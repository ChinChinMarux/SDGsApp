from pydantic import BaseModel, Field
from typing import List, Optional
from .object import PyObjectId

class SDGReference(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId,alias="_id")
    title: str
    description: str
    keywords: List[str]

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}
