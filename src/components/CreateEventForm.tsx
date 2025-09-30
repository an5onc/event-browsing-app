/*this form is used to create a new event, it is used in the component/CreateEvent.tsx file.
This page should display a form that lets a user create a new event by filling in details such as title,
description, date and time, location, category, and optional fields like capacity or image URL.
When the form is submitted, it should validate the inputs, generate a new event object with a unique ID
and default values (like zero likes and RSVPs), and then send that event to the shared context (useEvents)
so it becomes part of the app’s event list. After submission, the form should either reset or navigate the user
to the new event’s detail page.*/

/**
 * Purpose: Describe what this file does in one line.
 *
 * Common references:
 * - Actions (like/RSVP): src/context/EventsContext.tsx
 * - Buttons: src/components/LikeButton.tsx, src/components/RSVPButton.tsx
 * - Event card: src/components/EventItem.tsx
 * - Pages: src/pages/EventList.tsx, src/pages/EventDetail.tsx, src/pages/CreateEvent.tsx
 * - Filters: src/components/Filters.tsx, src/components/SearchBar.tsx
 * - Routing: src/App.tsx
 *
 * Hint: If you need like or RSVP functionality, import from EventsContext
 * and/or reuse LikeButton or RSVPButton components.
 */



//Ashtyn, this page is assigned to you.

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
      {/* --- LIVE PREVIEW BANNER --- */}
      {/* It receives the current form state and updates automatically! */}
      <EventPreviewBanner
        title={title}
        date={date}
        location={location}
        imageUrl={imageUrl}
      />

    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      {/* Title Input Required */}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          required
        />
      </div>

      {/* Date and Time Input */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date and Time
        </label>
        <input
          type="datetime-local"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {/* Location Input */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {/* RSVP Required Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="rsvp"
          checked={rsvpRequired}
          onChange={(e) => setRsvpRequired(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          // FIX: Removed 'required' attribute from the checkbox
        />
        <label htmlFor="rsvp" className="ml-2 block text-sm font-medium text-gray-700">
          RSVP Required?
        </label>
      </div>

      {/* Category Select */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
     
      {/* Optional fields... */}
      {/* ... (Capacity and Image URL inputs remain the same) ... */}
     
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Event
      </button>
    </form>
     </>
  );
};

export default CreateEventForm;




