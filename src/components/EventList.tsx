/* Renders a responsive grid of EventItem cards. Updates automatically when the
   events array changes. Shows a friendly empty state when no events exist. */

import React from 'react';
import EventItem from './EventItem';
import { Event } from '../types/Event';
import { Link } from 'react-router-dom';

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand-light flex items-center justify-center">
          <span className="text-brand-blue text-lg">🗓️</span>
        </div>
        <p className="text-lg text-brand-bluegrey mb-3">No events found.</p>
        <Link
          to="/create"
          className="inline-block rounded-lg border border-brand-gold bg-brand-gold px-4 py-2 text-sm font-medium text-brand-blue hover:bg-brand-honeycomb"
        >
          Create the first event
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;