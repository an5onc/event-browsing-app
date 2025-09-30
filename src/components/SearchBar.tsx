/* This component is a search bar used to filter events in the event browsing app.
This page should provide a search input where users can type keywords to quickly filter through 
the list of events. As the user types, the search bar should update the displayed events in real 
time by matching against fields such as the event title, description, or location. It serves as a fast 
way to find specific events without needing to use the full set of filters.*/

/**
 * Purpose: Describe what this file does in one line.
 *
 * Common references:
 * - Actions (like/RSVP): src/context/EventsContext.tsx
 * - Buttons: src/components/LikeButton.tsx, src/components/RSVPButton.tsx
 * - Event card: src/components/EventItem.tsx
 * - Pages: src/pages/EventList.tsx, src/pages/EventDetail.tsx, src/pages/CreateEvent.tsx
 * - Filters: src/components/Filters.tsx, src/components/SearchBar.tsx
 * - Routing: src/App.tsx
 *
 * Hint: If you need like or RSVP functionality, import from EventsContext
 * and/or reuse LikeButton or RSVPButton components.
 */



// Lanetta this page is assigned to you.

import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearchChange, 
  placeholder = "Search events by title, description, or location...",
  className = ""
}) => {
  const [searchInput, setSearchInput] = useState<string>('');

  // Real-time search - updates parent component as user types
  useEffect(() => {
    onSearchChange(searchInput);
  }, [searchInput, onSearchChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
  };

  return (
    <div className={`search-bar-container ${className}`}>
      <div className="search-input-wrapper">
        {/* Search Icon */}
        <svg 
          className="search-icon" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search events"
        />

        {/* Clear Button */}
        {searchInput && (
          <button
            onClick={handleClearSearch}
            className="clear-button"
            aria-label="Clear search"
            type="button"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <style>{`
        .search-bar-container {
          width: 100%;
          margin-bottom: 1rem;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #9ca3af;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 44px;
          font-size: 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .clear-button {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-button:hover {
          background-color: #f3f4f6;
          color: #374151;
        }

        .clear-button:active {
          background-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;