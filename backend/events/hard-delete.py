import sqlite3
sqliteConnection = sqlite3.connect("EventPlannerDB.db")
cursor = sqliteConnection.cursor()

def hard_delete_event(eventID: int, creatorID: int):
    """
    Permanently deletes an event and its RSVPs (manual deletion).
    """

    try:
        cursor.execute("DELETE FROM RSVPed_Events WHERE eventID = ?",(eventID,)) # Deletes RSVPs 
        cursor.execute("DELETE FROM events WHERE eventID = ? AND creatorID = ?", (eventID, creatorID)) # Deletes event
        sqliteConnection.commit()

        if cursor.rowcount > 0:
            print(f"Event {eventID} and RSVPs permanently deleted.")
        else: 
            print("Event not found.")
    except Exception as e:
        print(f"SQLite error: {e}")

sqliteConnection.close()
