from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..config import models
from ..utils import authenticate_and_get_user_details
from ..config.models import get_db

router = APIRouter()

class UserCreate(BaseModel):
    id: str
    user_name: str
    email: str
    
@router.post("/user-create")
def add_user(user: UserCreate, db: Session = Depends(get_db)):
    # Cek apakah user sudah ada
    existing_user = db.query(models.User).filter(models.User.id == user.id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Tambahkan user baru
    new_user = models.User(
        id=user.id, 
        name=user.user_name, 
        email=user.email,
        )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "User added", 
        "user": user}

# @router.get("/user")
# def secure_route(request: Request, db: Session = Depends(get_db)):
#     user_data = authenticate_and_get_user_details(request)
#     user = get_user(user_data, db)
#     return {"message": f"Welcome {user.user_name}"}