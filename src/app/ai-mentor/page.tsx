'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AIMentorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers le master mentor
    router.replace('/ai-mentor/master-mentor');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers votre mentor...</p>
      </div>
    </div>
  );
}