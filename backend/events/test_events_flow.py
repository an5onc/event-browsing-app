"""
===================================================================
TEST SCRIPT: EVENTS FLOW (INTEGRATION TEST)

TO RUN IN VSCODE OR LOCALLY:
-------------------------------------------------------------------
1. Open a terminal in the project root (event-browsing-app/).
2. Reset the database (drops & recreates all tables):
       python backend/db/currentDB.py
        *** THIS STEP (step 2) WILL WIPE ALL EXISTING DATA IN THE DB FOR DEVELOPMENT PURPOSES ***
3. Run the script with module syntax:
       python -m backend.events.test_events_flow
4. The output will show each stage of the flow with section headers.

NOTE:
- This is an **integration test** (full system check).
- Each CRUD file also has its own local debug block for isolated testing.
- Frontend team can use this as a reference for expected backend behavior.
-------------------------------------------------------------------
This script demonstrates the full end-to-end flow of the backend:

1. Setup Accounts
   - Create multiple accounts (Student, Faculty, etc.)
   - Ensures accounts exist in DB before event creation

2. Create Events
   - Multiple events by different accounts
   - Shows each event’s stored fields

3. RSVP Tests
   - Users RSVP to each other’s events
   - Shows event → users mapping and user → events mapping
   - Cancels RSVPs to confirm deletion

4. Likes Tests
   - Users like events (cross-account)
   - Shows event → users mapping and user → events mapping
   - Removes likes to confirm deletion

5. Search Tests
   - Run searches by:
       • Title
       • Description keyword
       • Category
       • Date range
   - Confirms filtering and retrieval logic

6. Update Tests
   - Student updates their own event
   - Faculty overrides student’s event (admin power)
   - Confirms update logic & authorization

7. Delete Tests
   - Soft delete (mark Inactive) by event creator
   - Hard delete (remove permanently) by Faculty
   - Confirms cascading removal of related logs

8. Final DB State
   - Dumps all event, RSVP, and like tables
   - Shows the "true" database snapshot after all tests
===================================================================
"""

import os, sqlite3
from backend.events.create import create_event
from backend.events.read import read_events, read_event_by_id
from backend.events.update import update_event
from backend.events.soft_delete import soft_delete_event
from backend.events.hard_delete import hard_delete_event
from backend.rsvp.rsvp import add_rsvp, cancel_rsvp, get_event_rsvps, get_user_rsvps
from backend.liking_log.liking_log import add_like, remove_like, get_event_likes, get_user_likes
from backend.searching_logic.searching_logic import search_by_title, search_by_date, search_by_category, search_by_description

# -----------------------------
# DATABASE PATH
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "db", "EventPlannerDB.db")

def ensure_account(accountID: int, accountType: str, email: str, password_hash: bytes = b"x"):
    """
    Helper function: Insert account if not already present.
    Used for test setup only.
    """
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM accounts WHERE accountID = ?", (accountID,))
        if not cur.fetchone():
            cur.execute("""
                INSERT INTO accounts (accountID, accountType, email, password, isVerified)
                VALUES (?, ?, ?, ?, 1)
            """, (accountID, accountType, email, password_hash))
            conn.commit()

# ==============================================================
# MAIN TEST FLOW
# ==============================================================
if __name__ == "__main__":

    # -----------------------------
    # 1. Setup Accounts
    # -----------------------------
    print("\n=== Setup Accounts ===")
    ensure_account(1, "Student", "alice@unco.edu")
    ensure_account(2, "Student", "bob@unco.edu")
    ensure_account(3, "Student", "charlie@unco.edu")
    ensure_account(99, "Faculty", "prof@unco.edu")  # admin override

    # -----------------------------
    # 2. Create Events
    # -----------------------------
    print("\n=== Create Events ===")
    e1 = create_event(1, "Hackathon", "24hr coding event", "Library Lab", "Computer Science",
                      "2025-11-01 09:00:00", "2025-11-02 09:00:00")
    e2 = create_event(2, "Basketball Game", "UNC vs CSU", "Sports Arena", "Sports",
                      "2025-11-05 19:00:00", "2025-11-05 21:00:00")
    e3 = create_event(3, "Math Lecture", "Advanced Statistics Talk", "Ross Hall", "Math",
                      "2025-11-10 15:00:00", "2025-11-10 16:30:00")
    print("Events:", read_events())

    # -----------------------------
    # 3. RSVP Tests
    # -----------------------------
    print("\n=== RSVP Tests ===")
    add_rsvp(2, e1)  # Bob RSVPs Hackathon
    add_rsvp(1, e2)  # Alice RSVPs Basketball Game
    add_rsvp(1, e3)  # Alice RSVPs Math Lecture
    print("Hackathon RSVPs:", get_event_rsvps(e1))
    print("Alice RSVPs:", get_user_rsvps(1))
    cancel_rsvp(1, e2)
    print("Game RSVPs after cancel:", get_event_rsvps(e2))

    # -----------------------------
    # 4. Likes Tests
    # -----------------------------
    print("\n=== Likes Tests ===")
    add_like(2, e1); add_like(3, e1)  # Bob+Charlie like Hackathon
    add_like(1, e2)                   # Alice likes Game
    add_like(2, e3)                   # Bob likes Lecture
    add_like(99, e1)                  # Faculty likes Hackathon
    print("Hackathon Likes:", get_event_likes(e1))
    print("Prof Likes:", get_user_likes(99))
    remove_like(2, e1)
    print("Hackathon Likes after Bob removed:", get_event_likes(e1))

    # -----------------------------
    # 5. Search Tests
    # -----------------------------
    print("\n=== Search Tests ===")
    print("Title 'Hackathon':", search_by_title(read_events(), "Hackathon"))
    print("Description 'statistics':", search_by_description(read_events(), "statistics"))
    print("Category 'Sports':", search_by_category(read_events(), ["Sports"]))
    print("Date 2025-11-01 to 2025-11-07:",
          search_by_date(read_events(), "2025-11-01", "2025-11-07"))

    # -----------------------------
    # 6. Update Tests
    # -----------------------------
    print("\n=== Update Tests ===")
    update_event(e1, 1, {"location": "Ross 201"})  # Alice updates her Hackathon
    update_event(e1, 99, {"eventName": "Hackathon (Admin Edit)"})  # Faculty override
    print("Hackathon updated:", read_event_by_id(e1))

    # -----------------------------
    # 7. Delete Tests
    # -----------------------------
    print("\n=== Delete Tests ===")
    soft_delete_event(e1, 1)  # Alice soft deletes Hackathon
    hard_delete_event(e2, 99) # Faculty hard deletes Basketball Game
    print("Final events list:", read_events(include_inactive=True))

    # -----------------------------
    # 8. Final DB State
    # -----------------------------
    print("\n=== Final DB State ===")
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        print("\n--- events ---")
        for row in cur.execute("SELECT * FROM events"):
            print(dict(row))

        print("\n--- rsvpLog ---")
        for row in cur.execute("SELECT * FROM rsvpLog"):
            print(dict(row))

        print("\n--- likesLog ---")
        for row in cur.execute("SELECT * FROM likesLog"):
            print(dict(row))
