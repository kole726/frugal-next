import { NextRequest, NextResponse } from 'next/server';
import { getMedicationPricingByNDC } from '@/lib/api/medications';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ndc = searchParams.get('ndc');
  const zipCode = searchParams.get('zipCode');
  const quantity = searchParams.get('quantity');

  if (!ndc) {
    return NextResponse.json(
      { error: 'Query parameter "ndc" is required' },
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
    const pricing = await getMedicationPricingByNDC(
      ndc,
      zipCode,
      quantity ? parseInt(quantity) : undefined
    );
    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error in medication pricing by NDC API route:', error);
    return NextResponse.json(
      { error: 'Failed to get medication pricing' },
      { status: 500 }
    );
  }
} 