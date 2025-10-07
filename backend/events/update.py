import os
import sqlite3

"""
=========================================================
UPDATE EVENT (events table update)
=========================================================

Purpose:
- Allows authorized users (creator or Faculty) to update event fields.
- Only certain whitelisted fields are allowed to be changed.

What Changed:
- Authorization check against accounts table (Faculty override allowed).
- Dynamic query building supports partial updates (any subset of fields).
- Validation against ALLOWED_UPDATE_FIELDS ensures schema consistency.

Frontend Use:
- "Edit Event" page → submit only the changed fields → call update_event().
- Faculty admin portal → allow overriding student-created events if needed.
- Returns True/False for success, so frontend can show confirmation.
"""


# -----------------------------
# DATABASE PATH
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "db", "EventPlannerDB.db")

# Allowed fields for update
ALLOWED_UPDATE_FIELDS = {
    "eventName", "eventDescription", "location", "images",
    "eventType", "eventAccess", "startDateTime", "endDateTime",
    "rsvpRequired", "isPriced", "cost"
}

def _get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# -----------------------------
# AUTHORIZATION HELPER
# -----------------------------
def _is_authorized(updater_id: int, event_creator_id: int) -> bool:
    """
    Authorized if updater is event creator OR Faculty account.
    """
    with _get_conn() as conn:
        cur = conn.cursor()
        cur.execute("SELECT accountType FROM accounts WHERE accountID = ?", (updater_id,))
        row = cur.fetchone()
        if not row:
            return False
        return updater_id == event_creator_id or row[0] == "Faculty"

# -----------------------------
# UPDATE FUNCTION
# -----------------------------
def update_event(event_id: int, updater_id: int, updates: dict) -> bool:
    """
    Update selected fields of an event.
    Returns True if successful, False if not authorized or not found.
    """
    if not updates:
        return False

    # Validate allowed fields
    bad_keys = [k for k in updates.keys() if k not in ALLOWED_UPDATE_FIELDS]
    if bad_keys:
        raise ValueError(f"Illegal update fields: {bad_keys}")

    with _get_conn() as conn:
        cur = conn.cursor()

        # Fetch creatorID
        cur.execute("SELECT creatorID FROM events WHERE eventID = ?", (event_id,))
        row = cur.fetchone()
        if not row:
            return False
        creator_id = row[0]

        if not _is_authorized(updater_id, creator_id):
            return False

        # Build dynamic query
        set_clause = ", ".join([f"{k} = ?" for k in updates.keys()])
        params = list(updates.values()) + [event_id]

        cur.execute(f"UPDATE events SET {set_clause} WHERE eventID = ?", params)
        conn.commit()
        return cur.rowcount > 0
