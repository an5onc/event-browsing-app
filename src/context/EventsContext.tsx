import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../types/Event';

// Define the shape of the context value.  Consumers can read the
// current events array and call mutating functions to add, update or
// remove events as well as toggle likes and RSVPs.  The context is
// intentionally decoupled from any particular back‑end; the
// implementation uses localStorage but could easily be replaced with
// real API calls.
interface EventsContextProps {
  events: Event[];
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

  // Persist events on every change.  Storing JSON in localStorage
  // ensures the app can be refreshed without losing data.  In a
  // production app these writes would be debounced and sent to a
  // server instead.
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

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
        const liked = e.userLiked ?? false;
        return {
          ...e,
          likes: liked ? e.likes - 1 : e.likes + 1,
          userLiked: !liked,
        };
      }),
    );
  };

  const toggleRsvp: EventsContextProps['toggleRsvp'] = (id) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const rsvped = e.userRsvped ?? false;
        return {
          ...e,
          rsvps: rsvped ? e.rsvps - 1 : e.rsvps + 1,
          userRsvped: !rsvped,
        };
      }),
    );
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, toggleLike, toggleRsvp }}>
      {children}
    </EventsContext.Provider>
  );
};