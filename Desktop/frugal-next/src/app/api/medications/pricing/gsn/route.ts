import { NextRequest, NextResponse } from 'next/server';
import { getMedicationPricingByGSN } from '@/lib/api/medications';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gsn = searchParams.get('gsn');
  const zipCode = searchParams.get('zipCode');
  const quantity = searchParams.get('quantity');

  if (!gsn) {
    return NextResponse.json(
      { error: 'Query parameter "gsn" is required' },
      { status: 400 }
    );
  }

  if (!zipCode) {
    return NextResponse.json(
      { error: 'Query parameter "zipCode" is required' },
      { status: 400 }
    );
  }

  try {
    const pricing = await getMedicationPricingByGSN(
      gsn,
      zipCode,
      quantity ? parseInt(quantity) : undefined
    );
    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error in medication pricing by GSN API route:', error);
    return NextResponse.json(
      { error: 'Failed to get medication pricing' },
      { status: 500 }
    );
  }
} 