import React, { useMemo, useState } from 'react';
import { useEvents } from '../context/EventsContext';
import SearchBar from '../components/SearchBar';
import EventFilters, { EventFiltersState } from '../components/EventFilters';
import EventList from '../components/EventList';
import { Link } from 'react-router-dom';

// Logos
import bearLogo from '../assets/images/bearlogo.png';
import bearLogoTransparent from '../assets/images/bearlogotransparent.png';

const initialFilters: EventFiltersState = {
  category: null,
  query: '',
  startDate: undefined,
  endDate: undefined,
  location: '',
  withinMiles: undefined,
  priceMin: undefined,
  priceMax: undefined,
  online: null,
  sort: 'soon',
};

const HomePage: React.FC = () => {
  const { events } = useEvents();
  const [filters, setFilters] = useState<EventFiltersState>(initialFilters);

  // Derived lists from filters
  const filteredEvents = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    const inDateRange = (d: string) => {
      if (!Date.parse(d)) return false;
      const dt = new Date(d);
      if (filters.startDate && dt < new Date(filters.startDate)) return false;
      if (filters.endDate && dt > new Date(filters.endDate + 'T23:59:59')) return false;
      return true;
    };

    const list = events
      .filter((e) =>
        (!filters.category || e.category === filters.category) &&
        (!q ||
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.location || '').toLowerCase().includes(q)) &&
        (!filters.startDate && !filters.endDate ? true : inDateRange(e.startDate))
      );

    list.sort((a, b) => {
      switch (filters.sort) {
        case 'new': {
          const aT = Date.parse((a.createdAt as string) || a.startDate);
          const bT = Date.parse((b.createdAt as string) || b.startDate);
          return bT - aT;
        }
        case 'popular': {
          const aP = (a.likes as number | undefined) ?? 0;
          const bP = (b.likes as number | undefined) ?? 0;
          return bP - aP;
        }
        case 'soon':
        default: {
          return Date.parse(a.startDate) - Date.parse(b.startDate);
        }
      }
    });

    return list;
  }, [events, filters]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.category && set.add(e.category));
    return Array.from(set);
  }, [events]);

  const stats = useMemo(() => {
    const total = events.length;
    const uniqueCategories = categories.length;
    const next = [...events]
      .filter((e) => Date.parse(e.startDate))
      .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))[0]?.startDate;
    const nextFmt = next ? new Date(next).toLocaleString() : '—';
    return { total, uniqueCategories, nextFmt };
  }, [events, categories]);

  return (
    <div className="min-h-screen bg-brand-light/20">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* soft gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-blue via-brand-blue to-brand-bluegrey/20" />
        {/* decorative logo watermark */}
        <img
          src={bearLogoTransparent}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 -z-10 h-[28rem] w-[28rem] opacity-10 blur-[1px]"
        />

        <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14 lg:pt-16">
          <div className="flex flex-col items-center text-center">
            <img src={bearLogo} alt="Bear logo" className="h-20 w-20 drop-shadow mb-5" />
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Browse Bear Events
            </h1>
            <div className="mt-2 h-1 w-24 rounded bg-brand-gold" />
            <p className="mt-3 max-w-2xl text-base text-brand-butter sm:text-lg">
              Find what’s happening on campus—talks, hackathons, clubs, sports, and more.
            </p>

            {/* quick stats */}
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-brand-gold/60 bg-white/95 px-4 py-3 text-sm shadow-md sm:gap-6 sm:px-6">
              <div className="text-brand-blue">
                <div className="font-semibold">{stats.total}</div>
                <div className="text-brand-smoke">Upcoming events</div>
              </div>
              <div className="text-brand-blue">
                <div className="font-semibold">{stats.uniqueCategories}</div>
                <div className="text-brand-smoke">Categories</div>
              </div>
              <div className="text-brand-blue">
                <div className="font-semibold">{stats.nextFmt}</div>
                <div className="text-brand-smoke">Next start</div>
              </div>
            </div>

            {/* search in hero -> controls filters.query */}
            <div className="mt-8 mb-4 w-full max-w-3xl rounded-2xl border border-brand-gold bg-white p-3 shadow-lg ring-1 ring-brand-gold/20">
              <SearchBar
                value={filters.query}
                onChange={(v: string) => setFilters((f) => ({ ...f, query: v }))
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-0 z-30 border-b-2 border-brand-gold bg-brand-blue/95 text-white backdrop-blur shadow">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-white/90">Filters</div>
            <div className="min-w-0 flex-1">
              <EventFilters
                categories={categories}
                value={filters}
                onChange={setFilters}
              />
            </div>
            <button
              onClick={() => setFilters(initialFilters)}
              className="ml-2 hidden shrink-0 rounded-lg border border-white/30 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 sm:block"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      <main id="events" className="mx-auto max-w-6xl px-4 py-6">
        {filteredEvents.length > 0 ? (
          <EventList events={filteredEvents} />
        ) : (
          <div className="mt-8 rounded-2xl border border-brand-light bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-indigo-50 p-2">
              <img src={bearLogo} alt="" className="h-full w-full object-contain" />
            </div>
            <h2 className="text-lg font-semibold text-brand-blue">No matching events</h2>
            <p className="mt-1 text-sm text-brand-bluegrey">
              Try adjusting your search or filters—or create the first event now.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
