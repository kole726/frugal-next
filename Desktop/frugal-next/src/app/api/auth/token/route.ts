import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'ccds.read');

    const response = await fetch('https://medimpact.okta.com/oauth2/aus107c5yrHDu55K8297/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.AMERICAS_PHARMACY_CLIENT_ID}:${process.env.AMERICAS_PHARMACY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error(`Authentication failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      return NextResponse.json(
        { error: `Authentication failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return NextResponse.json(
      { error: 'Failed to get authentication token' },
      { status: 500 }
    );
  }
} 