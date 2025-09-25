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
      <h1 className="text-3xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date &amp; Time</label>
          <input
            type="datetime-local"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.category}
            onChange={(e) => handleChange('category', e.target.value as Event['category'])}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Capacity (optional)</label>
          <input
            type="number"
            min="1"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.capacity ?? ''}
            onChange={(e) => handleChange('capacity', e.target.value === '' ? undefined : Number(e.target.value) as unknown as Event['capacity'])}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
          <input
            type="url"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={eventData.imageUrl ?? ''}
            onChange={(e) => handleChange('imageUrl', e.target.value || undefined)}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;