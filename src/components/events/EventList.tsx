import React from 'react';
import type { Event } from '../../types/event';
import EventCard from './EventCard';

type Props = { events: Event[]; onLike?: (id:string)=>void; onRSVP?: (id:string)=>void; onDelete?: (id:string)=>void; onEdit?: (id:string)=>void };
export default function EventList({ events, ...handlers }: Props) {
  if (!events.length) return <p className="text-sm text-gray-500">No events yet.</p>;
  return (
    <section className="grid gap-3">
      {events.map(ev => <EventCard key={ev.id} event={ev} {...handlers} />)}
    </section>
  );
}
