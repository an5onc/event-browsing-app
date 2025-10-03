import sqlite3
from datetime import datetime

DB_NAME = "EventPlannerDB.db"

def get_connection():
    """
    Helper function to connect to the SQLite database with foreign key constraints enabled.
    - Returns a connection object that can be used with 'with' blocks.
    """
    conn = sqlite3.connect(DB_NAME)
    conn.execute("PRAGMA foreign_keys = ON;")  # enforce FK constraints
    return conn


def init_rsvp_table():
    """
    Creates the rsvpLog table if it doesn’t exist.
    - Matches the schema defined in your database setup file.
    - Stores RSVP records, linking users (accounts) to events.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS rsvpLog (
                rsvpID INTEGER PRIMARY KEY,              
                eventID INTEGER NOT NULL,                
                creatorID INTEGER NOT NULL,              
                userWhoRSVPID INTEGER NOT NULL,          
                -- Foreign key links to maintain integrity
                FOREIGN KEY (eventID) REFERENCES events(eventID) ON DELETE CASCADE,
                FOREIGN KEY (creatorID) REFERENCES events(creatorID) ON DELETE CASCADE,
                FOREIGN KEY (userWhoRSVPID) REFERENCES accounts(accountID) ON DELETE CASCADE
            );
        """)
        conn.commit()


def add_rsvp(user_id: int, event_id: int, creator_id: int):
    """
    Inserts a new RSVP into rsvpLog.
    - user_id: the account ID of the person RSVP’ing
    - event_id: the event they are RSVP’ing to
    - creator_id: the account ID of the event creator
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO rsvpLog (eventID, creatorID, userWhoRSVPID)
            VALUES (?, ?, ?);
        """, (event_id, creator_id, user_id))
        conn.commit()


def cancel_rsvp(user_id: int, event_id: int):
    """
    Cancels an RSVP by deleting the row from rsvpLog.
    - Finds the RSVP by matching both user ID and event ID.
    - Deletes only that specific RSVP.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM rsvpLog
            WHERE userWhoRSVPID=? AND eventID=?;
        """, (user_id, event_id))
        conn.commit()


def get_event_rsvps(event_id: int):
    """
    Retrieves all user IDs who RSVP’d to a given event.
    - Returns a list of user account IDs.
    Example: [1, 2, 3] means users 1, 2, and 3 RSVP’d to this event.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT userWhoRSVPID FROM rsvpLog WHERE eventID=?;
        """, (event_id,))
        return [row[0] for row in cursor.fetchall()]  


def get_user_rsvps(user_id: int):
    """
    Retrieves all event IDs a given user has RSVP’d to.
    - Returns a list of event IDs.
    Example: [101, 102] means this user RSVP’d to event 101 and 102.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT eventID FROM rsvpLog WHERE userWhoRSVPID=?;
        """, (user_id,))
        return [row[0] for row in cursor.fetchall()] 


# Quick debug test
if __name__ == "__main__":
    init_rsvp_table()  # make sure rsvpLog exists
    print("rsvpLog table initialized.")

    try:
        add_rsvp(1, 101, 50)  # user 1 RSVP’d to event 101 (created by user 50)
        add_rsvp(2, 101, 50)
    except sqlite3.IntegrityError as e:
        print("Error (likely missing account/event rows):", e)

    # Show RSVPs for event 101
    print("Event 101 RSVPs:", get_event_rsvps(101))

    # Show events that user 1 RSVP’d to
    print("User 1 RSVPs:", get_user_rsvps(1))

    # Cancel user 1’s RSVP to event 101
    cancel_rsvp(1, 101)
    print("Event 101 RSVPs after cancel:", get_event_rsvps(101))
