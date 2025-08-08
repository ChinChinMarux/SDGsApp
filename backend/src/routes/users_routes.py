from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from ..config.db import (get_user)
from ..utils import authhenticate_and_get_user_details
from ..config.models import get_db

router = APIRouter()


@router.get("/user")
def secure_route(request: Request, db: Session = Depends(get_db)):
    user_data = authhenticate_and_get_user_details(request)
    user = get_user(user_data, db)
    return {"message": f"Welcome {user.user_name}"}