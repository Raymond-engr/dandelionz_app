'use client';

import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  showFilter?: boolean;
  autoFocus?: boolean;
  /** Fired when the user submits the field (Enter). */
  onSubmit?: () => void;
  /**
   * Turns the bar into a button instead of an input. Used on the shop page,
   * where clicking should open the dedicated search page rather than filter
   * in place.
   */
  onClick?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search Products",
  onFilterClick,
  showFilter = false,
  autoFocus = false,
  onSubmit,
  onClick
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={onClick}
          readOnly={Boolean(onClick)}
          autoFocus={autoFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit?.();
          }}
          // Search terms are not prose; the usual assists get in the way.
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent${onClick ? ' cursor-pointer' : ''}`}
        />
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      {showFilter && (
        <button
          onClick={onFilterClick}
          className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg 
            className="w-5 h-5 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
            />
          </svg>
        </button>
      )}
    </div>
  );
}