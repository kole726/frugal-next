import { NextRequest, NextResponse } from 'next/server';
import { getMedicationDetails } from '@/lib/api/medications';

export async function GET(
  request: NextRequest,
  context: { params: { drugName: string } }
) {
  const drugName = context.params.drugName;

  if (!drugName || drugName.trim() === '') {
    return NextResponse.json(
      { error: 'Drug name is required' },
      { status: 400 }
    );
  }

  try {
    const medication = await getMedicationDetails(drugName);
    
    if (!medication) {
      return NextResponse.json(
        { error: 'No medication found with that name' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(medication);
  } catch (error) {
    console.error('Error in medication details API route:', error);
    
    // Provide more specific error messages based on the error
    const errorMessage = error instanceof Error ? error.message : 'Failed to get medication details';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 