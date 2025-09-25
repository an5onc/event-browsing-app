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
        (!filters.startDate && !filters.endDate ? true : inDateRange(e.startDate)) &&
        (filters.online === null || (e.online ?? null) === filters.online) &&
        (filters.priceMin == null || ((e.price as number | undefined) ?? 0) >= filters.priceMin) &&
        (filters.priceMax == null || ((e.price as number | undefined) ?? 0) <= filters.priceMax)
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
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* soft gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-sky-50 to-white" />
        {/* decorative logo watermark */}
        <img
          src={bearLogoTransparent}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[22rem] w-[22rem] opacity-15 blur-sm"
        />

        <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14 lg:pt-16">
          <div className="flex flex-col items-center text-center">
            <img src={bearLogo} alt="Bear logo" className="h-20 w-20 drop-shadow mb-5" />
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Browse Bear Events
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
              Find what’s happening on campus—talks, hackathons, clubs, sports, and more.
            </p>

            {/* quick stats */}
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-md sm:gap-6 sm:px-6">
              <div className="text-slate-700">
                <div className="font-semibold">{stats.total}</div>
                <div className="text-slate-500">Upcoming events</div>
              </div>
              <div className="text-slate-700">
                <div className="font-semibold">{stats.uniqueCategories}</div>
                <div className="text-slate-500">Categories</div>
              </div>
              <div className="text-slate-700">
                <div className="font-semibold">{stats.nextFmt}</div>
                <div className="text-slate-500">Next start</div>
              </div>
            </div>

            {/* search in hero -> controls filters.query */}
            <div className="mt-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg ring-1 ring-black/5 backdrop-blur">
              <SearchBar
                value={filters.query}
                onChange={(v) => setFilters((f) => ({ ...f, query: v }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-slate-700">Filters</div>
            <div className="min-w-0 flex-1">
              <EventFilters
                categories={categories}
                value={filters}
                onChange={setFilters}
              />
            </div>
            <button
              onClick={() => setFilters(initialFilters)}
              className="ml-2 hidden shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:block"
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
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-indigo-50 p-2">
              <img src={bearLogo} alt="" className="h-full w-full object-contain" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">No matching events</h2>
            <p className="mt-1 text-sm text-slate-600">
              Try adjusting your search or filters—or create the first event now.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
