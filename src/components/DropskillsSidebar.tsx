import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';
import { useAuth } from "@/hooks/useAuth";
import {
  Home, Lock, GraduationCap, FolderOpen, Sparkles, 
  Settings, LogOut, ChevronLeft, ChevronRight, 
  BrainCog, Users, HelpCircle, User, Rocket, FolderKanban, Mail, CalendarCheck, Target, MessageSquarePlus, PenTool, FileText, BookOpen, Calculator, Eye
} from "lucide-react";

interface DropskillsSidebarProps {
  className?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function DropskillsSidebar({ 
  className = "",
  onCollapseChange
}: DropskillsSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { user, canAccessPremium, isLoading } = useAuth();

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapseChange?.(value);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  // Nouvelle organisation de la sidebar
  const mainNavigation = [
    { icon: <Home />, label: "Accueil", href: "/", tooltip: "Accueil" },
    { icon: <FolderOpen />, label: "Catalogue", href: "/catalogue", tooltip: "Catalogue IA" },
    { icon: <GraduationCap />, label: "Université", href: "/universite", tooltip: "Centre de formation" },
    { icon: <FolderOpen />, label: "Mon Coffre", href: "/coffre", tooltip: "Mes ressources IA" },
    { icon: <Sparkles />, label: "Outils IA", href: "/outils", tooltip: "Tous les outils IA" }
  ];

  // Outils IA Dropskills (menu déroulant)
  const iaTools = [
    { icon: <BrainCog />, label: "ICP Maker", href: "/outils/icp-maker" },
    { icon: <Rocket />, label: "USP Maker", href: "/outils/usp-maker" },
    { icon: <Sparkles />, label: "Générateur d'Offre", href: "/outils/generateur-offre" },
    { icon: <FolderKanban />, label: "Tunnel Maker IA", href: "/outils/tunnel-maker" },
    { icon: <Mail />, label: "CopyMoneyMail", href: "/outils/copymoneymail" },
    { icon: <Users />, label: "Lead Magnet Creator", href: "/outils/lead-magnet" },
    { icon: <CalendarCheck />, label: "Content System 90J", href: "/outils/content-system" },
    { icon: <PenTool />, label: "Générateur de Titres", href: "/outils/titres" },
    { icon: <FileText />, label: "Générateur de Descriptions", href: "/outils/descriptions" },
    { icon: <BookOpen />, label: "PDF Rebrander", href: "/outils/pdf-rebrander" },
    { icon: <Calculator />, label: "Calculateur ROI", href: "/outils/calculateur" },
    { icon: <Eye />, label: "Agent Veille IA", href: "/outils/agent-veille" }
  ];

  // Section Aide & Personnalisation
  const helpNavigation = [
    { icon: <HelpCircle />, label: "Tutoriels", href: "/tutoriels", tooltip: "Guides et tutoriels" },
    { icon: <MessageSquarePlus />, label: "Demandes de Produits", href: "/demandes", tooltip: "Proposer un outil ou une amélioration" }
  ];

  // Section compte et autres
  const accountNavigation = [
    { icon: <User />, label: "Mon Compte", href: "/compte", tooltip: "Profil et paramètres" },
    { icon: <Users />, label: "Programme d'affiliation", href: "/affiliate", tooltip: "Gagnez de l'argent en recommandant DropSkills" },
    { icon: <HelpCircle />, label: "Support", href: "/support", tooltip: "Aide et support" },
    { icon: <Settings />, label: "Paramètres", href: "/parametres", tooltip: "Configuration" }
  ];

  if (isLoading) {
    return (
      <aside className={`flex flex-col h-screen bg-black text-white transition-all duration-300 shadow-xl
        w-64 hidden lg:flex fixed top-0 left-0 z-30 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`flex flex-col h-screen bg-black text-white shadow-xl
      ${collapsed ? "w-20" : "w-64"} 
      hidden lg:flex
      fixed top-0 left-0 z-30
      transition-all duration-300
      ${className}
      `}>
      
      {/* Logo & collapse button avec animation */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
        <Link href="/" className={`text-2xl font-extrabold transition-all duration-300 hover:scale-105 ${collapsed ? "hidden" : "block"}`}>
          DROP <span className="text-[#ff0033]">SKILLS</span>
        </Link>
        <button 
          onClick={() => handleCollapse(!collapsed)} 
          className="text-neutral-400 hover:text-[#ff0033] transition-all duration-200 hover:scale-110 hover:rotate-180"
          aria-label={collapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Badge utilisateur avec animation */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#ff0033]/10 to-transparent p-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
              {user.role === 'PREMIUM' && '👑 Premium'}
              {user.role === 'ADMIN' && '🛡️ Admin'}
              {user.role === 'SUPER_ADMIN' && '⚡ Super Admin'}
              {user.role === 'USER' && '🌟 Membre'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation principale */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
        {/* Menu principal */}
        <div className="space-y-1">
          {mainNavigation.map((item, index) => (
            <SidebarLink 
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

        {/* Bouton Débloquer Premium */}
        {!canAccessPremium && (
          <div className="mt-4 px-2">
            <SidebarCTA 
              collapsed={collapsed} 
              icon={<Lock />} 
              label="Débloquer Premium" 
              cta="Upgrade"
              href="/premium"
            />
          </div>
        )}

        {/* Séparateur */}
        <div className={`my-4 ${collapsed ? 'mx-2' : 'mx-2'}`}>
          <div className="h-px bg-gray-800"></div>
        </div>

        {/* Section Aide & Personnalisation */}
        <div className="mb-2">
          <div className="space-y-1">
            {helpNavigation.map((item, idx) => (
              <SidebarLink
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
          <div className="h-px bg-gray-800"></div>
        </div>

        {/* Section compte et autres */}
        <div className="mb-2">
          {accountNavigation.map((item, idx) => (
            <SidebarLink
              key={item.label}
              collapsed={collapsed}
              icon={item.icon}
              label={item.label}
              href={item.href}
              tooltip={item.tooltip}
              index={300 + idx}
            />
          ))}
          <button
            onClick={handleSignOut}
            className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium relative text-left w-full hover:scale-105 mt-2 hover:bg-[#1a1a1a]`}
          >
            <LogOut size={20} className="transition-transform duration-200 group-hover:rotate-12 group-hover:text-[#ff0033]" />
            {!collapsed && <span className="group-hover:text-[#ff0033]">Déconnexion</span>}
            {collapsed && (
              <span className="absolute left-20 bg-black text-white rounded px-2 py-1 shadow-lg text-xs opacity-0 group-hover:opacity-100 z-50 transition-all duration-200 whitespace-nowrap border border-gray-700">
                Déconnexion
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Footer avec animations */}
      <div className="mt-auto mb-4 flex flex-col gap-1 px-2 border-t border-gray-800 pt-4">
        {!collapsed && (
          <div className="text-xs text-neutral-600 mt-2 px-2 text-center animate-fade-in">
            © {new Date().getFullYear()} Dropskills
          </div>
        )}
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  href?: string;
  tooltip?: string;
  index?: number;
}

function SidebarLink({ 
  icon, 
  label, 
  collapsed, 
  href = "#", 
  tooltip, 
  index = 0
}: SidebarLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const content = (
    <div 
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium relative hover:scale-105`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`text-xl w-5 h-5 flex items-center justify-center relative transition-all duration-200 ${isHovered ? 'scale-110' : ''} group-hover:text-[#ff0033]`}>
        {icon}
      </span>
      {!collapsed && (
        <span className="flex-1 transition-all duration-200 group-hover:text-[#ff0033]">{label}</span>
      )}
      {collapsed && (tooltip || label) && (
        <span className={`absolute left-20 bg-black text-white rounded px-2 py-1 shadow-lg text-xs transition-all duration-200 whitespace-nowrap border border-gray-700 z-50 ${isHovered ? 'opacity-100 translate-x-2' : 'opacity-0'}`}>{tooltip || label}</span>
      )}
    </div>
  );
  if (href === "#") {
    return <div className="cursor-not-allowed">{content}</div>;
  }
  return <Link href={href}>{content}</Link>;
}

interface SidebarCTAProps {
  icon: React.ReactNode;
  label: string;
  cta: string;
  collapsed: boolean;
  href: string;
}

function SidebarCTA({ icon, label, cta, collapsed, href }: SidebarCTAProps) {
  return (
    <div className={`relative bg-gradient-to-br from-[#18181b] to-[#232323] rounded-xl p-4 shadow-lg border border-[#232323] flex flex-col items-start justify-between w-full mb-2`}> 
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl text-[#ff0033]">{icon}</span>
        <span className="font-bold text-white text-lg">Unlock Full Library</span>
      </div>
      <span className="text-white text-sm mb-4 block opacity-80">Upgrade to access all premium content and tools.</span>
      <Link href={href} className="w-full">
        <button className="w-full flex items-center justify-center gap-2 bg-[#ff0033] hover:bg-[#cc0029] text-white py-2.5 rounded-lg font-semibold text-base transition-all duration-200 shadow-md">
          Upgrade Now <span className="ml-1">→</span>
        </button>
      </Link>
      {/* Effet de lumière */}
      <span className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full blur-sm animate-pulse" />
      <span className="absolute top-6 right-8 w-1.5 h-1.5 bg-white/20 rounded-full blur-sm animate-pulse" />
      <span className="absolute top-8 right-4 w-1 h-1 bg-white/10 rounded-full blur-sm animate-pulse" />
    </div>
  );
} 