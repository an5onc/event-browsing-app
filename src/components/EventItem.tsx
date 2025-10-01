import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types/Event';
import { useEvents } from '../context/EventsContext';

const EventItem: React.FC<{ event: Event }> = ({ event }) => {
  const { toggleLike, toggleRsvp } = useEvents();
  const likesCount = Number((event as any).likes ?? 0);
  const rsvpsAny: unknown = (event as any).rsvps;
  const rsvpsCount = Array.isArray(rsvpsAny) ? rsvpsAny.length : Number(rsvpsAny ?? 0);
  const liked = Boolean((event as any).userLiked);
  const rsvped = Boolean((event as any).userRsvped);
  const start = (event as any).startDate && !isNaN(Date.parse((event as any).startDate))
    ? new Date((event as any).startDate).toLocaleString()
    : 'TBD';
  const location = (event as any).location || 'Location TBD';
  return (
    <div className="bg-white rounded-lg shadow-md border border-brand-light p-4 flex flex-col sm:flex-row gap-4">
      
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full sm:w-40 h-32 object-cover rounded-md"
        />
      )}

      <div className="flex-1">
        
        <Link to={`/events/${event.id}`}>
          <h2 className="text-xl font-semibold text-brand-blue hover:underline mb-1 break-words">
            {event.title}
          </h2>
        </Link>
                
        <p className="text-sm text-brand-bluegrey mb-2">
          {start} • {location}
        </p>

        <p className="text-sm text-brand-bluegrey mb-2">
          {event.category && (
            <span>
              <strong>category:</strong> {event.category}
            </span>
          )}
          {event.host && (
            <span className="ml-4">
              <strong>host:</strong> {event.host}
            </span>
          )}
        </p>
        
        <div className="flex flex-wrap gap-2 items-center mt-2">
          <button
            onClick={() => toggleLike(event.id)}
            className={`px-3 py-1 rounded-full border flex items-center transition-colors ${
              liked ? 'bg-red-100 text-red-600 border-red-200' : 'bg-white text-brand-bluegrey hover:bg-brand-light border-brand-light'
            }`}
            aria-label={liked ? 'Unlike event' : 'Like event'}
          >
            ❤️ {likesCount}
          </button>

          <button
            onClick={() => toggleRsvp(event.id)}
            className={`px-3 py-1 rounded-full border flex items-center transition-colors ${
              rsvped ? 'bg-green-100 text-green-600 border-green-200' : 'bg-white text-brand-bluegrey hover:bg-brand-light border-brand-light'
            }`}
            aria-label={rsvped ? 'Cancel RSVP' : 'RSVP to event'}
          >
            🎟️ {rsvpsCount}
          </button>

          <Link
            to={`/events/${event.id}`}
            className="text-sm text-brand-blue hover:underline ml-auto"
          >
            view details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventItem;