import sqlite3

sqliteConnection = sqlite3.connect("EventPlannerDB.db")
cursor = sqliteConnection.cursor()

sql_command = """CREATE TABLE accounts (
BearID INTEGER PRIMARY KEY, 
username TEXT UNIQUE,
password TEXT, 
recoveryEmail TEXT,     
RSVPEvents BLOB,             
LikedEvents BLOB,
CreatedEvents BLOB
)"""
cursor.execute(sql_command)


sql_command = """CREATE TABLE RSVPed_Events (
EventID INTEGER,
FOREIGN KEY (EventID) REFERENCES events(eventID)
)"""
cursor.execute(sql_command)


sql_command = """CREATE TABLE events (
eventID INTEGER PRIMARY KEY,     
BearID INTEGER,
creatorType TEXT CHECK(creatorType IN ('Student','Faculty')),
eventName TEXT NOT NULL, 
eventDescription TEXT NOT NULL,         
images BLOB,                                      
eventType TEXT,    
eventAccess TEXT CHECK(eventAccess IN ('Public','Private')), 
startDateTime TEXT NOT NULL, 
endDateTime TEXT NOT NULL, 
listOfUsersRSVPd BLOB, 
numberOfLikes INTEGER,       
listOfUsersLiked BLOB,
FOREIGN KEY (BearID) REFERENCES accounts(BearID)
)"""
cursor.execute(sql_command)


sql_command = """CREATE TABLE Event_UsersRSVPed (
EventID INTEGER,
FOREIGN KEY (EventID) REFERENCES events(eventID)
)"""
cursor.execute(sql_command)


sqliteConnection.commit()
sqliteConnection.close()
