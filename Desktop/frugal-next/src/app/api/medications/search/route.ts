import { NextRequest, NextResponse } from 'next/server';
import { searchMedications } from '@/lib/api/medications';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim() === '') {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  // Add validation for minimum query length
  if (query.trim().length < 3) {
    return NextResponse.json(
      { error: 'Search query must be at least 3 characters long' },
      { status: 400 }
    );
  }

  try {
    const medications = await searchMedications(query);
    
    if (!medications || medications.length === 0) {
      return NextResponse.json(
        { results: [], message: 'No medications found matching your search' },
        { status: 200 }
      );
    }
    
    return NextResponse.json({ results: medications });
  } catch (error) {
    console.error('Error in medication search API route:', error);
    
    // Provide more specific error messages based on the error
    const errorMessage = error instanceof Error ? error.message : 'Failed to search medications';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 