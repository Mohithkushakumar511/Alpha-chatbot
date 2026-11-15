from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Header, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, EmailStr

from server.services.db_service import db_service

router = APIRouter()


# ---------------- SCHEMAS ---------------- #

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str


class LoginRequest(BaseModel):
    email: str
    password: str


class SaveConversationRequest(BaseModel):
    id: Optional[str] = None
    title: str = "New Chat"
    mode: str = "chat"
    messages: List[Dict[str, Any]] = Field(default_factory=list)
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None


class TransferConversationsRequest(BaseModel):
    conversations: List[Dict[str, Any]] = Field(default_factory=list)


def get_current_user_from_header(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token is required.",
        )
    user = db_service.get_user_by_token(authorization)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token.",
        )
    return user


# ---------------- AUTH ENDPOINTS ---------------- #

@router.post("/auth/register")
async def register_endpoint(req: RegisterRequest):
    try:
        user = db_service.create_user(
            email=req.email,
            password=req.password,
            full_name=req.full_name,
        )
        token = db_service.create_session(
            user["id"],
            email=user["email"],
            full_name=user["full_name"],
        )
        return {
            "token": token,
            "user": user,
            "message": "Account created successfully.",
        }
    except ValueError as val_err:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": str(val_err)},
        )
    except Exception as err:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Failed to create account. Please try again."},
        )


@router.post("/auth/login")
async def login_endpoint(req: LoginRequest):
    try:
        user = db_service.authenticate_user(email=req.email, password=req.password)
        if not user:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"error": "Invalid email address or password."},
            )

        token = db_service.create_session(
            user["id"],
            email=user["email"],
            full_name=user["full_name"],
        )
        return {
            "token": token,
            "user": user,
            "message": "Signed in successfully.",
        }
    except Exception as err:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Authentication failed. Please try again."},
        )


@router.post("/auth/logout")
async def logout_endpoint(authorization: Optional[str] = Header(None)):
    if authorization:
        db_service.delete_session(authorization)
    return {"success": True, "message": "Logged out successfully."}


@router.get("/auth/me")
async def me_endpoint(authorization: Optional[str] = Header(None)):
    if not authorization:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "Unauthenticated"},
        )
    user = db_service.get_user_by_token(authorization)
    if not user:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "Session expired"},
        )
    return {"user": user}


# ---------------- CONVERSATION SYNC & PERSISTENCE ---------------- #

@router.get("/conversations")
async def list_conversations(authorization: Optional[str] = Header(None)):
    user = get_current_user_from_header(authorization)
    convs = db_service.get_user_conversations(user["id"])
    return {"conversations": convs}


@router.post("/conversations")
async def save_conversation(req: SaveConversationRequest, authorization: Optional[str] = Header(None)):
    user = get_current_user_from_header(authorization)
    saved = db_service.save_user_conversation(user["id"], req.model_dump())
    return {"conversation": saved}


@router.post("/conversations/transfer")
async def transfer_conversations(req: TransferConversationsRequest, authorization: Optional[str] = Header(None)):
    user = get_current_user_from_header(authorization)
    imported_count = db_service.import_conversations(user["id"], req.conversations)
    all_convs = db_service.get_user_conversations(user["id"])
    return {
        "transferred": imported_count,
        "conversations": all_convs,
        "message": f"Successfully transferred {imported_count} conversation(s) to your account.",
    }


@router.delete("/conversations/{conv_id}")
async def delete_conversation(conv_id: str, authorization: Optional[str] = Header(None)):
    user = get_current_user_from_header(authorization)
    deleted = db_service.delete_user_conversation(user["id"], conv_id)
    return {"success": deleted}


@router.delete("/conversations")
async def clear_all_conversations(authorization: Optional[str] = Header(None)):
    user = get_current_user_from_header(authorization)
    count = db_service.clear_user_conversations(user["id"])
    return {"cleared": count}
