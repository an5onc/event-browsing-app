"""
=========================================================
LIKING LOG (likesLog table integration)
=========================================================

Purpose:
- Provides helper functions for managing "likes" on events.
- Each like is represented as a row in the likesLog table 
  linking a user (accountID) and an event (eventID).

What Changed:
- Uses a shared DB path resolver so it always points to backend/db/EventPlannerDB.db.
- Adds functions to check, insert, remove, and query likes.
- Returns lists of user IDs or event IDs for flexibility.
- Prevents duplicate likes with a `has_liked` check.

Frontend Use:
- React frontend can call API endpoints that wrap these functions
  (e.g., POST /like, DELETE /like, GET /likes).
"""

import os, sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "db", "EventPlannerDB.db")

def _get_conn():
    """Helper: open a SQLite connection with row_factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def has_liked(user_id: int, event_id: int) -> bool:
    """Check if the user already liked this event."""
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM likesLog WHERE accountID=? AND eventID=? LIMIT 1", (user_id, event_id))
        return cur.fetchone() is not None

def add_like(user_id: int, event_id: int):
    """Add a like to the event (only if not already liked)."""
    if has_liked(user_id, event_id):
        return False
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO likesLog (eventID, accountID) VALUES (?, ?)", (event_id, user_id))
        conn.commit()
        return True

def remove_like(user_id: int, event_id: int):
    """Remove a like from the event."""
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM likesLog WHERE accountID=? AND eventID=?", (user_id, event_id))
        conn.commit()
        return cur.rowcount > 0

def get_event_likes(event_id: int) -> list[int]:
    """Return list of all accountIDs that liked this event."""
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT accountID FROM likesLog WHERE eventID=?", (event_id,))
        return [row[0] for row in cur.fetchall()]

def get_user_likes(user_id: int) -> list[int]:
    """Return list of all eventIDs this user has liked."""
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT eventID FROM likesLog WHERE accountID=?", (user_id,))
        return [row[0] for row in cur.fetchall()]
