import React from 'react';
import type { Event } from '../../types/event';
import LikeButton from '../common/LikeButton';

type Props = { event: Event; onLike?: (id: string)=>void; onRSVP?: (id: string)=>void; onDelete?: (id: string)=>void; onEdit?: (id: string)=>void };
export default function EventCard({ event, onLike, onRSVP, onDelete, onEdit }: Props) {
  return (
    <article className="border rounded p-4 flex flex-col gap-2">
      <header className="flex justify-between">
        <h3 className="font-semibold">{event.title}</h3>
        <small>{new Date(event.startsAt).toLocaleString()}</small>
      </header>
      <div className="text-sm text-gray-600">{event.location} • {event.category} • {event.visibility}</div>
      {event.description && <p>{event.description}</p>}
      <div className="flex items-center gap-2">
        <LikeButton likes={event.likes} liked={!!event.likedByMe} onToggle={()=>onLike?.(event.id)} />
        <button className="px-3 py-1 rounded border" onClick={()=>onRSVP?.(event.id)}>RSVP {event.rsvpCount ? `(${event.rsvpCount})` : ''}</button>
        <div className="ms-auto flex gap-2">
          <button className="px-3 py-1 rounded border" onClick={()=>onEdit?.(event.id)}>Edit</button>
          <button className="px-3 py-1 rounded border text-red-600" onClick={()=>onDelete?.(event.id)}>Delete</button>
        </div>
      </div>
    </article>
  );
}
