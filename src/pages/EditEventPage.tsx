import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';
import { Event } from '../types/Event';

// Reuse the same category list as the create form.  This avoids
// duplication and ensures consistency between pages.  In a more
// sophisticated app categories might come from the server or user
// configuration.
const categories = ['Social', 'Academic', 'Sports', 'Arts', 'Club', 'Other'];

/**
 * Page for editing an existing event.  It loads the current event
 * data into local state, allows the user to modify the fields and
 * persists the changes back to the EventsContext.  If the event
 * cannot be found (e.g. due to an invalid ID) a simple message is
 * shown.
 */
const EditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, updateEvent } = useEvents();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<Event | null>(null);

  useEffect(() => {
    const found = events.find((e) => e.id === id);
    if (found) setEventData(found);
  }, [id, events]);

  if (!eventData) {
    return <p className="text-center mt-8">Event not found.</p>;
  }

  const handleChange = <K extends keyof Event>(key: K, value: Event[K]) => {
    setEventData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvent(eventData);
    navigate(`/events/${eventData.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4 text-brand-blue">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-bluegrey">Title</label>
          <input
            type="text"
            className="mt-1 w-full px-3 py-2 border border-brand-bluegrey rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            value={eventData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-bluegrey">Description</label>
          <textarea
            className="mt-1 w-full px-3 py-2 border border-brand-bluegrey rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            value={eventData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-bluegrey">Date &amp; Time</label>
          <input
            type="datetime-local"
            className="mt-1 w-full px-3 py-2 border border-brand-bluegrey rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            value={eventData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-bluegrey">Location</label>
          <input
            type="text"
            className="mt-1 w-full px-3 py-2 border border-brand-bluegrey rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            value={eventData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-bluegrey">Category</label>
          <select
            className="mt-1 w-full px-3 py-2 border border-brand-bluegrey rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            value={eventData.categories}
            onChange={(e) => handleChange('categories', e.target.value as unknown as Event['categories'])}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-bluegrey">Capacity (optional)</label>
          <input
            type="number"
            min="1"
            className="mt-1 w-full px-3 py-2 border border-brand-bluegrey rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            value={eventData.capacity ?? ''}
            onChange={(e) => handleChange('capacity', e.target.value === '' ? undefined : Number(e.target.value) as unknown as Event['capacity'])}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-bluegrey">Image URL (optional)</label>
          <input
            type="url"
            className="mt-1 w-full px-3 py-2 border border-brand-bluegrey rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            value={eventData.imageUrl ?? ''}
            onChange={(e) => handleChange('imageUrl', e.target.value || undefined)}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-brand-gold text-brand-blue rounded-md hover:bg-brand-honeycomb"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;