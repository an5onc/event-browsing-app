/**
 * Type definitions for events handled by the application.  Each event
 * includes identifiers, metadata and optional properties to track
 * user interactions (likes and RSVPs).  Dates are stored as ISO
 * strings to simplify serialization in localStorage.  Additional
 * properties such as image URLs and host information can be added
 * freely without requiring back‑end changes.
 */
export interface Event {
  id: string;

  /** Human-friendly title. */
  title: string;
  /** Detailed description. */
  description: string;

  /** ISO start datetime. */
  startDate: string;
  /** Optional ISO end datetime. */
  endDate?: string;

  /** Free-form place text (building, room, URL, etc.). */
  location: string;
  /** Optional latitude/longitude if you support maps. */
  lat?: number;
  lng?: number;
  /** Optional computed distance in miles for “nearby” sort/filter. */
  distanceMi?: number;

  /** Category for grouping/filtering. */
  categories: string[];

  isPrivate?: boolean;
  invitedUserIds?: string[];
  rsvpRequired?: boolean;
  /** Online vs in-person filter. null/undefined = unknown/any. */
  online?: boolean | null;

  /** Ticket price for price filters. Omit or 0 for free. */
  price?: number;

  /** Optional capacity. */
  capacity?: number;

  /** Engagement metrics. */
  likes: number;
  rsvps: number | string[]; // Can be a count OR array of user IDs

  /** Per-user flags (deprecated - use likedBy/rsvpedBy arrays instead). */
  userLiked?: boolean;
  userRsvped?: boolean;

  /** Arrays of user IDs who interacted with this event */
  likedBy?: string[]; // Array of user IDs who liked this event
  rsvpedBy?: string[]; // Array of user IDs who RSVP'd to this event

  /** Event creator information */
  creatorId?: string;
  createdBy?: string;
  creator?: { id: string; name?: string };

  /** Timestamps. */
  createdAt: string;
  updatedAt: string;

  /** Image URL. */
  imageUrl?: string;

  /** Host name. */
  host?: string;

  /** Optional URL for tickets or more info. */
  ticketUrl?: string; 
}
