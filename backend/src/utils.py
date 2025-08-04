from fastapi import Request, HTTPException
from clerk_backend_api import Clerk, AuthenticateRequestOptions
import os
from dotenv import load_dotenv

load_dotenv()

clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

def authhenticate_and_get_user_details(request: Request):
    try:
        # Paksa ambil token dari header Authorization
        auth_header = request.headers.get("authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Authorization header missing or malformed")

        # Simulasikan request seperti frontend
        request.scope["headers"].append(
            (b"authorization", auth_header.encode())
        )

        # Gunakan authenticate_request seperti biasa
        request_state = clerk_sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=["http://localhost:5173"],  # atau yang kamu pakai
                jwt_key=os.getenv("JWT_KEY")
            )
        )

        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = request_state.payload.get("sub")
        return {"user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token validation error: {str(e)}")
