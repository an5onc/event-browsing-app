import sqlite3

DB_NAME = "EventPlannerDB.db"


def get_connection():
    """
    Opens a connection to the SQLite database with foreign keys enabled.
    Returns a connection object that can be used with context managers (with ... as ...).
    """
    conn = sqlite3.connect(DB_NAME)
    conn.execute("PRAGMA foreign_keys = ON;")  # Ensure FK constraints are enforced
    return conn


def init_rsvp_table():
    """
    Creates the rsvpLog table if it doesn’t already exist.
    This table links users (accounts) with events they RSVP to.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS rsvpLog (
                rsvpID INTEGER PRIMARY KEY,         
                eventID INTEGER NOT NULL,            
                creatorID INTEGER NOT NULL,          
                userWhoRSVPID INTEGER NOT NULL,      
                FOREIGN KEY (eventID) REFERENCES events(eventID) ON DELETE CASCADE,
                FOREIGN KEY (creatorID) REFERENCES events(creatorID) ON DELETE CASCADE,
                FOREIGN KEY (userWhoRSVPID) REFERENCES accounts(accountID) ON DELETE CASCADE,
                UNIQUE(eventID, userWhoRSVPID)       -- Prevent duplicate RSVPs per user/event
            );
        """)
        conn.commit()


def has_rsvp(user_id: int, event_id: int) -> bool:
    """
    Checks if a user has already RSVP'd to an event.
    - Returns True if RSVP exists, False otherwise.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 1 FROM rsvpLog
            WHERE userWhoRSVPID=? AND eventID=?
            LIMIT 1;
        """, (user_id, event_id))
        return cursor.fetchone() is not None


def add_rsvp(user_id: int, event_id: int, creator_id: int):
    """
    Adds a new RSVP entry for a user and event.
    Will not insert a duplicate RSVP.
    - user_id: ID of the account RSVP’ing
    - event_id: ID of the event they are RSVP’ing to
    - creator_id: ID of the account that created the event
    """
    if has_rsvp(user_id, event_id):
        print(f" User {user_id} has already RSVP'd to event {event_id}.")
        return

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO rsvpLog (eventID, creatorID, userWhoRSVPID)
            VALUES (?, ?, ?);
        """, (event_id, creator_id, user_id))
        conn.commit()


def cancel_rsvp(user_id: int, event_id: int):
    """
    Cancels an RSVP by removing the entry from rsvpLog.
    - Removes only the RSVP for the matching user and event.
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
    Retrieves a list of all user IDs who RSVP’d to a given event.
    - Returns: list of account IDs (integers)
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT userWhoRSVPID FROM rsvpLog WHERE eventID=?;
        """, (event_id,))
        return [row[0] for row in cursor.fetchall()]


def get_user_rsvps(user_id: int):
    """
    Retrieves a list of all events a user has RSVP’d to.
    - Returns: list of event IDs (integers)
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT eventID FROM rsvpLog WHERE userWhoRSVPID=?;
        """, (user_id,))
        return [row[0] for row in cursor.fetchall()]


# Debug run
if __name__ == "__main__":
    init_rsvp_table()
    print("✅ rsvpLog table initialized.")


    try:
        add_rsvp(1, 101, 50)  # user 1 RSVP’s to event 101 created by account 50
        add_rsvp(1, 101, 50)  # duplicate attempt (should be blocked)
        add_rsvp(2, 101, 50)
    except sqlite3.IntegrityError as e:
        print("Integrity Error (likely missing account/event rows):", e)

    print("Event 101 RSVPs:", get_event_rsvps(101))
    print("User 1 RSVPs:", get_user_rsvps(1))

    cancel_rsvp(1, 101)
    print("Event 101 RSVPs after cancel:", get_event_rsvps(101))

