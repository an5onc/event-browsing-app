import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../types/Event';

// Define the shape of the context value.  Consumers can read the
// current events array and call mutating functions to add, update or
// remove events as well as toggle likes and RSVPs.  The context is
// intentionally decoupled from any particular back‑end; the
// implementation uses localStorage but could easily be replaced with
// real API calls.

// Mock user interface for development/testing
export interface User {
  id: string;
  name?: string;
  username?: string;
  email: string;
  accountType?: string;
}

interface EventsContextProps {
  events: Event[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  addEvent: (event: Omit<Event, 'id' | 'likes' | 'rsvps' | 'userLiked' | 'userRsvped' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  toggleLike: (id: string) => void;
  toggleRsvp: (id: string) => void;
}

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

/**
 * Custom hook to access the events context.  Throws an error if used
 * outside of a provider to help developers catch configuration
 * mistakes early.
 */
export const useEvents = (): EventsContextProps => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

/**
 * Provider component responsible for maintaining and persisting the
 * application's event state.  Events are stored in localStorage to
 * survive page reloads without a back‑end.  The provider exposes
 * functions for common CRUD operations and for toggling likes and
 * RSVPs.  Whenever the events array changes it is serialized back
 * into localStorage.
 */
export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(() => {
    const stored = localStorage.getItem('events');
    return stored ? (JSON.parse(stored) as Event[]) : [];
  });

  // Mock user for development/testing - persisted in localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      return JSON.parse(stored) as User;
    }
    // Return a default mock user for development
    return {
      id: '12345',
      name: 'Test User',
      username: 'testuser',
      email: 'test@bears.unco.edu',
      accountType: 'Student'
    };
  });

  // Persist events on every change.  Storing JSON in localStorage
  // ensures the app can be refreshed without losing data.  In a
  // production app these writes would be debounced and sent to a
  // server instead.
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Persist current user changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const addEvent: EventsContextProps['addEvent'] = (data) => {
    const now = new Date().toISOString();
    setEvents((prev) => [
      ...prev,
      {
        id: uuidv4(),
        likes: 0,
        rsvps: 0,
        userLiked: false,
        userRsvped: false,
        createdAt: now,
        updatedAt: now,
        ...data,
      },
    ]);
  };

  const updateEvent: EventsContextProps['updateEvent'] = (updated) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? { ...e, ...updated, updatedAt: new Date().toISOString() } : e)),
    );
  };

  const deleteEvent: EventsContextProps['deleteEvent'] = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleLike: EventsContextProps['toggleLike'] = (id) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;

        // Get current user ID
        const userId = currentUser?.id;
        if (!userId) return e;

        // Initialize likedBy array if it doesn't exist
        const likedBy = e.likedBy || [];
        const hasLiked = likedBy.includes(userId);

        // Toggle user in likedBy array
        const newLikedBy = hasLiked
          ? likedBy.filter(uid => uid !== userId)
          : [...likedBy, userId];

        return {
          ...e,
          likedBy: newLikedBy,
          likes: newLikedBy.length,
          userLiked: !hasLiked, // Keep for backward compatibility
        };
      }),
    );
  };

  const toggleRsvp: EventsContextProps['toggleRsvp'] = (id) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;

        // Get current user ID
        const userId = currentUser?.id;
        if (!userId) return e;

        // Initialize rsvpedBy array if it doesn't exist
        const rsvpedBy = e.rsvpedBy || [];
        const hasRsvped = rsvpedBy.includes(userId);

        // Toggle user in rsvpedBy array
        const newRsvpedBy = hasRsvped
          ? rsvpedBy.filter(uid => uid !== userId)
          : [...rsvpedBy, userId];

        return {
          ...e,
          rsvpedBy: newRsvpedBy,
          rsvps: Array.isArray(e.rsvps) ? newRsvpedBy : newRsvpedBy.length,
          userRsvped: !hasRsvped, // Keep for backward compatibility
        };
      }),
    );
  };

  return (
    <EventsContext.Provider value={{ events, currentUser, setCurrentUser, addEvent, updateEvent, deleteEvent, toggleLike, toggleRsvp }}>
      {children}
    </EventsContext.Provider>
  );
};