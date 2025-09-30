import React from 'react';

interface EventPreviewProps{
  title: string;
  date: string;
  location: string;
  imageUrl: string;
}

const EventPreviewBanner: React.FC<EventPreviewProps> = ({title, date, location, imageUrl}) => {



return (
     <div className="p-4 mb-6 w-full bg-[#F5E3B1] shadow-md rounded">
          <h2 className="text-2xl font-bold text-gray-800 truncate">
            {title || 'Your Awesome Event Title'}
          </h2>
          <p className="text-gray-600 mt-2">
            <strong>When:</strong>
          </p>
          <p className="text-gray-500 mt-1">
            <strong>Where:</strong> {location || 'Event Location'}
          </p>
        </div>
)
}
export default EventPreviewBanner;