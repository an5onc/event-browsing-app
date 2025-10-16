"""
=========================================================
USER ACCOUNT MANAGEMENT (accounts table)
=========================================================

Purpose:
- Handles account creation, login, verification, and deletion.
- Includes security features:
  - bcrypt password hashing
  - verification codes (6-digit, expiring in 15 min)
  - email domain validation for Student vs Faculty.

What Changed:
- Removed placeholder code and raw SQL f-strings.
- Secure password hashing + verification added.
- Email checks via regex (bears.unco.edu for students, unco.edu for faculty).
- Added account verification flow (generate code, validate, mark verified).
- Added login with bcrypt check + verification status.
- Added delete_account helper.

Frontend Use:
- Register screen → create_account()
- Login screen → login()
- Email verification screen → verify_code()
- Account settings → delete_account()
"""

import sqlite3
import re
import bcrypt
import random
from datetime import datetime, timedelta

# Path to SQLite DB
import os
# Get the directory where this file is located
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# Go up one level to backend, then into db
DB_PATH = os.path.join(os.path.dirname(CURRENT_DIR), "db", "EventPlannerDB.db")

class userAccount:
    # ===========================================================
    # Account Creation
    # ===========================================================
    def create_account(self, accountID, accountType, password, email):
        """
        Create a new account:
        - Validates email domain by accountType.
        - Hashes password with bcrypt.
        - Generates verification code + expiry.
        - Inserts into accounts table.
        Returns: verification code (string).
        """
        if accountType == "Student" and not re.match(r".+@bears\.unco\.edu$", email):
            raise ValueError("Students must use a bears.unco.edu email")
        if accountType == "Faculty" and not re.match(r".+@unco\.edu$", email):
            raise ValueError("Faculty must use a unco.edu email")

        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        code = str(random.randint(100000, 999999))
        expiry = (datetime.now() + timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S")

        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO accounts (accountID, accountType, email, password, isVerified, verificationCode, verificationExpiry)
                VALUES (?, ?, ?, ?, 0, ?, ?)
            """, (accountID, accountType, email, hashed, code, expiry))
            conn.commit()
        return code

    # ===========================================================
    # Login
    # ===========================================================
    def login(self, email, inputPass):
        """
        Attempt login with email + password.
        - Verifies bcrypt hash.
        - Fails if not verified yet.
        Returns: (True, accountID) or (False, reason).
        """
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("SELECT accountID, password, isVerified FROM accounts WHERE email = ?", (email,))
            row = cur.fetchone()

        if row is None:
            return False, "No such account"

        accountID, storedHash, isVerified = row
        if bcrypt.checkpw(inputPass.encode("utf-8"), storedHash):
            if not isVerified:
                return False, "Account not verified"
            return True, accountID
        return False, "Incorrect password"

    # ===========================================================
    # Verify Code
    # ===========================================================
    def verify_code(self, accountID, codeInput):
        """
        Verify an account using the 6-digit code.
        - Fails if code expired, invalid, or account missing.
        - On success: marks account as verified in DB.
        """
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("""
                SELECT verificationCode, verificationExpiry
                FROM accounts
                WHERE accountID = ?
            """, (accountID,))
            row = cur.fetchone()

        if not row:
            return False, "Account not found"

        dbCode, expiry = row
        if datetime.now() > datetime.strptime(expiry, "%Y-%m-%d %H:%M:%S"):
            return False, "Code expired"
        if dbCode != codeInput:
            return False, "Invalid code"

        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("""
                UPDATE accounts
                SET isVerified = 1, verificationCode = NULL, verificationExpiry = NULL
                WHERE accountID = ?
            """, (accountID,))
            conn.commit()
        return True, "Verified successfully"

    # ===========================================================
    # Delete Account
    # ===========================================================
    def delete_account(self, accountID):
        """Permanently delete account from DB (careful: no undo)."""
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("DELETE FROM accounts WHERE accountID = ?", (accountID,))
            conn.commit()

    # ===========================================================
    # Get User Info by Account ID
    # ===========================================================
    def get_user_by_id(self, accountID):
        """
        Get user information by accountID.
        Returns: dict with user info or None if not found
        """
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("""
                SELECT accountID, accountType, email, isVerified
                FROM accounts
                WHERE accountID = ?
            """, (accountID,))
            row = cur.fetchone()

        if row:
            return dict(row)
        return None

    # ===========================================================
    # Update Password
    # ===========================================================
    def update_password(self, accountID, current_password, new_password):
        """
        Update user password:
        - Verifies current password
        - Hashes new password with bcrypt
        - Updates database
        Returns: (True, "Success message") or (False, "Error message")
        """
        # First, get user's email to verify current password
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("SELECT email, password FROM accounts WHERE accountID = ?", (accountID,))
            row = cur.fetchone()

        if not row:
            return False, "Account not found"

        email, stored_hash = row

        # Verify current password
        if not bcrypt.checkpw(current_password.encode("utf-8"), stored_hash):
            return False, "Current password is incorrect"

        # Hash new password
        new_hashed = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())

        # Update password in database
        with sqlite3.connect(DB_PATH) as conn:
            cur = conn.cursor()
            cur.execute("""
                UPDATE accounts
                SET password = ?
                WHERE accountID = ?
            """, (new_hashed, accountID))
            conn.commit()

        return True, "Password updated successfully"
