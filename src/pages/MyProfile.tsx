

import React from 'react';
import { useEvents } from '../context/EventsContext';
import EventItem from '../components/EventItem';

// Helper to test multiple possible user id fields safely
const collectUserIds = (user: any): string[] => {
  if (!user) return [];
  const ids = [user.id, user.bearId, user.username, user.email]
    .filter(Boolean)
    .map(String);
  return Array.from(new Set(ids));
};

const hasRsvpForUser = (ev: any, userIds: string[]) => {
  if (!Array.isArray(ev?.rsvps) || userIds.length === 0) return false;
  return ev.rsvps.map(String).some((id: string) => userIds.includes(id));
};

const isCreatedByUser = (ev: any, userIds: string[]) => {
  const creatorIds = [ev?.creatorId, ev?.createdBy, ev?.creator?.id]
    .filter(Boolean)
    .map(String);
  return creatorIds.some((id) => userIds.includes(id));
};

const Section: React.FC<{ title: string; events: any[] }> = ({ title, events }) => (
  <section className="max-w-5xl mx-auto mb-10">
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    {events.length === 0 ? (
      <p className="text-sm text-gray-500">None yet.</p>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <EventItem key={ev.id} event={ev} />
        ))}
      </div>
    )}
  </section>
);

const MyProfile: React.FC = () => {
  const { currentUser, events } = useEvents();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">My profile</h1>
        <p className="text-gray-600">Please sign in to view  your profile.</p>
      </div>
    );
  }

  const userIds = collectUserIds(currentUser);

  const createdEvents = events.filter((ev: any) => isCreatedByUser(ev, userIds));
  const rsvpedEvents = events
    .filter((ev: any) => hasRsvpForUser(ev, userIds))
    // avoid duplicates when the user both created and RSVP’d
    .filter((ev: any) => !isCreatedByUser(ev, userIds));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My profile</h1>
        <p className="text-gray-600 mt-1">
          {currentUser?.name || currentUser?.username || currentUser?.email}
        </p>
      </header>

      <Section title="Events I created" events={createdEvents} />
      <Section title="Events I RSVP’d to" events={rsvpedEvents} />
    </div>
  );
};

export default MyProfile;