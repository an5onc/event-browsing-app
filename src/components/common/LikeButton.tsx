import React from 'react';
type Props = { likes: number; liked: boolean; onToggle: () => void; };
export default function LikeButton({ likes, liked, onToggle }: Props) {
  return <button onClick={onToggle} className="inline-flex items-center gap-2 px-3 py-1 rounded border">{liked ? '💙' : '🤍'} <span>{likes}</span></button>;
}
