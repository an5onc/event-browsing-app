import React from 'react';
import type { Event } from '../../types/event';
import EventList from '../events/EventList';
type Props = { events: Event[]; onEdit?: (id:string)=>void; onDelete?: (id:string)=>void };
export default function MyEvents({ events, onEdit, onDelete }: Props) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">My RSVPs</h2>
      <EventList events={events} onEdit={onEdit} onDelete={onDelete} />
    </section>
  );
}
