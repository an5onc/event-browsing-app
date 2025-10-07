import os
import sqlite3
from typing import Optional

"""
=========================================================
CREATE EVENT (events table insert)
=========================================================

Purpose:
- Handles inserting new events into the events table.
- Ensures only allowed event types and access levels are stored.
- Returns the new eventID so it can be referenced later.

What Changed:
- Centralized DB path resolution so code works no matter where run.
- Enforced validation of eventType and eventAccess.
- Supports optional images, RSVP flag, pricing fields.
- Built to be called directly or from API endpoints.

Frontend Use:
- React "Create Event" form → send event details to backend → call create_event().
- Backend should validate user ID (creatorID) before insertion.
"""

# -----------------------------
# DATABASE PATH RESOLUTION
# Ensures DB points to backend/db/EventPlannerDB.db
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # go up one level (from events/ to backend/)
DB_PATH = os.path.join(BASE_DIR, "db", "EventPlannerDB.db")

# -----------------------------
# ALLOWED FIELDS
# Used for validation to prevent bad data
# -----------------------------
ALLOWED_EVENT_TYPES = {
    "Art", "Math", "Science", "Computer Science", "History",
    "Education", "Political Science", "Software Engineering",
    "Business", "Sports", "Honors", "Workshops",
    "Study Session", "Dissertation", "Performance", "Competition"
}
ALLOWED_ACCESS = {"Public", "Private", "Inactive"}


# -----------------------------
# CREATE EVENT FUNCTION
# Inserts a new event row into the database
# Returns the new eventID
# -----------------------------
def create_event(
    creatorID: int,
    eventName: str,
    eventDescription: str,
    location: str,
    eventType: str,
    startDateTime: str,  # "YYYY-MM-DD HH:MM:SS"
    endDateTime: str,    # "YYYY-MM-DD HH:MM:SS"
    eventAccess: str = "Public",
    images: Optional[bytes] = None,
    rsvpRequired: int = 0,
    isPriced: int = 0,
    cost: Optional[float] = None,
) -> int:
    """
    Insert a new event record into the events table.
    - Validates eventType and eventAccess
    - Automatically sets numberLikes = 0
    - Returns: the newly created eventID
    """

    # Validation checks
    if eventType not in ALLOWED_EVENT_TYPES:
        raise ValueError(f"eventType must be one of: {sorted(ALLOWED_EVENT_TYPES)}")
    if eventAccess not in ALLOWED_ACCESS:
        raise ValueError(f"eventAccess must be one of: {sorted(ALLOWED_ACCESS)}")

    # Insert into DB
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO events (
                creatorID, eventName, eventDescription, location, images,
                eventType, eventAccess, startDateTime, endDateTime,
                numberLikes, rsvpRequired, isPriced, cost
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
        """, (
            creatorID, eventName, eventDescription, location, images,
            eventType, eventAccess, startDateTime, endDateTime,
            rsvpRequired, isPriced, cost
        ))
        conn.commit()
        return cur.lastrowid


# -----------------------------
# DEBUG / LOCAL TESTING
# Run this file directly to test event creation
# (API will call create_event in production)
# -----------------------------
if __name__ == "__main__":
    new_id = create_event(
        creatorID=1,
        eventName="Backend Test Event",
        eventDescription="This event was created directly in create.py",
        location="Library Room 210",
        eventType="Workshops",
        startDateTime="2025-10-15 14:00:00",
        endDateTime="2025-10-15 16:00:00"
    )
    print(f"New event created with ID: {new_id}")
