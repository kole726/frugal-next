interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Gets an authentication token for the Americas Pharmacy API
 */
export async function getAuthToken(): Promise<string> {
  // If we have a cached token that's still valid, return it
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('Using cached auth token');
    return cachedToken;
  }

  console.log('Getting new auth token...');
  
  // Otherwise, get a new token
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'ccds.read');

  try {
    console.log(`Auth URL: ${process.env.AMERICAS_PHARMACY_AUTH_URL}`);
    console.log(`Client ID: ${process.env.AMERICAS_PHARMACY_CLIENT_ID?.substring(0, 5)}...`); // Log only part of the ID for security
    
    const response = await fetch(process.env.AMERICAS_PHARMACY_AUTH_URL!, {
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
      console.error(`Auth error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Auth error response: ${errorText}`);
      throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }

    const data: AuthResponse = await response.json();
    console.log('Auth token received successfully');
    
    // Cache the token and set expiry (subtract 60 seconds to be safe)
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
} 