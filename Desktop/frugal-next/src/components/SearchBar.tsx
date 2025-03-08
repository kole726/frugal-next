'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Medication } from '@/lib/api/medications';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close the results dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for medications as the user types
  useEffect(() => {
    const searchMedications = async () => {
      if (query.trim().length < 3) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/medications/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Search failed');
        }
        const data = await response.json();
        console.log(`Found ${data.results?.length || 0} results for "${query}"`);
        setResults(data.results || []);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching medications:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchMedications, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // If we have results, navigate to the first result
      if (results.length > 0) {
        router.push(`/drug/${results[0].drugName}`);
      } else {
        // Otherwise, just search by name
        router.push(`/drug/search?q=${encodeURIComponent(query.toLowerCase().trim())}`);
      }
      setShowResults(false);
    }
  };

  const handleResultClick = (drugName: string) => {
    router.push(`/drug/${drugName}`);
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  // Function to highlight the matching part of the drug name
  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? 
            <span key={i} className="bg-yellow-100 text-gray-900 font-bold">{part}</span> : 
            <span key={i}>{part}</span>
        )}
      </>
    );
  };

  return (
    <div className="w-full relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter medication name..."
            className="w-full py-4 px-6 rounded-full border-2 border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 text-lg shadow-sm"
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            aria-label="Search for medications"
            aria-expanded={showResults}
            aria-controls={showResults ? "search-results" : undefined}
          />
          
          {/* Clear button */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
            aria-label="Submit search"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div 
          id="search-results"
          className="absolute z-50 mt-2 w-full bg-white rounded-md shadow-xl border-2 border-gray-300 max-h-80 overflow-auto"
          role="listbox"
        >
          <div className="sticky top-0 bg-gray-100 px-5 py-2 border-b border-gray-300 text-sm text-gray-600">
            Found {results.length} medication{results.length !== 1 ? 's' : ''}
          </div>
          <ul className="py-2">
            {results.map((medication) => (
              <li
                key={medication.drugId}
                className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleResultClick(medication.drugName)}
                role="option"
                aria-selected="false"
              >
                <div className="font-semibold text-lg text-gray-800">
                  {highlightMatch(medication.drugName)}
                </div>
                {(medication.dosageForm || medication.strength) && (
                  <div className="text-md text-gray-600 mt-1">
                    {medication.dosageForm && medication.dosageForm}{medication.dosageForm && medication.strength ? ' • ' : ''}{medication.strength && medication.strength}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty Results Message */}
      {showResults && query.trim().length >= 3 && results.length === 0 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-xl border border-gray-300 p-4 text-center">
          <p className="text-gray-700">No medications found matching "{query}"</p>
        </div>
      )}

      {/* Minimum Characters Message */}
      {query.trim().length > 0 && query.trim().length < 3 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-xl border border-gray-300 p-4 text-center">
          <p className="text-gray-700">Please enter at least 3 characters to search</p>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-pink-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
} 