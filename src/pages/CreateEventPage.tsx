import React from 'react';
import CreateEventForm from '../components/CreateEventForm';

/**
 * Page containing the form to create a new event.  The form
 * component encapsulates all of the state required for event
 * creation; this page simply provides a heading and container
 * structure around it.
 */
const CreateEventPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Create New Event</h1>
      <CreateEventForm />
    </div>
  );
};

export default CreateEventPage;