import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  // Get the query from search params
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Search query parameter "q" is required' },
      { status: 400 }
    );
  }
  
  // Ensure query is at least 3 characters
  if (query.trim().length < 3) {
    return NextResponse.json(
      { error: 'Search query must be at least 3 characters long' },
      { status: 400 }
    );
  }
  
  try {
    // Get an auth token
    const token = await getAuthToken();
    
    // Make request to Americas Pharmacy API
    const apiUrl = `${process.env.AMERICAS_PHARMACY_API_URL}/drugs/names`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hqMappingName: "walkerrx",
        prefixText: query.trim()
      }),
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      let errorMessage = `Failed to search medications: ${response.status}`;
      
      try {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        errorMessage = errorText;
      } catch (e) {
        // Ignore parsing errors
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }
    
    // Return the API response
    const data = await response.json();
    return NextResponse.json({ results: data });
  } catch (error) {
    console.error('Error in medication search API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 