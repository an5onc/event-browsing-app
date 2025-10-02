import React, { useState, FormEvent } from 'react';
import { useEvents } from '../context/EventsContext'; // Assuming context is set up
import { useNavigate } from 'react-router-dom';     // Assuming react-router-dom is used
import EventPreviewBanner from './EventPreviewBanner'; // <-- Import the new banner component


/**
 * A form component for creating a new event. It handles user input,
 * validation, and submission to the global events context.
 */
const CreateEventForm: React.FC = () => {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  // State for each form field
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [rsvpRequired, setRsvpRequired] = useState(false);
  const [capacity, setCapacity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the form submission process.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevent default browser refresh

    // --- Basic Validation ---
    if (!title || !description || !date || !location || !category) {
      setError('Please fill out all required fields.');
      return;
    }

    // --- Create New Event Object ---
    const newEvent = {
      id: Date.now().toString(), // Simple unique ID using timestamp
      title,
      description,
      startDate: date,
      location,
      category,
      rsvpRequired, // FIX: Added this to save the checkbox value
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      imageUrl: imageUrl || 'https://via.placeholder.com/300',
      likes: 0,
      rsvps: [],
    };

    // --- Add to Context and Navigate ---
    addEvent(newEvent); // Add the event to the shared context
    setError(null);

    // --- Optional: Navigate to the new event's detail page ---
    navigate(`/events/${newEvent.id}`);
  };

  return (
    <>
      {/* Live preview */}
      <EventPreviewBanner title={title} date={date} location={location} imageUrl={imageUrl} />

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-brand-light">
        {error && (
          <div className="text-brand-blue bg-brand-butter border border-brand-gold/60 p-3 rounded">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-brand-bluegrey">Event Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-brand-bluegrey rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-brand-bluegrey">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-brand-bluegrey rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
            rows={3}
            required
          />
        </div>

        {/* Date/time */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-brand-bluegrey">Date and Time</label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-brand-bluegrey rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-brand-bluegrey">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-brand-bluegrey rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
            required
          />
        </div>

        {/* RSVP checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rsvp"
            checked={rsvpRequired}
            onChange={(e) => setRsvpRequired(e.target.checked)}
            className="h-4 w-4 text-brand-gold focus:ring-brand-gold border-brand-bluegrey rounded"
          />
          <label htmlFor="rsvp" className="ml-2 block text-sm font-medium text-brand-bluegrey">RSVP Required?</label>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-brand-bluegrey">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-brand-bluegrey bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
            required
          >
            <option value="">Select a category</option>
            <option value="Music">Music</option>
            <option value="Tech">Tech</option>
            <option value="Art">Art</option>
            <option value="Sports">Sports</option>
            <option value="Food">Food</option>
          </select>
        </div>

        {/* Capacity (optional) */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-brand-bluegrey">Capacity (optional)</label>
          <input
            type="number"
            min={1}
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="e.g., 50"
            className="mt-1 block w-full px-3 py-2 border border-brand-bluegrey rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
          />
        </div>

        {/* Image URL (optional) */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-brand-bluegrey">Image URL (optional)</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/your-image.jpg"
            className="mt-1 block w-full px-3 py-2 border border-brand-bluegrey rounded-md shadow-sm focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-brand-gold text-brand-blue hover:bg-brand-honeycomb focus:outline-none focus:ring-2 focus:ring-brand-gold"
        >
          Create Event
        </button>
      </form>
    </>
  );
};

export default CreateEventForm;
