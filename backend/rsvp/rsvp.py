"""
=========================================================
RSVP LOG (rsvpLog table integration)
=========================================================

Purpose:
- Manage RSVP actions: add, cancel, check, and fetch RSVPs.
- Each RSVP = user (accountID) ↔ event (eventID).

What Changed:
- Uses shared DB resolver like CRUD files.
- Ensures one RSVP per user/event (via `has_rsvp`).
- Returns lists of eventIDs or accountIDs for querying.

Frontend Use:
- Maps cleanly to endpoints (POST /rsvp, DELETE /rsvp, GET /rsvp).
- Helps display attendees for events or show a user’s RSVPs.
"""

import os, sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "db", "EventPlannerDB.db")

def _get_conn():
    """Helper: open SQLite connection with row_factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def has_rsvp(user_id: int, event_id: int) -> bool:
    """Check if this user has RSVP’d to this event already."""
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM rsvpLog WHERE accountID=? AND eventID=? LIMIT 1", (user_id, event_id))
        return cur.fetchone() is not None

def add_rsvp(user_id: int, event_id: int):
    """Add RSVP (if not already exists)."""
    if has_rsvp(user_id, event_id):
        return False
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO rsvpLog (eventID, accountID) VALUES (?, ?)", (event_id, user_id))
        conn.commit()
        return True

def cancel_rsvp(user_id: int, event_id: int):
    """Cancel RSVP (remove this user’s RSVP for the event)."""
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM rsvpLog WHERE accountID=? AND eventID=?", (user_id, event_id))
        conn.commit()
        return cur.rowcount > 0

def get_event_rsvps(event_id: int):
    """Return list of accountIDs who RSVP’d to this event."""
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT accountID FROM rsvpLog WHERE eventID=?", (event_id,))
        return [row[0] for row in cur.fetchall()]

def get_user_rsvps(user_id: int):
    """Return list of eventIDs this user has RSVP’d to."""
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT eventID FROM rsvpLog WHERE accountID=?", (user_id,))
        return [row[0] for row in cur.fetchall()]
