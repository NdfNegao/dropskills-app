'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Bot, 
  MessageSquare, 
  Webhook, 
  BarChart3, 
  Settings, 
  FileText,
  Shield,
  Activity,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  UserCheck
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    id: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
  { name: 'Affiliés', href: '/admin/affiliates', icon: UserCheck },
  { name: 'Packs', href: '/admin/packs', icon: Package },
  { name: 'Outils IA', href: '/admin/outils-ia', icon: Bot },
  { name: 'Prompts IA', href: '/admin/prompts', icon: BrainCircuit },
  { name: 'Support', href: '/admin/support', icon: MessageSquare },
  { name: 'Webhooks', href: '/admin/webhooks', icon: Webhook },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Logs Admin', href: '/admin/logs', icon: FileText },
  { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-black text-white transition-all duration-300 shadow-xl flex flex-col h-screen
      ${collapsed ? "w-20" : "w-64"} 
      fixed top-0 left-0 z-30 border-r border-[#232323]
    `}>
      {/* Header avec logo et bouton collapse */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#232323]">
        <Link href="/admin" className={`text-2xl font-extrabold transition-all duration-200 ${collapsed ? "hidden" : "block"}`}>
          DROP<span className="text-[#ff0033]">SKILLS</span>
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-gray-400 hover:text-[#ff0033] transition-colors"
          aria-label={collapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Badge Admin */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-[#232323]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#ff0033]" />
            <span className="text-sm text-gray-400 uppercase tracking-wide font-semibold">ADMIN</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                isActive
                  ? 'bg-[#ff0033] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.name}</span>}
              
              {/* Tooltip pour mode collapsed */}
              {collapsed && (
                <span className="absolute left-20 bg-black text-white rounded px-2 py-1 shadow-lg text-xs opacity-0 group-hover:opacity-100 z-50 transition whitespace-nowrap border border-gray-700">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status et utilisateur */}
      <div className="p-4 border-t border-[#232323] space-y-3">
        {/* Status système */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Activity className="w-4 h-4 text-green-500" />
          {!collapsed && <span>Système opérationnel</span>}
        </div>
        
        {/* Info utilisateur */}
        {!collapsed && (
          <div className="bg-[#111111] rounded-lg p-3 border border-[#232323]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ff0033] flex items-center justify-center text-white font-bold text-sm">
                {user.firstName?.[0] || user.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.email
                  }
                </p>
                <p className="text-xs text-gray-400 truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 