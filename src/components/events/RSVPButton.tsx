import React from 'react';
type Props = { rsvped: boolean; count?: number; onClick: () => void; };
export default function RSVPButton({ rsvped, count, onClick }: Props) {
  return <button onClick={onClick} className="px-3 py-1 rounded border">{rsvped ? '✅ RSVPed' : 'RSVP'} {count ? `(${count})` : ''}</button>;
}
