import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/api/auth';

// Handler for the API route
export async function GET(request: NextRequest) {
  // Get the drugName from query params
  const searchParams = request.nextUrl.searchParams;
  const drugName = searchParams.get('drugName');
  
  if (!drugName) {
    return NextResponse.json(
      { error: 'Drug name parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get an auth token
    const token = await getAuthToken();
    
    // Set default location coordinates (can be made dynamic later)
    const latitude = 30.4015;
    const longitude = -97.7527;
    
    // Make request to Americas Pharmacy API
    const apiUrl = `${process.env.AMERICAS_PHARMACY_API_URL}/drugprices/byName`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hqMappingName: "walkerrx",
        drugName: drugName,
        latitude: latitude,
        longitude: longitude
      }),
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      let errorMessage = `Failed to get medication data: ${response.status}`;
      
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in medication API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 