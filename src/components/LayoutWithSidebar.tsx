'use client';

import React, { useState } from 'react';
import DropskillsSidebar from './DropskillsSidebar';
import { useUserDataAPI } from '@/hooks/useUserData';

interface LayoutWithSidebarProps {
  children: React.ReactNode;
  userId?: string;
  showSidebar?: boolean;
}

export default function LayoutWithSidebar({ 
  children, 
  userId,
  showSidebar = true 
}: LayoutWithSidebarProps) {
  const { userData, loading } = useUserDataAPI(userId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <DropskillsSidebar 
        isPremium={userData?.isPremium || false}
        userPacksCount={userData?.userPacksCount || 0}
        onCollapseChange={setSidebarCollapsed}
      />
      
      {/* Contenu principal avec marge adaptative */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-6`}>
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
              <span className="ml-2 text-gray-300">Chargement...</span>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}

// Hook pour récupérer l'utilisateur connecté (à adapter selon votre auth)
export function useCurrentUser() {
  // TODO: Remplacer par votre logique d'authentification
  // Exemple avec NextAuth:
  // const { data: session } = useSession();
  // return session?.user?.id;
  
  // Pour l'instant, retourne un ID de test
  return "user-test-id";
} 