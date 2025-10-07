"""
=========================================================
SEARCHING LOGIC (in-memory search over events)
=========================================================

Purpose:
- Provides pure Python filtering functions for searching 
  events by title, description, category, or date range.

What Changed:
- Takes a list of event dicts (as returned by read_events).
- Uses datetime parsing for date comparisons.
- Does not query DB directly; runs on already-fetched data.

Frontend Use:
- Can be wired to search endpoints where frontend sends 
  filters and backend applies these helpers.

Note:
- This avoids SQL string concatenation and keeps the search 
  logic simple/testable in Python.
"""

from datetime import datetime

def search_by_title(events: list[dict], title_query: str) -> list[dict]:
    """Return events whose eventName contains the query (case-insensitive)."""
    return [e for e in events if title_query.lower() in e["eventName"].lower()]

def search_by_date(events: list[dict], start_date: str, end_date: str) -> list[dict]:
    """Return events within the start/end date range (inclusive)."""
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    return [e for e in events if start <= datetime.strptime(e["startDateTime"], "%Y-%m-%d %H:%M:%S") <= end]

def search_by_category(events: list[dict], categories: list[str]) -> list[dict]:
    """Return events that belong to any of the given categories."""
    return [e for e in events if e["eventType"] in categories]

def search_by_description(events: list[dict], keyword: str) -> list[dict]:
    """Return events where keyword is found in the description (case-insensitive)."""
    return [e for e in events if keyword.lower() in e.get("eventDescription", "").lower()]
