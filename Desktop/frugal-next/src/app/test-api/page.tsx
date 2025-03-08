'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestApiRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/api-test');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Redirecting to API Test Page...</h1>
      <p>If you are not redirected automatically, <a href="/api-test" className="text-blue-500 hover:underline">click here</a>.</p>
    </div>
  );
} 