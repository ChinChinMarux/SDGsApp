from pydantic import BaseModel, Field
from datetime import datetime

class Corpus(BaseModel):
    user_id: str
    extension: str
    title: str
    status: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)
