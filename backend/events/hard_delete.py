import os
import sqlite3

"""
=========================================================
HARD DELETE EVENT (permanent removal)
=========================================================

Purpose:
- Completely deletes an event row and related child rows (RSVPs, Likes, Invites).
- Used for permanent removal (e.g., spam events or cleanup).

What Changed:
- Manual cascade: removes rows from rsvpLog, likesLog, inviteLog, eventCategories before deleting event.
- Authorization check: must be creator or Faculty (admin).
- Returns True/False for whether deletion succeeded.

Frontend Use:
- Rarely exposed directly to users (destructive).
- Typically used by Faculty admin tools for moderation.
- Frontend should confirm user intent before calling.
"""

# -----------------------------
# DATABASE PATH
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "db", "EventPlannerDB.db")

def _get_conn():
    return sqlite3.connect(DB_PATH)

# -----------------------------
# AUTHORIZATION HELPER
# -----------------------------
def _is_authorized(updater_id: int, event_creator_id: int) -> bool:
    """
    Checks if user is allowed to delete event:
    - Must be event creator OR Faculty accountType.
    """
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT accountType FROM accounts WHERE accountID = ?", (updater_id,))
        row = cur.fetchone()
        if not row:
            return False
        return updater_id == event_creator_id or row[0] == "Faculty"

# -----------------------------
# HARD DELETE FUNCTION
# -----------------------------
def hard_delete_event(eventID: int, requesterID: int) -> bool:
    """
    Permanently delete an event and related rows.
    Returns True if deletion succeeded, False otherwise.
    """
    with _get_conn() as conn:
        cur = conn.cursor()

        # Get creatorID for authorization
        cur.execute("SELECT creatorID FROM events WHERE eventID = ?", (eventID,))
        row = cur.fetchone()
        if not row:
            return False
        creator_id = row[0]

        if not _is_authorized(requesterID, creator_id):
            return False

        # Delete related logs before event
        cur.execute("DELETE FROM rsvpLog         WHERE eventID = ?", (eventID,))
        cur.execute("DELETE FROM likesLog        WHERE eventID = ?", (eventID,))
        cur.execute("DELETE FROM inviteLog       WHERE eventID = ?", (eventID,))
        cur.execute("DELETE FROM eventCategories WHERE eventID = ?", (eventID,))

        # Delete event last
        cur.execute("DELETE FROM events WHERE eventID = ?", (eventID,))
        conn.commit()

        return cur.rowcount > 0

# -----------------------------
# DEBUG / LOCAL TESTING
# -----------------------------
if __name__ == "__main__":
    success = hard_delete_event(eventID=1, requesterID=1)
    print("Deleted:", success)
