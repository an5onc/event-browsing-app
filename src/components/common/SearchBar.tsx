import React from 'react';
type Props = { placeholder?: string; onSearch: (q: string) => void; };
export default function SearchBar({ placeholder='Search events…', onSearch }: Props) {
  const [q, setQ] = React.useState('');
  React.useEffect(() => { const id = setTimeout(() => onSearch(q.trim()), 300); return () => clearTimeout(id); }, [q]);
  return <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder={placeholder} className="w-full border rounded px-3 py-2" />;
}
