import { NextRequest, NextResponse } from 'next/server';
import { getNearbyPharmacies } from '@/lib/api/medications';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zipCode = searchParams.get('zipCode');
  const count = searchParams.get('count');

  if (!zipCode) {
    return NextResponse.json(
      { error: 'Query parameter "zipCode" is required' },
      { status: 400 }
    );
  }

  try {
    const pharmacies = await getNearbyPharmacies(
      zipCode,
      count ? parseInt(count) : 5
    );
    return NextResponse.json({ pharmacies });
  } catch (error) {
    console.error('Error in nearby pharmacies API route:', error);
    return NextResponse.json(
      { error: 'Failed to get nearby pharmacies' },
      { status: 500 }
    );
  }
} 