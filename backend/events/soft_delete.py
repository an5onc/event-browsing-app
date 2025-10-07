import os
import sqlite3

"""
=========================================================
SOFT DELETE EVENT (mark inactive)
=========================================================

Purpose:
- Marks an event as 'Inactive' instead of deleting it from DB.
- Removes RSVP and Like rows so counts don’t linger.
- Allows recovery/history since event row still exists.

What Changed:
- Authorization check: only creator or Faculty can delete.
- Instead of physical delete, updates eventAccess to 'Inactive'.
- Keeps schema cleaner than hard delete for audit/logging.

Frontend Use:
- "Cancel Event" button → call soft_delete_event().
- Inactive events should not show up in user-facing lists.
- Admin panel can still query inactive events with include_inactive=True.
"""

# -----------------------------
# DATABASE PATH
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "db", "EventPlannerDB.db")

def _get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# -----------------------------
# AUTHORIZATION HELPER
# -----------------------------
def _is_authorized(updater_id: int, event_creator_id: int) -> bool:
    """
    Authorized if requester is event creator OR Faculty account.
    """
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT accountType FROM accounts WHERE accountID = ?", (updater_id,))
        row = cur.fetchone()
        if not row:
            return False
        return updater_id == event_creator_id or row[0] == "Faculty"

# -----------------------------
# SOFT DELETE FUNCTION
# -----------------------------
def soft_delete_event(eventID: int, requesterID: int) -> bool:
    """
    Marks event as Inactive and removes related RSVPs/Likes.
    Returns True if updated, False otherwise.
    """
    with _get_conn() as conn:
        cur = conn.cursor()

        # Get creatorID
        cur.execute("SELECT creatorID FROM events WHERE eventID = ?", (eventID,))
        row = cur.fetchone()
        if not row:
            return False
        creator_id = row[0]

        # Check authorization
        if not _is_authorized(requesterID, creator_id):
            return False

        # Clean related logs
        cur.execute("DELETE FROM rsvpLog  WHERE eventID = ?", (eventID,))
        cur.execute("DELETE FROM likesLog WHERE eventID = ?", (eventID,))

        # Flag inactive
        cur.execute("""
            UPDATE events
            SET eventAccess = 'Inactive'
            WHERE eventID = ?
        """, (eventID,))
        conn.commit()
        return cur.rowcount > 0
