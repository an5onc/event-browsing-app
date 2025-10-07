import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';
import { Event } from '../types/Event';
import EventPreviewBanner from '../components/EventPreviewBanner';

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
  const [error, setError] = useState<string | null>(null);

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => { // ✅ FIXED (typed event)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const tempUrl = URL.createObjectURL(file);
      handleChange('imageUrl', tempUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvent(eventData);
    navigate(`/events/${eventData.id}`);
  };

  return (
    <section className="bg-gradient-to-b from-brand-blue via-brand-blue to-brand-bluegrey/10 pt-16 pb-12 min-h-screen">
      <div className="mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-lg border border-brand-light shadow-md">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-brand-blue">Edit Event</h1>

            {/*--Preview Banner--*/}
            <EventPreviewBanner
              title={eventData.title}
              date={eventData.startDate}
              location={eventData.location}
              imageUrl={eventData.imageUrl || ''}
            />
    
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

              {/*Title Edit*/}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  id="title"
                  value={eventData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/*Description Edit*/}

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={eventData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                  rows={3}
                  required
                />
              </div>
              {/*Date and Time Edit*/}
              <div>
                <label htmlFor="date"className="block text-sm font-medium text-gray-700">Date and Time</label>
                <input
                  type="datetime-local"
                  id="date"
                  value={eventData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Location Edit */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  value={eventData.location} 
                  onChange={(e) => handleChange('location', e.target.value)} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                  required 
                />
              </div>

              {/* RSVP Required Checkbox */}
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="rsvp" 
                  checked={(eventData as any).rsvpRequired ?? false} 
                  onChange={(e) => handleChange('rsvpRequired' as keyof Event, e.target.checked as any)} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="rsvp" className="ml-2 block text-sm font-medium text-gray-700">RSVP Required?</label>
              </div>
              {/* IsPrice Required Checkbox */}
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="isPrice" 
                  checked={(eventData as any).isPriceRequired ?? false} 
                  onChange={(e) => handleChange('isPriceRequired' as keyof Event, e.target.checked as any)} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                />
                <label htmlFor="isPrice" className="ml-2 block text-sm font-medium text-gray-700">Is Price Required?</label>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  id="price"
                  value={eventData.price ?? 0}
                  onChange={(e) => handleChange('price', parseInt(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>


              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                id="category"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                  value={eventData.category}
                  onChange={(e) => handleChange('category', e.target.value as Event['category'])}
                >
                  <option value="">Select a category</option>
                  <option value="Social">Social</option>
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts">Arts</option>
                  <option value="Club">Club</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/*Image Upload*/}
              <div>
                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">Banner Image (Optional)</label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                   />
              </div>
              {/* Capacity Input */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity (Optional)</label>
                <input 
                  type="number" 
                  id="capacity" 
                  value={eventData.capacity ?? ''} 
                  onChange={(e) => handleChange('capacity', e.target.value === '' ? undefined : Number(e.target.value))} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                  min="1" 
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
            Save Changes
          </button>
        </form>
      </div>
    </div>
    </div>
  </section>
);
};

export default EditEventPage;