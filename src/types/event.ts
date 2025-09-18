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
