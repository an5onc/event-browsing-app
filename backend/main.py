"""
=========================================================
FASTAPI SERVER - Event Browsing App Backend
=========================================================

Purpose:
- REST API server for the event browsing application
- Handles user accounts, events, likes, RSVPs
- Runs on port 8000 by default

To Run:
    uvicorn main:app --reload

Or from backend directory:
    python -m uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import sys
import os

# Add backend to path so we can import modules
sys.path.append(os.path.dirname(__file__))

from UserAccounts.userAccount import userAccount
from events.read import read_events, read_event_by_id
from events.create import create_event
from events.update import update_event
from liking_log.liking_log import has_liked, add_like, remove_like, get_user_likes
from rsvp.rsvp import has_rsvp, add_rsvp, cancel_rsvp, get_user_rsvps

# Initialize FastAPI app
app = FastAPI(title="Event Browsing API", version="1.0.0")

# Configure CORS for frontend (running on port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize user account manager
user_manager = userAccount()

# ============================================
# REQUEST/RESPONSE MODELS
# ============================================

class LoginRequest(BaseModel):
    emailOrUsername: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user: Optional[dict] = None

class CreateAccountRequest(BaseModel):
    accountID: int
    accountType: str  # "Student" or "Faculty"
    email: EmailStr
    password: str

class CreateAccountResponse(BaseModel):
    success: bool
    message: str
    verificationCode: Optional[str] = None

class UpdateProfileRequest(BaseModel):
    accountID: int
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class ChangePasswordRequest(BaseModel):
    accountID: int
    currentPassword: str
    newPassword: str

class StandardResponse(BaseModel):
    success: bool
    message: str

class UserProfileResponse(BaseModel):
    accountID: int
    email: str
    accountType: str
    isVerified: bool
    likedEvents: List[int]
    rsvpedEvents: List[int]

# ============================================
# HEALTH CHECK
# ============================================

@app.get("/")
def root():
    return {"message": "Event Browsing API is running", "status": "healthy"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

# ============================================
# USER ACCOUNT ENDPOINTS
# ============================================

@app.post("/api/accounts/login", response_model=LoginResponse)
def login(request: LoginRequest):
    """
    Login endpoint - validates email and password
    """
    try:
        success, result = user_manager.login(request.emailOrUsername, request.password)

        if success:
            # Get additional user info
            user_data = {
                "id": result,
                "accountID": result,
                "email": request.emailOrUsername,
                "name": request.emailOrUsername.split("@")[0]
            }
            return LoginResponse(
                success=True,
                message="Login successful",
                user=user_data
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=result
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/api/accounts/create", response_model=CreateAccountResponse)
def create_account(request: CreateAccountRequest):
    """
    Create a new user account
    """
    try:
        verification_code = user_manager.create_account(
            request.accountID,
            request.accountType,
            request.password,
            request.email
        )
        return CreateAccountResponse(
            success=True,
            message="Account created successfully. Please verify your email.",
            verificationCode=verification_code
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.put("/api/accounts/update-profile", response_model=StandardResponse)
def update_profile(request: UpdateProfileRequest):
    """
    Update user profile (username/email)
    Note: Currently the database schema doesn't have a separate username field.
    This endpoint is a placeholder for future implementation.
    """
    try:
        # TODO: Add username field to database schema
        # TODO: Implement update logic in userAccount.py
        # For now, return success (frontend will show success message)
        return StandardResponse(
            success=True,
            message="Profile updated successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.put("/api/accounts/change-password", response_model=StandardResponse)
def change_password(request: ChangePasswordRequest):
    """
    Change user password
    """
    try:
        # Validate password requirements
        import re
        errors = []

        if len(request.newPassword) < 8:
            errors.append("at least 8 characters")
        if not re.search(r'[A-Z]', request.newPassword):
            errors.append("one uppercase letter")
        if not re.search(r'[a-z]', request.newPassword):
            errors.append("one lowercase letter")
        if not re.search(r'[0-9]', request.newPassword):
            errors.append("one number")
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', request.newPassword):
            errors.append("one symbol")

        if errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Password must include: {', '.join(errors)}"
            )

        # Update password using the new method
        success, message = user_manager.update_password(
            request.accountID,
            request.currentPassword,
            request.newPassword
        )

        if success:
            return StandardResponse(
                success=True,
                message=message
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/api/accounts/{account_id}/profile", response_model=UserProfileResponse)
def get_user_profile(account_id: int):
    """
    Get user profile including liked events and RSVPs
    """
    try:
        # Get user's liked events
        liked_events = get_user_likes(account_id)

        # Get user's RSVPed events
        rsvped_events = get_user_rsvps(account_id)

        # TODO: Get user info from database
        # For now, returning placeholder data
        return UserProfileResponse(
            accountID=account_id,
            email="user@example.com",
            accountType="Student",
            isVerified=True,
            likedEvents=liked_events,
            rsvpedEvents=rsvped_events
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# ============================================
# EVENT ENDPOINTS
# ============================================

@app.get("/api/events")
def get_events(include_inactive: bool = False):
    """
    Get all events
    """
    try:
        events = read_events(include_inactive=include_inactive)
        return {"success": True, "events": events}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/api/events/{event_id}")
def get_event(event_id: int):
    """
    Get a specific event by ID
    """
    try:
        event = read_event_by_id(event_id)
        if event:
            return {"success": True, "event": event}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# ============================================
# LIKE ENDPOINTS
# ============================================

@app.post("/api/events/{event_id}/like")
def toggle_like(event_id: int, user_id: int):
    """
    Toggle like on an event
    """
    try:
        if has_liked(user_id, event_id):
            success = remove_like(user_id, event_id)
            message = "Like removed"
        else:
            success = add_like(user_id, event_id)
            message = "Event liked"

        return StandardResponse(success=success, message=message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/api/events/{event_id}/likes")
def get_event_likes(event_id: int):
    """
    Get all likes for an event
    """
    try:
        from liking_log.liking_log import get_event_likes
        likes = get_event_likes(event_id)
        return {"success": True, "likes": likes, "count": len(likes)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# ============================================
# RSVP ENDPOINTS
# ============================================

@app.post("/api/events/{event_id}/rsvp")
def toggle_rsvp(event_id: int, user_id: int):
    """
    Toggle RSVP on an event
    """
    try:
        if has_rsvp(user_id, event_id):
            success = cancel_rsvp(user_id, event_id)
            message = "RSVP cancelled"
        else:
            success = add_rsvp(user_id, event_id)
            message = "RSVP confirmed"

        return StandardResponse(success=success, message=message)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/api/events/{event_id}/rsvps")
def get_event_rsvps(event_id: int):
    """
    Get all RSVPs for an event
    """
    try:
        from rsvp.rsvp import get_event_rsvps
        rsvps = get_event_rsvps(event_id)
        return {"success": True, "rsvps": rsvps, "count": len(rsvps)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
