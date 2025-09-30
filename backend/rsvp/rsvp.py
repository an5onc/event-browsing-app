import sqlite3
from datetime import datetime

DB_NAME = "events.db"  # adjust to match the db


def get_connection():
    """Helper to connect to the SQLite database with foreign keys enabled."""
    conn = sqlite3.connect(DB_NAME)
    conn.execute("PRAGMA foreign_keys = ON;")  # enforce FK constraints
    return conn


def init_rsvp_table():
    """Create the RSVPs table if it doesn't exist."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS rsvps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                event_id INTEGER NOT NULL,
                status TEXT CHECK(status IN ('going', 'not_going')) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, event_id),
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
            );
        """)
        conn.commit()


def add_rsvp(user_id: int, event_id: int, status: str):
    """Insert a new RSVP if one doesn't already exist."""
    if status not in ("going", "not_going"):
        raise ValueError("Invalid RSVP status. Must be 'going' or 'not_going'.")

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO rsvps (user_id, event_id, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?);
        """, (user_id, event_id, status, datetime.now(), datetime.now()))
        conn.commit()


def update_rsvp(user_id: int, event_id: int, status: str):
    """Update an existing RSVP status."""
    if status not in ("going", "not_going"):
        raise ValueError("Invalid RSVP status. Must be 'going' or 'not_going'.")

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE rsvps
            SET status = ?, updated_at = ?
            WHERE user_id = ? AND event_id = ?;
        """, (status, datetime.now(), user_id, event_id))
        conn.commit()


def cancel_rsvp(user_id: int, event_id: int):
    """Cancel RSVP by deleting the row."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM rsvps WHERE user_id=? AND event_id=?;", (user_id, event_id))
        conn.commit()


def get_rsvp(user_id: int, event_id: int):
    """Get a single user's RSVP status for an event."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT status FROM rsvps WHERE user_id=? AND event_id=?;", (user_id, event_id))
        row = cursor.fetchone()
        return row[0] if row else None


def get_event_rsvps(event_id: int):
    """Get all RSVPs for an event (list of user_id, status)."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, status FROM rsvps WHERE event_id=?;", (event_id,))
        return cursor.fetchall()


def get_event_rsvp_counts(event_id: int):
    """Count 'going' and 'not_going' RSVPs for an event."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT status, COUNT(*) FROM rsvps
            WHERE event_id=?
            GROUP BY status;
        """, (event_id,))
        rows = cursor.fetchall()
        counts = {"going": 0, "not_going": 0}
        for status, count in rows:
            counts[status] = count
        return counts


# Quick test runner
if __name__ == "__main__":
    init_rsvp_table()
    print("RSVP table initialized.")

    # Demo data
    add_rsvp(1, 101, "going")
    add_rsvp(2, 101, "not_going")

    print("Event 101 RSVPs:", get_event_rsvps(101))
    print("Event 101 counts:", get_event_rsvp_counts(101))
    print("User 1 RSVP for Event 101:", get_rsvp(1, 101))

    update_rsvp(2, 101, "going")
    print("Updated Event 101 counts:", get_event_rsvp_counts(101))

    cancel_rsvp(1, 101)
    print("Event 101 RSVPs after cancel:", get_event_rsvps(101))


