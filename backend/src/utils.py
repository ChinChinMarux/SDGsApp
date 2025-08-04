from fastapi import Request, HTTPException
from clerk_backend_api import Clerk, AuthenticateRequestOptions
import os
from dotenv import load_dotenv

load_dotenv()

clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

def authhenticate_and_get_user_details(request: Request):
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
        user_name = payload.get("username") or ""
        email = payload.get("email_address") or ""
        first_name = payload.get("first_name") or ""
        last_name = payload.get("last_name") or ""
        organization = payload.get("organization") or "No Organization"  # custom claim jika ada

        if not user_id:
            raise HTTPException(status_code=400, detail="Token missing essential user_id")
        print("Token payload:", payload)


        return {
            "user_id": user_id,
            "user_name": user_name,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "organization": organization
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token validation error: {str(e)}")

