'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TitrePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers la nouvelle route
    router.replace('/outils/titres');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033] mx-auto mb-4"></div>
        <p className="text-white">Redirection vers Générateur de Titres...</p>
      </div>
    </div>
  );
} 