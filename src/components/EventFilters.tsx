import React from 'react';

export type SortKey = 'soon' | 'new' | 'popular';

export type EventFiltersState = {
  category: string | null;
  query: string;
  startDate?: string;
  endDate?: string;
  location: string;
  withinMiles?: number;
  priceMin?: number;
  priceMax?: number;
  online: boolean | null;
  sort: SortKey;
};

export type EventFiltersProps = {
  categories: string[];
  value: EventFiltersState;
  onChange: (next: EventFiltersState) => void;
};

const EventFilters: React.FC<EventFiltersProps> = ({ categories, value, onChange }) => {
  const set = <K extends keyof EventFiltersState>(key: K, v: EventFiltersState[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="rounded border border-slate-300 px-2 py-1 text-sm"
        value={value.category ?? ''}
        onChange={(e) => set('category', e.target.value || null)}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
        <option value="">Music</option>
        <option value="1">Tech</option>
        <option value="0">Arts</option>
        <option value="0">Tech</option>
        <option value="0">Food</option>
      </select>

      <input
        type="date"
        className="rounded border border-slate-300 px-2 py-1 text-sm"
        value={value.startDate ?? ''}
        onChange={(e) => set('startDate', e.target.value || undefined)}
      />
      <input
        type="date"
        className="rounded border border-slate-300 px-2 py-1 text-sm"
        value={value.endDate ?? ''}
        onChange={(e) => set('endDate', e.target.value || undefined)}
      />

      <select
        className="rounded border border-slate-300 px-2 py-1 text-sm"
        value={value.online === null ? '' : value.online ? '1' : '0'}
        onChange={(e) => set('online', e.target.value === '' ? null : e.target.value === '1')}
      >
        <option value="">All formats</option>
        <option value="1">Online</option>
        <option value="0">In person</option>
      </select>

      <input
        type="number"
        placeholder="Min $"
        className="w-24 rounded border border-slate-300 px-2 py-1 text-sm"
        value={value.priceMin ?? ''}
        onChange={(e) => set('priceMin', e.target.value === '' ? undefined : Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Max $"
        className="w-24 rounded border border-slate-300 px-2 py-1 text-sm"
        value={value.priceMax ?? ''}
        onChange={(e) => set('priceMax', e.target.value === '' ? undefined : Number(e.target.value))}
      />

      <select
        className="rounded border border-slate-300 px-2 py-1 text-sm"
        value={value.sort}
        onChange={(e) => set('sort', e.target.value as SortKey)}
      >
        <option value="soon">Starting soon</option>
        <option value="new">Newest</option>
        <option value="popular">Most liked</option>
      </select>
    </div>
  );
};

export default EventFilters;