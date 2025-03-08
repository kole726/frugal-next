import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.americaspharmacy.com/pricing';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path, 'POST');
}

async function handleRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Construct the target URL
    const path = pathSegments ? `/${pathSegments.join('/')}` : '';
    const url = new URL(`${API_BASE_URL}${path}`);
    
    // Add query parameters
    const searchParams = request.nextUrl.searchParams;
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
    
    console.log(`Proxying ${method} request to: ${url.toString()}`);
    
    // Forward the request
    const headers: HeadersInit = {
      'Content-Type': request.headers.get('Content-Type') || 'application/json',
    };
    
    // Forward authorization header if present
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const options: RequestInit = {
      method,
      headers,
      redirect: 'follow',
    };
    
    // Add body for POST requests
    if (method === 'POST') {
      const contentType = request.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const body = await request.json();
        options.body = JSON.stringify(body);
      } else {
        options.body = await request.text();
      }
    }
    
    const response = await fetch(url.toString(), options);
    
    // Handle response
    const responseData = await response.json().catch(() => null);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      console.error('Error response:', responseData);
      
      return NextResponse.json(
        responseData || { error: `API request failed: ${response.status} ${response.statusText}` },
        { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
    
    return NextResponse.json(responseData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to API' },
      { status: 500 }
    );
  }
} 