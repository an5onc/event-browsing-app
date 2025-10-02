import sqlite3

sqliteConnection = sqlite3.connect("EventPlannerDB.db")
cursor = sqliteConnection.cursor()

# NEED LOGIC FOR:
# Username is school appropriate
# recovery email
# location is a valid location
# location hasn't been reserved by someone else at the same time

# CONSIDERING:
# Location to be an enum for places on campus, vs a string, which allows for more specific placing.
#       Should location be as detailed as listing room when inside a building?

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

isVerified BOOLEAN DEFAULT 0,
verificationCode TEXT,
verificationExpiry DATETIME


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

rsvpRequired BOOLEAN DEFAULT 0,
isPriced BOOLEAN DEFAULT 0,
cost REAL,

FOREIGN KEY (creatorID) REFERENCES accounts(accountID),
FOREIGN KEY (creatorType) REFERENCES accounts(accountType)
);


CREATE TABLE rsvpLog (
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