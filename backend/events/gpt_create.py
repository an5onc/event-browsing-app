import sqlite3


def create_event(
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
):
    """
    Inserts a new event into the events table.
    """

    sqliteConnection = sqlite3.connect("EventPlannerDB.db")
    cursor = sqliteConnection.cursor()

    # Convert Python lists to JSON strings if using lists instead of BLOBs
    listOfUsersRSVPd_blob = listOfUsersRSVPd
    listOfUsersLiked_blob = listOfUsersLiked

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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

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
        listOfUsersRSVPd_blob,
        numberOfLikes,
        listOfUsersLiked_blob,
    )

    try:
        cursor.execute(sql_command, values)
        sqliteConnection.commit()
        print("Event created successfully.")
    except sqlite3.IntegrityError as e:
        print(f"IntegrityError: {e}")
    except Exception as e:
        print(f"SQLite error: {e}")

    sqliteConnection.close()
