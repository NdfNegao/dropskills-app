'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useState, useEffect } from 'react';

const ADMIN_EMAIL = "cyril.iriebi@gmail.com";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    // Vérifie juste l'email
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
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

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#ff0033] mb-4">Tu es un petit malin…</h2>
          <p className="text-white text-lg mb-2">Mais non, tu n'auras pas accès à l'administration 😏</p>
          <a href="/" className="text-[#ff0033] underline hover:opacity-80">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  // Créer un objet user pour les composants
  const user = {
    id: session.user.id,
    role: session.user.role,
    firstName: session.user.firstName || null,
    lastName: session.user.lastName || null,
    email: session.user.email
  };

  // DEBUG TEMPORAIRE : Affichage de la session
  console.log('SESSION ADMIN', session);

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