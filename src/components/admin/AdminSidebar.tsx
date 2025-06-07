'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';
import { useAuth } from "@/hooks/useAuth";
import {
  Home, Users, Settings, LogOut, ChevronLeft, ChevronRight, 
  BarChart3, FileText, MessageSquare, Shield, Database,
  Zap, Crown, HelpCircle, TrendingUp, Wrench, UserCheck,
  Package, MessageCircle, HeadphonesIcon, Brain, Gift
} from "lucide-react";

interface AdminSidebarProps {
  className?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function AdminSidebar({ 
  className = "",
  onCollapseChange
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapseChange?.(value);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  // Navigation principale admin
  const adminNavigation = [
    { icon: <BarChart3 />, label: "Tableau de bord", href: "/admin", tooltip: "Vue d'ensemble" },
    { icon: <TrendingUp />, label: "Analytics", href: "/admin/analytics", tooltip: "Analyses et statistiques" },
    { icon: <Users />, label: "Utilisateurs", href: "/admin/utilisateurs", tooltip: "Gestion des utilisateurs" },
    { icon: <FileText />, label: "Produits", href: "/admin/produits", tooltip: "Gestion des produits" },
    { icon: <Package />, label: "Packs", href: "/admin/packs", tooltip: "Gestion des packs" },
    { icon: <Zap />, label: "Outils IA", href: "/admin/outils", tooltip: "Gestion des outils IA" },
    { icon: <Brain />, label: "Dashboard IA", href: "/admin/ai-dashboard", tooltip: "Dashboard des outils IA" },
    { icon: <Brain />, label: "Config Providers", href: "/admin/ai-config", tooltip: "Configuration des providers IA" },
    { icon: <MessageSquare />, label: "Prompts", href: "/admin/prompts", tooltip: "Gestion des prompts" },
    { icon: <UserCheck />, label: "Affiliés", href: "/admin/affiliates", tooltip: "Gestion des affiliés" },
    { icon: <Gift />, label: "Parrainage", href: "/admin/sponsorship", tooltip: "Gestion du parrainage" },
    { icon: <MessageCircle />, label: "Demandes produits", href: "/admin/product-requests", tooltip: "Demandes de produits" },
    { icon: <HeadphonesIcon />, label: "Support", href: "/admin/support", tooltip: "Support client" },
    { icon: <Database />, label: "Base de données", href: "/admin/database", tooltip: "Gestion de la base de données" }
  ];

  // Navigation système (super admin uniquement)
  const systemNavigation = [
    { icon: <Shield />, label: "Sécurité", href: "/admin/security", tooltip: "Paramètres de sécurité" },
    { icon: <Settings />, label: "Configuration", href: "/admin/settings", tooltip: "Configuration système" }
  ];

  // Navigation aide
  const helpNavigation = [
    { icon: <HelpCircle />, label: "Documentation", href: "/admin/docs", tooltip: "Documentation admin" }
  ];

  if (isLoading) {
    return (
      <aside className={`flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 shadow-xl
        w-64 hidden lg:flex fixed top-0 left-0 z-30 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </aside>
    );
  }

  // Vérification simple de l'email admin
  if (!user || user.email !== 'cyril.iriebi@gmail.com') {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p className="text-gray-400 mb-4">Cette page est réservée à l'administrateur.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#ff0033] text-white px-6 py-2 rounded-lg hover:bg-[#cc0029] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className={`flex flex-col h-screen bg-gray-900 text-white shadow-xl
      ${collapsed ? "w-20" : "w-64"} 
      hidden lg:flex
      fixed top-0 left-0 z-30
      transition-all duration-300
      ${className}
      `}>
      
      {/* Logo & collapse button */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
        <Link href="/admin" className={`text-2xl font-extrabold transition-all duration-300 hover:scale-105 ${collapsed ? "hidden" : "block"}`}>
          <span className="text-blue-400">ADMIN</span> <span className="text-white">PANEL</span>
        </Link>
        <button 
          onClick={() => handleCollapse(!collapsed)} 
          className="text-gray-400 hover:text-blue-400 transition-all duration-200 hover:scale-110 hover:rotate-180"
          aria-label={collapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
        {/* Menu principal */}
        <div className="space-y-1">
          {adminNavigation.map((item, index) => (
            <AdminSidebarLink 
              key={item.label}
              collapsed={collapsed} 
              icon={item.icon} 
              label={item.label} 
              href={item.href}
              tooltip={item.tooltip}
              index={index}
            />
          ))}
        </div>

        {/* Séparateur */}
        <div className={`my-4 ${collapsed ? 'mx-2' : 'mx-2'}`}>
          <div className="h-px bg-gray-700"></div>
        </div>

        {/* Section Système */}
        <div className="mb-2">
          <div className="space-y-1">
            {systemNavigation.map((item, idx) => (
              <AdminSidebarLink
                key={item.label}
                collapsed={collapsed}
                icon={item.icon}
                label={item.label}
                href={item.href}
                tooltip={item.tooltip}
                index={200 + idx}
              />
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className={`my-4 ${collapsed ? 'mx-2' : 'mx-2'}`}>
          <div className="h-px bg-gray-700"></div>
        </div>

        {/* Section Aide */}
        <div className="mb-2">
          {helpNavigation.map((item, idx) => (
            <AdminSidebarLink
              key={item.label}
              collapsed={collapsed}
              icon={item.icon}
              label={item.label}
              href={item.href}
              tooltip={item.tooltip}
              index={300 + idx}
            />
          ))}
        </div>

        {/* Retour à l'app principale */}
        <div className="mt-4">
          <AdminSidebarLink
            collapsed={collapsed}
            icon={<Home />}
            label="Retour à l'app"
            href="/dashboard"
            tooltip="Retourner à l'application principale"
            index={400}
          />
        </div>

        {/* Déconnexion */}
        <div className="mt-2">
          <button
            onClick={handleSignOut}
            className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium relative text-left w-full hover:scale-105 hover:bg-gray-800`}
          >
            <LogOut size={20} className="transition-transform duration-200 group-hover:rotate-12 group-hover:text-red-400" />
            {!collapsed && <span className="group-hover:text-red-400">Déconnexion</span>}
            {collapsed && (
              <span className="absolute left-20 bg-gray-800 text-white rounded px-2 py-1 shadow-lg text-xs opacity-0 group-hover:opacity-100 z-50 transition-all duration-200 whitespace-nowrap border border-gray-600">
                Déconnexion
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto mb-4 flex flex-col gap-1 px-2 border-t border-gray-700 pt-4">
        {!collapsed && (
          <div className="text-xs text-gray-500 mt-2 px-2 text-center">
            Admin Panel v1.0
          </div>
        )}
      </div>
    </aside>
  );
}

interface AdminSidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  href?: string;
  tooltip?: string;
  index?: number;
}

function AdminSidebarLink({ 
  icon, 
  label, 
  collapsed, 
  href = "#", 
  tooltip, 
  index = 0
}: AdminSidebarLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const content = (
    <div 
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium relative hover:scale-105 hover:bg-gray-800`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`text-xl w-5 h-5 flex items-center justify-center relative transition-all duration-200 ${isHovered ? 'scale-110' : ''} group-hover:text-blue-400`}>
        {icon}
      </span>
      {!collapsed && (
        <span className="flex-1 transition-all duration-200 group-hover:text-blue-400">{label}</span>
      )}
      {collapsed && (tooltip || label) && (
        <span className={`absolute left-20 bg-gray-800 text-white rounded px-2 py-1 shadow-lg text-xs transition-all duration-200 whitespace-nowrap border border-gray-600 z-50 ${isHovered ? 'opacity-100 translate-x-2' : 'opacity-0'}`}>{tooltip || label}</span>
      )}
    </div>
  );
  
  if (href === "#") {
    return <div className="cursor-not-allowed">{content}</div>;
  }
  
  return <Link href={href}>{content}</Link>;
}