import DrugPageClient from './client';

export default async function DrugPage({ params }: { params: { drugName: string } }) {
  // In Next.js 15, we need to await the params object
  const resolvedParams = await params;
  console.log('Drug page params:', resolvedParams);
  
  // Make sure the drugName is properly decoded
  const drugName = resolvedParams.drugName;
  console.log('Drug name from params:', drugName);
  
  return <DrugPageClient drugName={drugName} />;
} 