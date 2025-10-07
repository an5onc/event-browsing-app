import sqlite3
import os

"""
=========================================================
DATABASE CREATION SCRIPT (EventPlannerDB.db)
=========================================================

Purpose:
- Creates the SQLite database schema for the event browsing app.
- Defines all core tables: accounts, events, eventCategories, rsvpLog, likesLog, inviteLog.
- Drops and recreates tables on each run (for clean dev/test cycles).
- Provides a consistent structure for backend CRUD modules to use.

What Changed:
- Added stricter constraints:
  - accountType limited to 'Student' or 'Faculty'.
  - eventType limited to pre-approved set (Art, Math, Sports, etc.).
  - eventAccess limited to 'Public', 'Private', or 'Inactive'.
- Foreign keys link accounts to events and logs.
- RSVP, likes, and invite logs implemented as join tables.
- Number of likes stored directly in `events` (denormalized for faster access).
- Extended comments and dev notes for clarity.
- Built-in DROP statements for dev convenience (remove/comment in production).

Frontend Use:
- This file is not called directly by the frontend.
- Used during setup/reset to prepare a clean database for testing.
- Must be run before backend CRUD functions or integration tests.
- Frontend depends on the schema defined here: 
  - Accounts handle login/verification.
  - Events populate listings and detail pages.
  - RSVP and Likes drive interactive features.
"""

# Ensures database file is put in the same folder as this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "EventPlannerDB.db")


sqliteConnection = sqlite3.connect(DB_PATH)
cursor = sqliteConnection.cursor()

# Drop old tables if they exist (for clean re-runs during development, running this will create a "fresh" database for testing, delete or comment in production)
cursor.execute("DROP TABLE IF EXISTS likesLog;")
cursor.execute("DROP TABLE IF EXISTS rsvpLog;")
cursor.execute("DROP TABLE IF EXISTS inviteLog;")
cursor.execute("DROP TABLE IF EXISTS eventCategories;")
cursor.execute("DROP TABLE IF EXISTS events;")
cursor.execute("DROP TABLE IF EXISTS accounts;")

sql_command = """

-- =============================
-- ACCOUNTS TABLE
-- Stores user login data and verification codes
-- =============================
CREATE TABLE accounts (
    accountID INTEGER PRIMARY KEY,
    accountType TEXT CHECK(accountType IN ('Student','Faculty')),
    email TEXT UNIQUE NOT NULL,  -- acts as username
    password TEXT NOT NULL,
    isVerified BOOLEAN DEFAULT 0,
    verificationCode TEXT,
    verificationExpiry DATETIME
);


-- =============================
-- EVENTS TABLE
-- Stores all event details
-- =============================
CREATE TABLE events (
    eventID INTEGER NOT NULL PRIMARY KEY,
    creatorID INTEGER NOT NULL,
    eventName TEXT NOT NULL,
    eventType TEXT CHECK(eventType IN (
        "Art", "Math", "Science", "Computer Science", "History", 
        "Education", "Political Science", "Software Engineering", 
        "Business", "Sports", "Honors", "Workshops", 
        "Study Session", "Dissertation", "Performance", "Competition"
    )), 
    eventDescription TEXT NOT NULL,
    location TEXT NOT NULL, 
    images BLOB,
    eventAccess TEXT CHECK(eventAccess IN ('Public','Private','Inactive')),

    startDateTime TEXT NOT NULL,  -- must use ISO format: YYYY-MM-DD HH:MM:SS
    endDateTime TEXT NOT NULL,
    numberLikes INTEGER DEFAULT 0,

    rsvpRequired BOOLEAN DEFAULT 0,
    isPriced BOOLEAN DEFAULT 0,
    cost REAL,

    FOREIGN KEY (creatorID) REFERENCES accounts(accountID)
);

-- =============================
-- EVENT CATEGORIES JOIN TABLE
-- Allows multiple categories per event
-- =============================
CREATE TABLE eventCategories (
    eventID INTEGER NOT NULL,
    category TEXT NOT NULL,
    PRIMARY KEY (eventID, category),
    FOREIGN KEY (eventID) REFERENCES events(eventID)
);

-- =============================
-- RSVP LOG
-- Tracks which users RSVPed to which events
-- =============================
CREATE TABLE rsvpLog (
    eventID INTEGER NOT NULL,
    accountID INTEGER NOT NULL,
    PRIMARY KEY (eventID, accountID),
    FOREIGN KEY (eventID) REFERENCES events(eventID),
    FOREIGN KEY (accountID) REFERENCES accounts(accountID)
);

-- =============================
-- LIKES LOG
-- Tracks which users liked which events
-- =============================
CREATE TABLE likesLog (
    eventID INTEGER NOT NULL,
    accountID INTEGER NOT NULL,
    PRIMARY KEY (eventID, accountID),
    FOREIGN KEY (eventID) REFERENCES events(eventID),
    FOREIGN KEY (accountID) REFERENCES accounts(accountID)
);

-- =============================
-- INVITE LOG
-- Tracks invitations (which user was invited to which event)
-- =============================
CREATE TABLE inviteLog (
    eventID INTEGER NOT NULL,
    accountID INTEGER NOT NULL,
    PRIMARY KEY (eventID, accountID),
    FOREIGN KEY (eventID) REFERENCES events(eventID),
    FOREIGN KEY (accountID) REFERENCES accounts(accountID)
);
"""

cursor.executescript(sql_command)

sqliteConnection.commit()
sqliteConnection.close()

print("Database and tables created successfully!") # To delete once we are in production
