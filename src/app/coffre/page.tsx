'use client';

import LayoutWithSidebar from '@/components/LayoutWithSidebar';

export default function CoffrePage() {
  return (
    <LayoutWithSidebar>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          Mon Coffre
        </h1>
        <p className="text-gray-300 text-lg">
          Accédez à tous vos produits achetés
        </p>
      </div>
    </LayoutWithSidebar>
  );
} 