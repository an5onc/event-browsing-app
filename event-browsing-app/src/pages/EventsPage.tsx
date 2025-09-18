import React from 'react';
import { EventsAPI } from '../../../src/lib/api';
import type { Event } from '../../../src/types/event';
import SearchBar from '../../../src/components/common/SearchBar';
import EventFilters from '../../../src/components/events/EventFilters';
import EventList from '../../../src/components/events/EventList';

export default function EventsPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [filters, setFilters] = React.useState<{q?:string; category?:string; from?:string; to?:string}>({});

  React.useEffect(() => { (async () => setEvents(await EventsAPI.list()))(); }, []);

  function onSearch(q: string) { setFilters((f)=>({ ...f, q })); }
  return (
    <div className="grid gap-4">
      <SearchBar onSearch={onSearch} />
      <EventFilters value={filters} onChange={setFilters} />
      <EventList events={events} />
    </div>
  );
}
