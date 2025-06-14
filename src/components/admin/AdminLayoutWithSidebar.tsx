'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  Home, Users, Settings, LogOut, X,
  BarChart3, FileText, MessageSquare, Shield, Database,
  Zap, HelpCircle
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminPageLayout from './AdminPageLayout';

interface StatCardData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

interface ActionData {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  icon?: React.ReactNode;
  loading?: boolean;
}

interface AdminLayoutWithSidebarProps {
  // Props pour la page
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  stats?: StatCardData[];
  actions?: ActionData[] | React.ReactNode;
  children: React.ReactNode;
  // Props pour la sidebar
  sidebarClassName?: string;
}

export default function AdminLayoutWithSidebar({
  icon,
  title,
  subtitle,
  stats,
  actions,
  children,
  sidebarClassName
}: AdminLayoutWithSidebarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  // Navigation admin pour mobile
  const adminNavigation = [
    { icon: <BarChart3 />, label: "Tableau de bord", href: "/admin" },
    { icon: <Users />, label: "Utilisateurs", href: "/admin/utilisateurs" },
    { icon: <FileText />, label: "Produits", href: "/admin/produits" },
    { icon: <Zap />, label: "Outils IA", href: "/admin/outils" },
    { icon: <MessageSquare />, label: "Mentors IA", href: "/admin/ai-dashboard/mentors" },
    { icon: <MessageSquare />, label: "Prompts", href: "/admin/prompts" },
    { icon: <Database />, label: "Base de données", href: "/admin/database" },
    { icon: <Shield />, label: "Sécurité", href: "/admin/security" },
    { icon: <Settings />, label: "Configuration", href: "/admin/settings" },
    { icon: <HelpCircle />, label: "Documentation", href: "/admin/docs" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay pour mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Mobile Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-gray-900 text-white z-50 transform transition-transform duration-300 lg:hidden
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header mobile */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">
            <span className="text-blue-400">ADMIN</span> <span className="text-white">PANEL</span>
          </h1>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation mobile */}
        <nav className="flex-1 flex flex-col gap-1 px-4 py-4 overflow-y-auto">
          {adminNavigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition font-medium"
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer mobile */}
        <div className="mt-auto p-4 border-t border-gray-700">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition font-medium mb-2"
          >
            <Home className="w-5 h-5" />
            <span>Retour à l'app</span>
          </Link>
          
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleSignOut();
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/50 transition font-medium w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
          
          {user && (
            <div className="mt-3 text-center text-xs text-gray-400">
              Connecté en tant que {user.email}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Desktop */}
      <AdminSidebar 
        className={sidebarClassName}
        onCollapseChange={setSidebarCollapsed}
      />
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      } ml-0`}>
        {/* Header mobile avec bouton menu */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            <span className="text-blue-400">ADMIN</span> <span className="text-white">PANEL</span>
          </h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <AdminPageLayout
          icon={icon}
          title={title}
          subtitle={subtitle}
          stats={stats}
          actions={actions}
        >
          {children}
        </AdminPageLayout>
      </div>
    </div>
  );
}