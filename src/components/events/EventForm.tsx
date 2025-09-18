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
