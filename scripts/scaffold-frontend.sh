#!/usr/bin/env bash
set -euo pipefail

# adjust BASE if your project does not use src/
BASE=src

mkdir -p $BASE/{components/{events,common,profile,auth},pages,hooks,lib,types}

# ---------- types ----------
cat > $BASE/types/event.ts <<'TS'
export type EventVisibility = 'public' | 'private';
export interface Event {
  id: string;
  title: string;
  description?: string;
  category: string;
  startsAt: string;  // ISO
  endsAt?: string;   // ISO
  location: string;
  imageUrl?: string;
  visibility: EventVisibility;
  createdBy: string;
  likes: number;
  likedByMe?: boolean;
  rsvpedByMe?: boolean;
  rsvpCount?: number;
}
TS

# ---------- tiny placeholder API ----------
cat > $BASE/lib/api.ts <<'TS'
import type { Event } from '../types/event';

export const EventsAPI = {
  list: async (): Promise<Event[]> => [],
  get: async (id: string): Promise<Event | null> => null,
  create: async (payload: Partial<Event>): Promise<Event> => ({ id: 'tmp', title: payload.title ?? '', category: payload.category ?? '', startsAt: new Date().toISOString(), location: payload.location ?? '', visibility: payload.visibility ?? 'public', createdBy: 'me', likes: 0 }),
  update: async (id: string, payload: Partial<Event>): Promise<Event> => ({ id, title: payload.title ?? 'Untitled', category: payload.category ?? 'General', startsAt: payload.startsAt ?? new Date().toISOString(), location: payload.location ?? '', visibility: payload.visibility ?? 'public', createdBy: 'me', likes: 0 }),
  remove: async (id: string): Promise<{ok:true}> => ({ ok: true }),
  toggleVisibility: async (id: string, visibility: 'public'|'private') => ({ id, visibility }),
  like: async (id: string) => ({ likes: 1, likedByMe: true }),
  rsvp: async (id: string) => ({ rsvpCount: 1, rsvpedByMe: true }),
};

export const AuthAPI = {
  signIn: async (email: string, password: string) => ({ token: 'dev' }),
  signUp: async (email: string, password: string) => ({ token: 'dev' }),
};
TS

# ---------- hooks ----------
cat > $BASE/hooks/useDebounce.ts <<'TS'
import { useEffect, useState } from 'react';
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const id = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(id); }, [value, delay]);
  return debounced;
}
TS

# ---------- common ----------
cat > $BASE/components/common/SearchBar.tsx <<'TSX'
import React from 'react';
type Props = { placeholder?: string; onSearch: (q: string) => void; };
export default function SearchBar({ placeholder='Search events…', onSearch }: Props) {
  const [q, setQ] = React.useState('');
  React.useEffect(() => { const id = setTimeout(() => onSearch(q.trim()), 300); return () => clearTimeout(id); }, [q]);
  return <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder={placeholder} className="w-full border rounded px-3 py-2" />;
}
TSX

cat > $BASE/components/common/LikeButton.tsx <<'TSX'
import React from 'react';
type Props = { likes: number; liked: boolean; onToggle: () => void; };
export default function LikeButton({ likes, liked, onToggle }: Props) {
  return <button onClick={onToggle} className="inline-flex items-center gap-2 px-3 py-1 rounded border">{liked ? '💙' : '🤍'} <span>{likes}</span></button>;
}
TSX

cat > $BASE/components/common/VisibilityToggle.tsx <<'TSX'
import React from 'react';
type Props = { value: 'public'|'private'; onChange: (v: 'public'|'private') => void; };
export default function VisibilityToggle({ value, onChange }: Props) {
  return (
    <label className="inline-flex items-center gap-2">
      <span>Visibility:</span>
      <select value={value} onChange={(e)=>onChange(e.target.value as 'public'|'private')} className="border rounded px-2 py-1">
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </label>
  );
}
TSX

# ---------- events ----------
cat > $BASE/components/events/EventCard.tsx <<'TSX'
import React from 'react';
import type { Event } from '../../types/event';
import LikeButton from '../common/LikeButton';

type Props = { event: Event; onLike?: (id: string)=>void; onRSVP?: (id: string)=>void; onDelete?: (id: string)=>void; onEdit?: (id: string)=>void };
export default function EventCard({ event, onLike, onRSVP, onDelete, onEdit }: Props) {
  return (
    <article className="border rounded p-4 flex flex-col gap-2">
      <header className="flex justify-between">
        <h3 className="font-semibold">{event.title}</h3>
        <small>{new Date(event.startsAt).toLocaleString()}</small>
      </header>
      <div className="text-sm text-gray-600">{event.location} • {event.category} • {event.visibility}</div>
      {event.description && <p>{event.description}</p>}
      <div className="flex items-center gap-2">
        <LikeButton likes={event.likes} liked={!!event.likedByMe} onToggle={()=>onLike?.(event.id)} />
        <button className="px-3 py-1 rounded border" onClick={()=>onRSVP?.(event.id)}>RSVP {event.rsvpCount ? `(${event.rsvpCount})` : ''}</button>
        <div className="ms-auto flex gap-2">
          <button className="px-3 py-1 rounded border" onClick={()=>onEdit?.(event.id)}>Edit</button>
          <button className="px-3 py-1 rounded border text-red-600" onClick={()=>onDelete?.(event.id)}>Delete</button>
        </div>
      </div>
    </article>
  );
}
TSX

cat > $BASE/components/events/EventList.tsx <<'TSX'
import React from 'react';
import type { Event } from '../../types/event';
import EventCard from './EventCard';

