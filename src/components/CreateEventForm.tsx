import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useEvents } from '../context/EventsContext';
import { useNavigate } from 'react-router-dom';
import EventPreviewBanner from './EventPreviewBanner';


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
  const [isPriceRequired, setIsPriceRequired] = useState(false);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState<string | null>(null);


  /**
   * Creates a temporary local URL for the selected image
   * to use in the live preview banner.
   */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // This creates a temporary URL that exists only in the browser
      setImageUrl(URL.createObjectURL(file));
    }
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();


    if (!title || !description || !date || !location || !category) {
      setError('Please fill out all required fields.');
      return;
    }


    const newEvent = {
      id: Date.now().toString(),
      title,
      description,
      startDate: date,
      location,
      category,
      rsvpRequired,
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      // In a real app, you would upload the file to a server here
      // and save the permanent URL. We're using the temporary local URL.
      imageUrl: imageUrl || 'https://via.placeholder.com/300',
      price,
      likes: 0,
      rsvps: [],
    };


    addEvent(newEvent);
    setError(null);
    navigate(`/events/${newEvent.id}`);
  };


  return (
    <>
      {/* --- LIVE PREVIEW BANNER --- */}
      <EventPreviewBanner
        title={title}
        date={date}
        location={location}
        imageUrl={imageUrl}
      />


      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}


        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>


        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" rows={3} required />
        </div>


        {/* Date and Time Input */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date and Time</label>
          <input type="datetime-local" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>


        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>


        {/* RSVP Required Checkbox */}
        <div className="flex items-center">
          <input type="checkbox" id="rsvp" checked={rsvpRequired} onChange={(e) => setRsvpRequired(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label htmlFor="rsvp" className="ml-2 block text-sm font-medium text-gray-700">RSVP Required?</label>
        </div>


        {/* IsPrice Required Checkbox */}
        <div className="flex items-center">
          <input type="checkbox" id="isPrice" checked={isPriceRequired} onChange={(e) => setIsPriceRequired(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label htmlFor="isPrice" className="ml-2 block text-sm font-medium text-gray-700">Is Price Required?</label>
        </div>




         {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number" // It's also good practice to change the input type to "number"
              id="price"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))} // Convert the string to a number
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
           />
          </div>
        {/* Category Select */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
            <option value="">Select a category</option>
            <option value="Social">Social</option>
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
            <option value="Arts">Arts</option>
            <option value="Club">Club</option>
            <option value="Other">Other</option>
          </select>
        </div>


        {/* --- OPTIONAL FIELDS --- */}
       
        {/* Banner Image Upload */}
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
          <input type="number" id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" min="1" />
        </div>


        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create Event
        </button>
      </form>
    </>
  );
};


export default CreateEventForm;



