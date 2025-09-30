import sqlite3

# Connect to the SQLite database
# If the file does not exist, it will be created automatically
sqliteConnection = sqlite3.connect("EventPlannerDB.db")

# Create cursor object to interact with the database
cursor = sqliteConnection.cursor()

# ----------------------------- INSERT EVENT ----------------------------- #
# Function to insert a new event into the events table
def create_event(
    BearID: int,
    creatorType: str,
    eventName: str,
    eventDescription: str,
    images: bytes,
    eventType: str,
    eventAccess: str,
    startDateTime: str,
    endDateTime: str,
    listOfUsersRSVPd: bytes,
    numberOfLikes: int,
    listOfUsersLiked: bytes,
):
    """
    Inserts a new event record into the events table.
    Parameters must be passed in from the frontend (React).
    """

    # Use parameterized query (?) to prevent SQL injection
    sql_command = """
        INSERT INTO events (
            BearID,
            creatorType,
            eventName,
            eventDescription,
            images,
            eventType,
            eventAccess,
            startDateTime,
            endDateTime,
            listOfUsersRSVPd,
            numberOfLikes,
            listOfUsersLiked
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    # Values for the placeholders in the query
    values = (
        BearID,
        creatorType,
        eventName,
        eventDescription,
        images,
        eventType,
        eventAccess,
        startDateTime,
        endDateTime,
        listOfUsersRSVPd,
        numberOfLikes,
        listOfUsersLiked,
    )

    try:
        cursor.execute(sql_command, values)
        sqliteConnection.commit()
        print("Event created successfully.")
    except Exception as e:
        print(f"SQLite error while inserting event: {e}")

    sqliteConnection.close()


# Example usage (comment this out when React frontend calls it instead)
# create_event(
#     BearID=1,
#     creatorType="Student",
#     eventName="Coding Workshop",
#     eventDescription="Learn Python basics!",
#     images=None,  # You can pass raw bytes for images
#     eventType="Workshops",
#     eventAccess="Public",
#     startDateTime="2025-10-01 10:00:00",
#     endDateTime="2025-10-01 12:00:00",
#     listOfUsersRSVPd=None,
#     numberOfLikes=0,
#     listOfUsersLiked=None,
# )

# Close the connection when done
#sqliteConnection.close()

"""(the db_operations_products file is a previous project I worked on.
The other file is the script to make the database for my current project.
I now have to implement crud. This is for the backend team, and the crud is
going to be separated into a create file, update file, etc. I need this to
be able to work with the front end with react, and I would like to know how
to accomplish this with explanations and comments like how I formatted comments
in the db_operations_products file. I am only focused on the events part right
now, and the main point is for the user to be able to create, read, update, and
delete events. don't include the title information at the top. also make sure the
script is set up with the same formatting style as the db_creation_script file,
not the first file.)

Great, thanks for sharing both files. I see what you want:
Follow the style/formatting of your DB_Creation_Script.py (plain script, not class-based like db_operations_products.py).
Still include detailed inline comments like db_operations_products.py.
CRUD should be split into separate scripts (create, read, update, delete).
Only focused on events for now.
Must work as backend logic so your React frontend can call these endpoints later.
Here's how you can structure it. I'll start by showing you one file (for Create) in the same formatting style as your DB_Creation_Script, then I'll outline the other three.

Other CRUD Files
You'll make three more scripts the same way (copy the structure):

read_events.py
Fetch all events:
SELECT * FROM events ORDER BY eventID DESC

Fetch one event by ID:
SELECT * FROM events WHERE eventID = ?

update_event.py
Update event fields by eventID:
UPDATE events
SET eventName = ?, eventDescription = ?, eventType = ?, ...
WHERE eventID = ?

delete_event.py
Delete event by ID:
DELETE FROM events WHERE eventID = ?

Each file should:
Open the database connection at the top.
Use a function to handle the operation.
Use parameterized queries with ?.
Commit changes when necessary.
Close the connection at the end.

(This is the prompt I asked chatgpt and the result it gave me. The response includes the entire script so far)"""