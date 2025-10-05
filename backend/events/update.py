# backend/app/routers/update.py

from fastapi import APIRouter, HTTPException
import sqlite3

router = APIRouter(
    prefix="/events",
    tags=["events"]
)

DB_PATH = "EventPlannerDB.db"

def get_db_connection():
    return sqlite3.connect(DB_PATH)


@router.put("/update/{event_id}")
def update_event(event_id: int, updater_id: int, updates: dict):
    """
    Allows the event creator or an admin to edit an event.
    - event_id: the ID of the event to update
    - updater_id: the ID of the account making the change
    - updates: dict of fields to update (e.g., {"eventName": "New Name"})
    """

    conn = get_db_connection()
    cur = conn.cursor()

    # Check if event exists
    cur.execute("SELECT creatorID FROM events WHERE eventID = ?", (event_id,))
    event = cur.fetchone()
    if not event:
        conn.close()
        raise HTTPException(status_code=404, detail="Event not found")
    creator_id = event[0]

    # Check if updater is allowed (creator or admin)
    cur.execute("SELECT accountType FROM accounts WHERE accountID = ?", (updater_id,))
    account = cur.fetchone()
    if not account:
        conn.close()
        raise HTTPException(status_code=403, detail="Updater account not found")

    account_type = account[0]
    if updater_id != creator_id and account_type != "Faculty":
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to edit this event")

    # Build dynamic SQL update string
    set_clause = ", ".join([f"{field} = ?" for field in updates.keys()])
    values = list(updates.values())
    values.append(event_id)

    sql = f"UPDATE events SET {set_clause} WHERE eventID = ?"
    cur.execute(sql, values)
    conn.commit()
    conn.close()

    return {"message": "Event updated successfully", "event_id": event_id, "updated_fields": updates}


