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
