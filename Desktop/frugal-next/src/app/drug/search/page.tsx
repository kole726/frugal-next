'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Medication } from '@/lib/api/medications';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function searchMedications() {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      if (query.trim().length < 3) {
        setResults([]);
        setError('Please enter at least 3 characters to search');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/medications/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to search medications');
        }
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Error searching medications:', error);
        setError('Failed to search medications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    searchMedications();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        &larr; Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-pink-500 rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      ) : results.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-lg text-gray-700 mb-4">No medications found for "{query}"</p>
          <p className="text-gray-600">Try searching with a different term or check the spelling.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {results.map((medication) => (
            <Link 
              href={`/drug/${medication.drugId}`} 
              key={medication.drugId}
              className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{medication.drugName}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {medication.isGeneric ? (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Generic</span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Brand</span>
                )}
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{medication.dosageForm}</span>
                {medication.strength && (
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{medication.strength}</span>
                )}
              </div>
              <p className="text-gray-600 text-sm">
                {medication.genericName && medication.genericName !== medication.drugName && (
                  <span>Generic Name: {medication.genericName}</span>
                )}
                {medication.brandName && medication.brandName !== medication.drugName && (
                  <span>Brand Name: {medication.brandName}</span>
                )}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Loading fallback component
function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-pink-500 rounded-full"></div>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
} 