import React from 'react';

interface EventPreviewProps{
  title: string;
  date: string;
  location: string;
  imageUrl: string;
}

const EventPreviewBanner: React.FC<EventPreviewProps> = ({title, date, location, imageUrl}) => {



return (
  <div className="p-6 mb-6 w-full bg-brand-gold/20 border border-brand-gold rounded-lg shadow-md flex items-center gap-4">
    {imageUrl && (
      <img
        src={imageUrl}
        alt={title}
        className="h-20 w-20 object-cover rounded-md border border-brand-light"
      />
    )}
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-brand-blue truncate">
        {title || 'Your Awesome Event Title'}
      </h2>
      <p className="text-sm text-brand-bluegrey mt-2">
        <strong className="text-brand-gold">When:</strong> {date || 'Date & Time'}
      </p>
      <p className="text-sm text-brand-bluegrey mt-1">
        <strong className="text-brand-gold">Where:</strong> {location || 'Event Location'}
      </p>
    </div>
  </div>
)
}
export default EventPreviewBanner;