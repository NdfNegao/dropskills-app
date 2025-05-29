'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TutorielsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers la nouvelle page tutoriels
    router.replace('/tutoriels');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033] mx-auto mb-4"></div>
        <p className="text-gray-400">Redirection en cours...</p>
      </div>
    </div>
  );
} 