type Props = { events: Event[]; onLike?: (id:string)=>void; onRSVP?: (id:string)=>void; onDelete?: (id:string)=>void; onEdit?: (id:string)=>void };
export default function EventList({ events, ...handlers }: Props) {
  if (!events.length) return <p className="text-sm text-gray-500">No events yet.</p>;
  return (
    <section className="grid gap-3">
      {events.map(ev => <EventCard key={ev.id} event={ev} {...handlers} />)}
    </section>
  );
}
TSX

cat > $BASE/components/events/EventForm.tsx <<'TSX'
import React from 'react';
import type { Event, EventVisibility } from '../../types/event';
import VisibilityToggle from '../common/VisibilityToggle';

type Props = { initial?: Partial<Event>; onSubmit: (data: Partial<Event>) => void; submitLabel?: string };
export default function EventForm({ initial = {}, onSubmit, submitLabel='Save' }: Props) {
  const [title, setTitle] = React.useState(initial.title ?? '');
  const [category, setCategory] = React.useState(initial.category ?? 'General');
  const [startsAt, setStartsAt] = React.useState(initial.startsAt ?? new Date().toISOString().slice(0,16));
  const [location, setLocation] = React.useState(initial.location ?? '');
  const [visibility, setVisibility] = React.useState<EventVisibility>(initial.visibility ?? 'public');
  const [description, setDescription] = React.useState(initial.description ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, category, startsAt: new Date(startsAt).toISOString(), location, visibility, description });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 max-w-xl">
      <input className="border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
      <input className="border rounded px-3 py-2" placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} />
      <input className="border rounded px-3 py-2" type="datetime-local" value={startsAt} onChange={(e)=>setStartsAt(e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} />
      <VisibilityToggle value={visibility} onChange={setVisibility} />
      <textarea className="border rounded px-3 py-2" rows={4} placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
      <button className="px-4 py-2 rounded border font-medium">{submitLabel}</button>
    </form>
  );
}
TSX

cat > $BASE/components/events/EventFilters.tsx <<'TSX'
import React from 'react';
type Filters = { q?: string; category?: string; from?: string; to?: string; };
type Props = { value: Filters; onChange: (v: Filters)=>void };
export default function EventFilters({ value, onChange }: Props) {
  function patch(p: Partial<Filters>) { onChange({ ...value, ...p }); }
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input className="border rounded px-2 py-1" placeholder="Category" value={value.category ?? ''} onChange={(e)=>patch({category: e.target.value})}/>
      <label className="text-sm">From <input type="date" className="border rounded px-2 py-1" value={value.from ?? ''} onChange={(e)=>patch({from: e.target.value})}/></label>
      <label className="text-sm">To <input type="date" className="border rounded px-2 py-1" value={value.to ?? ''} onChange={(e)=>patch({to: e.target.value})}/></label>
    </div>
  );
}
TSX

cat > $BASE/components/events/RSVPButton.tsx <<'TSX'
import React from 'react';
type Props = { rsvped: boolean; count?: number; onClick: () => void; };
export default function RSVPButton({ rsvped, count, onClick }: Props) {
  return <button onClick={onClick} className="px-3 py-1 rounded border">{rsvped ? '✅ RSVPed' : 'RSVP'} {count ? `(${count})` : ''}</button>;
}
TSX

# ---------- profile ----------
cat > $BASE/components/profile/MyEvents.tsx <<'TSX'
import React from 'react';
import type { Event } from '../../types/event';
import EventList from '../events/EventList';
type Props = { events: Event[]; onEdit?: (id:string)=>void; onDelete?: (id:string)=>void };
export default function MyEvents({ events, onEdit, onDelete }: Props) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">My RSVPs</h2>
      <EventList events={events} onEdit={onEdit} onDelete={onDelete} />
    </section>
  );
}
TSX

cat > $BASE/components/profile/ImageUploader.tsx <<'TSX'
import React from 'react';
type Props = { onSelect: (file: File) => void; };
export default function ImageUploader({ onSelect }: Props) {
  const [preview, setPreview] = React.useState<string | null>(null);
  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setPreview(URL.createObjectURL(f));
    onSelect(f);
  }
  return (
    <div className="grid gap-2">
      <input type="file" accept="image/*" onChange={handle} />
      {preview && <img src={preview} alt="preview" className="max-h-40 object-cover rounded" />}
    </div>
  );
}
TSX

# ---------- auth ----------
cat > $BASE/components/auth/SignIn.tsx <<'TSX'
import React from 'react';
type Props = { onSubmit: (email: string, password: string) => void; };
export default function SignIn({ onSubmit }: Props) {
  const [email, setEmail] = React.useState(''); const [password, setPassword] = React.useState('');
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(email, password);}} className="grid gap-3 max-w-sm">
      <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="px-4 py-2 border rounded">Sign In</button>
    </form>
  );
}
TSX

cat > $BASE/components/auth/SignUp.tsx <<'TSX'
import React from 'react';
type Props = { onSubmit: (email: string, password: string) => void; };
export default function SignUp({ onSubmit }: Props) {
  const [email, setEmail] = React.useState(''); const [password, setPassword] = React.useState('');
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(email, password);}} className="grid gap-3 max-w-sm">
      <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="px-4 py-2 border rounded">Create Account</button>
    </form>
  );
}
TSX

# ---------- simple pages to wire things ----------
cat > $BASE/pages/EventsPage.tsx <<'TSX'
import React from 'react';
import { EventsAPI } from '../lib/api';
import type { Event } from '../types/event';
import SearchBar from '../components/common/SearchBar';
import EventFilters from '../components/events/EventFilters';
import EventList from '../components/events/EventList';

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
TSX

cat > $BASE/pages/NewEventPage.tsx <<'TSX'
import React from 'react';
import { EventsAPI } from '../lib/api';
import EventForm from '../components/events/EventForm';

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
TSX

echo "✅ Scaffold complete."
