'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Activity
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
  { name: 'Packs', href: '/admin/packs', icon: Package },
  { name: 'Outils IA', href: '/admin/outils-ia', icon: Bot },
  { name: 'Support', href: '/admin/support', icon: MessageSquare },
  { name: 'Webhooks', href: '/admin/webhooks', icon: Webhook },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Logs Admin', href: '/admin/logs', icon: FileText },
  { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#111111] border-r border-[#232323] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#232323]">
        <h1 className="text-xl font-bold text-white">DropSkills Admin</h1>
        <div className="flex items-center gap-2 mt-2">
          <Shield className="w-4 h-4 text-[#ff0033]" />
          <span className="text-sm text-gray-400">{user.role}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#ff0033] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-[#232323]">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Activity className="w-4 h-4 text-green-500" />
          <span>Système opérationnel</span>
        </div>
      </div>
    </div>
  );
} 