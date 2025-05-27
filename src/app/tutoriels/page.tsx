'use client';

import LayoutWithSidebar from '@/components/LayoutWithSidebar';

export default function TutorielsPage() {
  return (
    <LayoutWithSidebar>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          Tutoriels
        </h1>
        <p className="text-gray-300 text-lg">
          Apprenez à utiliser nos produits et outils
        </p>
      </div>
    </LayoutWithSidebar>
  );
} 