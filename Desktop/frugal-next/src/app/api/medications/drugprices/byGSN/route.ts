import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/api/auth';

// Handler for the API route
export async function GET(request: NextRequest) {
  // Get the GSN from query params
  const searchParams = request.nextUrl.searchParams;
  const gsn = searchParams.get('gsn');
  
  if (!gsn || isNaN(Number(gsn))) {
    return NextResponse.json(
      { error: 'Valid GSN parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get an auth token
    const token = await getAuthToken();
    console.log(`Getting data for GSN: ${gsn}`);
    
    // Set default location coordinates (can be made dynamic later)
    const latitude = 30.4015;
    const longitude = -97.7527;
    
    // Make request to Americas Pharmacy API
    const apiUrl = `${process.env.AMERICAS_PHARMACY_API_URL}/drugprices/byGSN`;
    console.log(`Making request to: ${apiUrl}`);
    
    const requestBody = {
      hqMappingName: "walkerrx",
      gsn: Number(gsn),
      latitude: latitude,
      longitude: longitude
    };
    
    console.log(`Request body: ${JSON.stringify(requestBody)}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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
    
    // Log relevant information about forms and quantities
    if (data.forms) {
      console.log(`Forms available for GSN ${gsn}:`, 
        data.forms.map((f: any) => `${f.form} (GSN: ${f.gsn}, Selected: ${f.selected})`));
    }
    
    if (data.quantities) {
      console.log(`Quantities available for GSN ${gsn}:`, 
        data.quantities.map((q: any) => `${q.quantity} ${q.uom} (GSN: ${q.gsn}, Selected: ${q.selected})`));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in medication API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 