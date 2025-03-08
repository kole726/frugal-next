import { NextRequest, NextResponse } from 'next/server';
import { getMultiDrugPricingByGSN } from '@/lib/api/medications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gsns, zipCode, quantities } = body;

    if (!gsns || !Array.isArray(gsns) || gsns.length === 0) {
      return NextResponse.json(
        { error: 'Request body must include "gsns" array' },
        { status: 400 }
      );
    }

    if (!zipCode) {
      return NextResponse.json(
        { error: 'Request body must include "zipCode"' },
        { status: 400 }
      );
    }

    const data = await getMultiDrugPricingByGSN(
      gsns,
      zipCode,
      quantities
    );
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in multi-drug pricing by GSN API route:', error);
    
    // Provide more specific error messages based on the error
    const errorMessage = error instanceof Error ? error.message : 'Failed to get multi-drug pricing';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 