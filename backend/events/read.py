import sqlite3


## TODO
## FOR SEARCHING TEAM: Add function to get all events and sort by chronological order before returning
## FOR SEARCHING TEAM: Add function that returns all events with a given type


## TESTING PURPOSES ONLY ##
def create():
    ## TEMP
    import create

    create.create_event_2(
        creatorID=1,
        creatorType="Student",
        eventName="Sample Event",
        eventType="Workshops",
        eventDescription="This is a sample event description.",
        location="Sample Location",
        images=b'',
        eventAccess="Public",
        startDateTime="2024-10-01 10:00:00",
        endDateTime="2024-10-01 12:00:00",
        numberLikes=0,
        rsvpRequired=0,
        isPriced=0,
        cost=0.0,
    )

    create.create_event_2(
        creatorID=1,
        creatorType="Student",
        eventName="Coding Workshop",
        eventType="Workshops",
        eventDescription="Learn Python basics!",
        location="Room 101",
        images=None,  # You can pass raw bytes for images
        eventAccess="Inactive",
        startDateTime="2025-10-01 10:00:00",
        endDateTime="2025-10-01 12:00:00",
        numberLikes=0,
        rsvpRequired=1,
        isPriced=1,
        cost=20.0,
    )
    ## TEMP
## ^^^ TESTING PURPOSES ONLY ^^^ ##


# Open connection to the SQLite database
def get_db_connection():
    sqliteConnection = sqlite3.connect("EventPlannerDB.db")
    sqliteConnection.row_factory = sqlite3.Row  # Enable dictionary-like row access
    return sqliteConnection


# ----------------------------- READ EVENTS ----------------------------- #
# Function to read all events from the events table
def read_events():
    """
    Reads all event records from the events table.
    Returns a list of tuples, each representing an event record.
    """

    sqliteConnection = get_db_connection()

    # Get rows instead of tuples
    sqliteConnection.row_factory = sqlite3.Row

    cursor = sqliteConnection.cursor()

    # SQL query to select all records from the events table
    sql_command = "SELECT * FROM events"

    # Execute the query
    cursor.execute(sql_command)

    # Fetch all results from the executed query
    events = cursor.fetchall()

    sqliteConnection.close()

    # Convert sqlite3.Row objects to dictionaries for easier access
    return [dict(row) for row in events]


# Function to read a specific event by eventID
def read_event_by_id(event_id: int):
    """
    Reads a specific event record from the events table by eventID.
    Returns a tuple representing the event record, or None if not found.
    """

    sqliteConnection = get_db_connection()

    # Get rows instead of tuples
    sqliteConnection.row_factory = sqlite3.Row

    cursor = sqliteConnection.cursor()

    # SQL query to select a specific record from the events table by eventID
    sql_command = "SELECT * FROM events WHERE eventID = ?"

    # Execute the query with the provided event_id
    cursor.execute(sql_command, (event_id,))

    # Fetch the result from the executed query
    event = cursor.fetchone()

    # Check if event is active
    if event is None:
        print(f"No event found with eventID [{event_id}]")
        return None

    elif event["eventAccess"] == "Inactive": 
        print(f"Event with eventID [{event_id}] is Inactive.")
        return None

    sqliteConnection.close()

    return dict(event)


# Read creatorID by eventID
def read_event_creatorID(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["creatorID"]


# Read creatorType by eventID
def read_event_creatorType(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["creatorType"]


# Read eventName by eventID
def read_event_eventName(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["eventName"]


# Read eventDescription by eventID
def read_event_eventDescription(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["eventDescription"]


# Read location by eventID
def read_event_location(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["location"]


# Read images by eventID
def read_event_images(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["images"]


# Read eventType by eventID
def read_event_eventType(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["eventType"]


# Read eventAccess by eventID
def read_event_eventAccess(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["eventAccess"]


# Read startDateTime by eventID
def read_event_startDateTime(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["startDateTime"]


# Read endDateTime by eventID
def read_event_endDateTime(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["endDateTime"]


# Read numberLikes by eventID
def read_event_numberLikes(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["numberLikes"]


# Read rsvpRequired by eventID
def read_event_rsvpRequired(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["rsvpRequired"]


# Read isPriced by eventID
def read_event_isPriced(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["isPriced"]


# Read cost by eventID
def read_event_cost(event_id: int):
    event = read_event_by_id(event_id)
    if event is None:
        return None
    return event["cost"]


#create()

print(read_events())

print("\n-----")
print(read_event_by_id(1))
print(read_event_by_id(2))
print(read_event_by_id(999))  # Non-existent eventID
print("-----")

print("\n-----")
print(read_event_creatorID(1))
print(read_event_creatorType(1))
print(read_event_eventName(1))
print(read_event_eventDescription(1))
print(read_event_location(1))
print(read_event_images(1))
print(read_event_eventType(1))
print(read_event_eventAccess(1))
print(read_event_startDateTime(1))
print(read_event_endDateTime(1))
print(read_event_numberLikes(1))
print(read_event_rsvpRequired(1))
print(read_event_isPriced(1))
print(read_event_cost(1))
print("-----")

print("\n-----")
print(read_event_creatorID(2))
print(read_event_creatorType(2))
print(read_event_eventName(2))
# print(read_event_eventDescription(2))
# print(read_event_location(2))
# print(read_event_images(2))
# print(read_event_eventType(2))
# print(read_event_eventAccess(2))
# print(read_event_startDateTime(2))
# print(read_event_endDateTime(2))
# print(read_event_numberLikes(2))
# print(read_event_rsvpRequired(2))
# print(read_event_isPriced(2))
# print(read_event_cost(2))
print("-----")