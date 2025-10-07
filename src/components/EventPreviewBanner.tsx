import React from 'react';

interface EventPreviewProps {
  title: string;
  date: string;
  location: string;
  imageUrl: string;
}

const EventPreviewBanner: React.FC<EventPreviewProps> = ({ title, date, location, imageUrl }) => {
  const backgroundStyle = {
    backgroundImage: imageUrl ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${imageUrl})` : undefined,
    backgroundColor: imageUrl ? undefined : '#F5F5F5',
  };

  return (
    <div
      className="relative w-full h-64 flex items-end p-8 mb-6 rounded-lg shadow-xl bg-cover bg-center overflow-hidden transition duration-300 hover:shadow-2xl"
      style={backgroundStyle}
    >
      {/* 💥 CHANGED: Only render event details when an image URL exists */}
      {imageUrl && (
        <div className="relative z-10 text-white drop-shadow-lg">
          <h2 className="text-4xl font-extrabold leading-snug">
            {title || 'Your Awesome Event Title'}
          </h2>
          <div className="mt-2 text-lg font-medium">
            <p>
              <strong className="text-brand-gold">🗓️</strong> {date ? new Date(date).toLocaleDateString(undefined, {
                weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              }) : 'Date & Time'}
            </p>
            <p>
              <strong className="text-brand-gold">📍</strong> {location || 'Event Location'}
            </p>
          </div>
        </div>
      )}

      {/* Fallback banner if no image URL is present */}
      {!imageUrl && (
        // 💥 CHANGED: Adjusted text color from text-gray-500 to text-gray-700
        <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-semibold text-lg border-2 border-dashed border-gray-300 rounded-lg">
          Upload an image to see your banner preview
        </div>
      )}
    </div>
  );
}

export default EventPreviewBanner;