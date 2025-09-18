import React from 'react';
import { EventsAPI } from '../../../src/lib/api';
import EventForm from '../../../src/components/events/EventForm';

export default function NewEventPage() {
  async function handleSubmit(payload: any) {
    await EventsAPI.create(payload);
    alert('Event created (stub).');
  }
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Create Event</h1>
      <EventForm onSubmit={handleSubmit} submitLabel="Create" />
    </div>
  );
}
