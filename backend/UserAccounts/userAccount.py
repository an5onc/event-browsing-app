import sqlite3      # sql injection software
import re           # regex for email verification
import bcrypt       # encryption for password hash / secure login


sqliteConnection = sqlite3.connect('EventPlannerDB.db')
cursor = sqliteConnection.cursor()

# NEED TO ASK HOW MUCH OF THIS LOGIC IS ALREADY GOING TO BE HANDLED BY THE FRONT END
class userAccount:
    def __init__(self, BearID, username, userPass, email):
        
        #username = verifyUsernameUnique(user)
        

        password = userPass
        # add password to DB
        

        #VERIFY EMAIL IS REAL
        recoveryEmail = self.verifyEmailValid(email)



        sql_command = """
        INSERT INTO accounts VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        # last three are RSVPd events, Liked Events, and created events respectively 
        # All are empty on account creation

        cursor.execute(sql_command, (BearID, username, password, recoveryEmail, None, None, None))
        sqliteConnection.commit()

    def getAccountsBearID(self):
        # WHEN FINISHED, NEED TO UPDATE ALL PLACES WHERE IT IS CALLED, 
        # PROBABLY NEED TO ASK FRONT END 
        # HOW WE WILL KNOW THE ARE CONNECTED TO SERVER / USER IS LOGGED IN

        return


    def verifyUsernameUnique(self, username):
        # VERIFY USERNAME IS UNIQUE
        # user inputs their email
        # call to database to check uniqueness
        # while loop until they submit a valid one


        #?? need while loop to give any number of attempts to input a valid


        
        return
    
    def verifyEmailValid(self, email):
        #while loop until they submit a valid email

        #OPTION A) run through a regex to that it has a valid format for a unco email
        



        #OPTION B) send a verification email (dont think this is feasible, I think this needs a server to recieve the verification, and idk how to)

        pass

    def changePass(self, newPass):
        #assuming that it has already been verified that this is a valid password change attempt
        userID = self.getAccountsBearID()

        sql_command = """
        UPDATE accounts
        SET password = ?
        WHERE BearID = ?;
        """

        cursor.execute(sql_command, (newPass, userID))
        sqliteConnection.commit()

    def changeEmail(self, newEmail):
        email = self.verifyEmailValid(newEmail)
        userID = self.getAccountsBearID()

        sql_command = """
        UPDATE accounts
        SET recoveryEmail = ?
        WHERE BearID = ?;
        """

        cursor.execute(sql_command, (email, userID))
        sqliteConnection.commit()


    def getEncryptedPassHash(self, inputBearID):
        #used when logging in, to check user input password attempt against the stored password
        sql_command = """
        SELECT password
        FROM accounts
        WHERE BearID = ?;
        """

        cursor.execute(sql_command, (inputBearID,))
        result = cursor.fetchall()
        if not result:
            return None
        password = result[0][0]

        salt = bcrypt.gensalt()

        #hashed = bcrypt.hashpw(password, salt)
        return bcrypt.hashpw(password, salt)
        

    def attemptingLogin(self, inputName, inputPass):
        #for loop, only given three tries to submit a valid password
        #IS THIS MY JOB??
        sql_command = """
        SELECT BearID
        FROM accounts
        WHERE username = ?;
        """
        cursor.execute(sql_command, (inputName,))
        result = cursor.fetchall()
        if not result:
            return None
        BearID = result[0][0]

        hashedPass = self.getEncryptedPassHash(BearID)

        #NOT FINISHED, UNSURE IF I CAN SPLIT THIS INTO TWO METHODS. 
        #MAY NEED TO EITHER PASS IN THE SALT, OR COMBINE WITH getPassHash

        return #WTF DO I RETURN

    def deleteAccount(self):
        pass