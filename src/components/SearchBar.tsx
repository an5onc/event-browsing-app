import React from 'react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search events by title, description, or location...',
  className = '',
}) => {
  const handleClearSearch = () => onChange('');

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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search events"
        />

        {/* Clear Button */}
        {value && (
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
        .search-bar-container { width: 100%; margin-bottom: 1rem; }
        .search-input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .search-icon { position: absolute; left: 12px; color: #9ca3af; pointer-events: none; }
        .search-input { width: 100%; padding: 10px 40px 10px 44px; font-size: 16px; border: 1px solid #d1d5db; border-radius: 8px; outline: none; transition: all 0.2s ease; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .search-input::placeholder { color: #9ca3af; }
        .clear-button { position: absolute; right: 12px; background: none; border: none; color: #6b7280; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: all 0.2s ease; }
        .clear-button:hover { background-color: #f3f4f6; color: #374151; }
        .clear-button:active { background-color: #e5e7eb; }
      `}</style>
    </div>
  );
};

export default SearchBar;