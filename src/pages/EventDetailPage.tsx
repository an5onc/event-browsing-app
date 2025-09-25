import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';

// Make plain URLs in text clickable
const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
function linkify(text: string): React.ReactNode[] {
  return text.split(URL_PATTERN).map((part, i) =>
    part.startsWith('http://') || part.startsWith('https://') ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 underline break-all"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

/**
 * Displays the full details for a single event.  Users can like,
 * RSVP, edit or delete the event from this page.  If the event is
 * not found (e.g. an invalid ID is entered) a simple message is
 * shown instead.
 */
const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, deleteEvent, toggleLike, toggleRsvp } = useEvents();

  const event = events.find((e) => e.id === id);

  if (!event) {
    return <p className="text-center mt-8">Event not found.</p>;
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(event.id);
      navigate('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        {new Date(event.startDate).toLocaleString()} • {event.location}
      </p>
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      <p className="mb-4 whitespace-pre-line">{linkify(event.description)}</p>
      <p className="mb-2">
        <strong>Category:</strong> {event.category}
      </p>
      {event.capacity && (
        <p className="mb-2">
          <strong>Capacity:</strong> {event.capacity}
        </p>
      )}
      {event.host && (
        <p className="mb-2">
          <strong>Host:</strong> {event.host}
        </p>
      )}
      {event.ticketUrl && (
        <a
          href={event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300/60 mb-2"
        >
          Buy tickets
        </a>
      )}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => toggleLike(event.id)}
          className={`px-3 py-1 rounded-full border flex items-center transition-colors ${event.userLiked ? 'bg-red-100 text-red-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          ❤️ {event.likes}
        </button>
        <button
          onClick={() => toggleRsvp(event.id)}
          className={`px-3 py-1 rounded-full border flex items-center transition-colors ${event.userRsvped ? 'bg-green-100 text-green-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          🎟️ {event.rsvps}
        </button>
        <button
          onClick={() => navigate(`/events/${event.id}/edit`)}
          className="px-3 py-1 rounded-full border bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 rounded-full border bg-red-100 text-red-600 hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EventDetailPage;