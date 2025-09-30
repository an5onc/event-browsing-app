import sqlite3


## TODO
## Add function to get each individual column from events table by id
## Add function to get all events and sort by chronological order before returning


## TESTING PURPOSES ONLY ##
def create():
    ## TEMP
    import gpt_create

    gpt_create.create_event(
        BearID=1,
        creatorType="Student",
        eventName="Sample Event",
        eventDescription="This is a sample event description.",
        images=b'',
        eventType="Workshops",
        eventAccess="Public",
        startDateTime="2024-10-01 10:00:00",
        endDateTime="2024-10-01 12:00:00",
        listOfUsersRSVPd=b'',
        numberOfLikes=0,
        listOfUsersLiked=b'',
    )

    gpt_create.create_event(
        BearID=1,
        creatorType="Student",
        eventName="Coding Workshop",
        eventDescription="Learn Python basics!",
        images=None,  # You can pass raw bytes for images
        eventType="Workshops",
        eventAccess="Public",
        startDateTime="2025-10-01 10:00:00",
        endDateTime="2025-10-01 12:00:00",
        listOfUsersRSVPd=None,
        numberOfLikes=0,
        listOfUsersLiked=None,
    )
    ## TEMP
## ^^^ TESTING PURPOSES ONLY ^^^ ##

# Connect to the SQLite database
# If the file does not exist, it will be created automatically
sqliteConnection = sqlite3.connect("EventPlannerDB.db")

# Create cursor object to interact with the database
cursor = sqliteConnection.cursor()

# ----------------------------- READ EVENTS ----------------------------- #
# Function to read all events from the events table
def read_events():
    """
    Reads all event records from the events table.
    Returns a list of tuples, each representing an event record.
    """

    # SQL query to select all records from the events table
    sql_command = "SELECT * FROM events"

    # Execute the query
    cursor.execute(sql_command)

    # Fetch all results from the executed query
    events = cursor.fetchall()

    return events


def read_event_by_id(event_id: int):
    """
    Reads a specific event record from the events table by eventID.
    Returns a tuple representing the event record, or None if not found.
    """

    # SQL query to select a specific record from the events table by eventID
    sql_command = "SELECT * FROM events WHERE eventID = ?"

    # Execute the query with the provided event_id
    cursor.execute(sql_command, (event_id,))

    # Fetch the result from the executed query
    event = cursor.fetchone()

    # Check if event is active
    if event is None:
        print(f"No event found with eventID: {event_id}")
    elif event[7] == "Inactive":  # Assuming eventAccess is the 8th column (index 7)
        print(f"Event with eventID: {event_id} is Inactive.")
        return None

    return event


#create()
print(read_events())
print(read_event_by_id(3))
print(read_event_by_id(2))

sqliteConnection.close()