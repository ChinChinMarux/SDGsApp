from fastapi import Request, HTTPException
from sqlalchemy.orm import Session
from src.config import models
from clerk_backend_api import Clerk, AuthenticateRequestOptions
import os
from dotenv import load_dotenv

load_dotenv()

clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

def authenticate_and_get_user_details(request: Request, db: Session):
    try:
        auth_header = request.headers.get("authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Authorization header missing or malformed")

        request_state = clerk_sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=["http://localhost:5173", "http://localhost:5174"],
                jwt_key=os.getenv("JWT_KEY")
            )
        )

        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="Invalid token")

        payload = request_state.payload

        user_id = payload.get("sub")
        user_name = payload.get("username") or "Researcher"
        email = payload.get("email_address") or ""

        if not user_id:
            raise HTTPException(status_code=400, detail="Token missing essential user_id")

        # Simpan atau update user di database
        user = db.query(models.User).filter_by(id=user_id).first()
        if user:
            # update user
            user.username = user_name
            user.email = email
        else:
            # insert user
            user = models.User(
                id=user_id,
                user_name=user_name,
                email=email,
            )
            db.add(user)

        db.commit()

        return {
            "user_id": user_id,
            "user_name": user_name,
            "email": email,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token validation error: {str(e)}")
