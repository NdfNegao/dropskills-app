'use client';

import LayoutWithSidebar from '@/components/LayoutWithSidebar';

export default function CataloguePage() {
  return (
    <LayoutWithSidebar>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          Catalogue
        </h1>
        <p className="text-gray-300 text-lg">
          Découvrez tous nos produits digitaux
        </p>
      </div>
    </LayoutWithSidebar>
  );
} 