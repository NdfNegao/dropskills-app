'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; // Encore en cours de chargement

    if (!session?.user?.email) {
      router.push('/admin/login');
      return;
    }

    // Vérifier si l'utilisateur a le rôle admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      router.push('/admin/login?error=unauthorized');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
          <span className="text-white">Chargement de l'administration...</span>
        </div>
      </div>
    );
  }

  if (!session?.user?.email || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  // Créer un objet user pour les composants
  const user = {
    id: session.user.id,
    role: session.user.role,
    firstName: session.user.firstName || null,
    lastName: session.user.lastName || null,
    email: session.user.email
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AdminSidebar user={user} />
      
      {/* Contenu principal avec marge adaptative */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <AdminHeader user={user} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 