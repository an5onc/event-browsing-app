#NEEDS TO ALIGN WITH CURRENT DATABASE
import sqlite3
from datetime import datetime

DB_NAME = "EventPlannerDB.db" 


def get_connection():
    """Helper function to connect to the SQLite database with foreign keys enabled."""
    conn = sqlite3.connect(DB_NAME)
    conn.execute("PRAGMA foreign_keys = ON;")  # enforce foreign key constraints
    return conn


def init_rsvp_table():
    """Create the RSVPed_Events table if it doesn't exist (aligned with schema)."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS RSVPed_Events (
                rsvpID INTEGER PRIMARY KEY AUTOINCREMENT,
                eventID INTEGER NOT NULL,
                creatorID INTEGER NOT NULL,
                userWhoRSVPID INTEGER NOT NULL,
                FOREIGN KEY (eventID) REFERENCES events(eventID) ON DELETE CASCADE,
                FOREIGN KEY (creatorID) REFERENCES events(creatorID) ON DELETE CASCADE,
                FOREIGN KEY (userWhoRSVPID) REFERENCES accounts(accountID) ON DELETE CASCADE
            );
        """)
        conn.commit()


def add_rsvp(user_id: int, event_id: int, creator_id: int):
    """Insert a new RSVP (no going/not_going column in your DB)."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO RSVPed_Events (eventID, creatorID, userWhoRSVPID)
            VALUES (?, ?, ?);
        """, (event_id, creator_id, user_id))
        conn.commit()


def cancel_rsvp(user_id: int, event_id: int):
    """Cancel RSVP by deleting the row."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM RSVPed_Events
            WHERE userWhoRSVPID=? AND eventID=?;
        """, (user_id, event_id))
        conn.commit()


def get_event_rsvps(event_id: int):
    """Get all RSVPs for an event (list of user IDs)."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT userWhoRSVPID FROM RSVPed_Events WHERE eventID=?;
        """, (event_id,))
        return [row[0] for row in cursor.fetchall()]


def get_user_rsvps(user_id: int):
    """Get all events a user RSVP’d to."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT eventID FROM RSVPed_Events WHERE userWhoRSVPID=?;
        """, (user_id,))
        return [row[0] for row in cursor.fetchall()]


# Quick test runner
if __name__ == "__main__":
    init_rsvp_table()
    print("RSVPed_Events table initialized.")

    # Demo data
    add_rsvp(1, 101, 50)  # user_id=1 RSVP'd to event 101 (creator_id=50)
    add_rsvp(2, 101, 50)

    print("Event 101 RSVPs:", get_event_rsvps(101))
    print("User 1 RSVPs:", get_user_rsvps(1))

    cancel_rsvp(1, 101)
    print("Event 101 RSVPs after cancel:", get_event_rsvps(101))

