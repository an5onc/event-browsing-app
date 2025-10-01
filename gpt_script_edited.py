import sqlite3

sqliteConnection = sqlite3.connect("EventPlannerDB.db")
cursor = sqliteConnection.cursor()

# NEED LOGIC FOR:
# Username is school appropriate
# recovery email
# location is a valid location

# CONSIDERING:
# Location to be an enum for school buildings, vs a string.

sql_command = """
DROP DATABASE IF EXISTS EventPlannerDB;
CREATE DATABASE IF EXISTS EventPlannerDB;
USE EventPlannerDB;

CREATE TABLE accounts (
accountID INTEGER PRIMARY KEY, 
accountType TEXT CHECK(creatorType IN ('Student','Faculty')),
username TEXT UNIQUE,
password TEXT NOT NULL, 
recoveryEmail TEXT NOT NULL,
);


CREATE TABLE events (
eventID INTEGER PRIMARY KEY,
creatorID INTEGER,
creatorType TEXT CHECK(creatorType IN ('Student','Faculty')),
eventName TEXT NOT NULL,
eventType TEXT CHECK(eventType IN ("Art", "Math", "Science", "Computer Science", "History", "Education", "Political Science", "Software Engineering", "Business","Sports","Honors", "Workshops", "Study Session", "Dissertation", "Performance", "Competition")), 
eventDescription TEXT NOT NULL,
location TEXT NOT NULL,
images BLOB,
eventAccess TEXT CHECK(eventAccess IN ('Public','Private', 'Inactive')),

startDateTime TEXT NOT NULL,
endDateTime TEXT NOT NULL,
numberLikes INTEGER,

FOREIGN KEY (creatorID) REFERENCES accounts(accountID),
FOREIGN KEY (creatorType) REFERENCES accounts(accountType)
);


CREATE TABLE RSVPLog (
rsvpID INTEGER PRIMARY KEY,
eventID INTEGER NOT NULL,
creatorID INTEGER NOT NULL,
userWhoRSVPID INTEGER NOT NULL,

FOREIGN KEY (eventID) REFERENCES events(eventID),
FOREIGN KEY (creatorID) REFERENCES events(creatorID),
FOREIGN KEY (userWhoRSVPID) REFERENCES accounts(accountID)
);


CREATE TABLE inviteLog (
inviteID INTEGER PRIMARY KEY,
eventID INTEGER NOT NULL,
creatorID INTEGER NOT NULL,
invitedID INTEGER NOT NULL,

FOREIGN KEY (eventID) REFERENCES events(eventID),
FOREIGN KEY (creatorID) REFERENCES events(creatorID),
FOREIGN KEY (invitedID) REFERENCES accounts(accountID)
)
"""
cursor.execute(sql_command)

sqliteConnection.commit()
sqliteConnection.close()