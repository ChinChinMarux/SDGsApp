from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from .object import PyObjectId

class Corpus(BaseModel):
    idFile: str
    nameFile: str
    typeFile: Optional[str] = None
    sizeFile: Optional[int] = None
    statusFile: Optional[str] = None
    contentFile: Optional[str] = None
    uploadDate: Optional[str] = None
    # Optional[PyObjectId] = Field(default_factory=PyObjectId,alias="_id")
    @validator("nameFile")
    def validate_extension(cls, v):
        allowed_extensions = [".csv", ".xlsx", ".json"]
        if not any(v.endswith(ext) for ext in allowed_extensions):
            raise ValueError("File extension not allowed")
        return v
    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}
        