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
