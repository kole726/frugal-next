import { NextRequest, NextResponse } from 'next/server';
import { getMedicationPricing } from '@/lib/api/medications';

export async function GET(
  request: NextRequest,
  context: { params: { drugName: string } }
) {
  const drugName = context.params.drugName;
  const searchParams = request.nextUrl.searchParams;
  const zipCode = searchParams.get('zipCode');
  const radius = searchParams.get('radius');

  if (!zipCode) {
    return NextResponse.json(
      { error: 'Query parameter "zipCode" is required' },
      { status: 400 }
    );
  }

  try {
    const pricing = await getMedicationPricing(
      drugName,
      zipCode,
      radius ? parseInt(radius) : 10
    );
    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error in medication pricing API route:', error);
    return NextResponse.json(
      { error: 'Failed to get medication pricing' },
      { status: 500 }
    );
  }
} 