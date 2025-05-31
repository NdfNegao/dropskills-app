'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Users, Bot, FileText, LogOut, BarChart3, Settings, 
  Activity, TrendingUp
} from 'lucide-react';
import Notifications from './Notifications';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier le cookie admin
    const adminCookie = document.cookie.split('; ').find(row => row.startsWith('admin='));
    if (!adminCookie || adminCookie.split('=')[1] !== 'ok') {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'admin=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
    { href: '/admin/outils', label: 'Outils IA', icon: Bot },
    { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/admin/logs', label: 'Logs Admin', icon: FileText },
    { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-[#232323] p-6 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-8">Admin Panel</h2>
        
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#ff0033] text-white' 
                    : 'hover:bg-[#1a1a1a] text-gray-300'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a] text-gray-300 w-full"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Notifications */}
      <Notifications />
    </div>
  );
} 