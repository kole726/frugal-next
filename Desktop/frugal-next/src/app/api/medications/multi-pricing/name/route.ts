import { NextRequest, NextResponse } from 'next/server';
import { getMultiDrugPricingByName } from '@/lib/api/medications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { drugNames, zipCode, quantities } = body;

    if (!drugNames || !Array.isArray(drugNames) || drugNames.length === 0) {
      return NextResponse.json(
        { error: 'Request body must include "drugNames" array' },
        { status: 400 }
      );
    }

    if (!zipCode) {
      return NextResponse.json(
        { error: 'Request body must include "zipCode"' },
        { status: 400 }
      );
    }

    const data = await getMultiDrugPricingByName(
      drugNames,
      zipCode,
      quantities
    );
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in multi-drug pricing by name API route:', error);
    
    // Provide more specific error messages based on the error
    const errorMessage = error instanceof Error ? error.message : 'Failed to get multi-drug pricing';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 