import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';
import { useAuth } from "@/hooks/useAuth";
import {
  Home, Lock, GraduationCap, FolderOpen, Settings, LogOut, ChevronLeft, ChevronRight, Users, HelpCircle, User, MessageSquarePlus, Heart, Shield
} from "lucide-react";
import Crown from '@/components/ui/Crown';
import DollarConfetti from './DollarConfetti';

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
  const { user, canAccessPremium, isLoading, isAdmin } = useAuth();

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
    { icon: <Home />, label: "Accueil", href: "/dashboard", tooltip: "Accueil" },
    { icon: <GraduationCap />, label: "Centre de Formation", href: "/universite", tooltip: "Centre de formation" },
    { icon: <Heart />, label: "Favoris", href: "/favoris", tooltip: "Formations likées" },
    { icon: <FolderOpen />, label: "Outils IA", href: "/outils", tooltip: "Tous les outils IA" }
  ];

  // Section Aide & Personnalisation
  const helpNavigation = [
    { icon: <MessageSquarePlus />, label: "Proposer un outil", href: "/demandes", tooltip: "Proposer un outil ou une amélioration" }
  ];

  // Section compte et autres
  const accountNavigation = [
    { icon: <User />, label: "Mon Compte", href: "/compte", tooltip: "Profil et paramètres" },
    { icon: <Users />, label: "Affiliation", href: "/affiliate", tooltip: "Gagnez de l'argent en recommandant DropSkills" },
    { icon: <HelpCircle />, label: "Support", href: "/support", tooltip: "Aide et support" }
  ];

  // Section admin (uniquement pour cyril.iriebi@gmail.com)
  const adminNavigation = isAdmin ? [
    { icon: <Shield />, label: "Administration", href: "/admin", tooltip: "Panneau d'administration" }
  ] : [];

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

        {/* Section admin (si utilisateur admin) */}
        {isAdmin && (
          <>
            <div className="mb-2">
              {adminNavigation.map((item, idx) => (
                <SidebarLink
                  key={item.label}
                  collapsed={collapsed}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  tooltip={item.tooltip}
                  index={250 + idx}
                />
              ))}
            </div>
            
            {/* Séparateur */}
            <div className={`my-4 ${collapsed ? 'mx-2' : 'mx-2'}`}>
              <div className="h-px bg-gray-800"></div>
            </div>
          </>
        )}

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
  const [confetti, setConfetti] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setConfetti(true);
    // Laisser l'effet se jouer avant de naviguer (sauf si ctrl/cmd)
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setTimeout(() => {
        setConfetti(false);
        window.location.href = href;
      }, 700);
    }
  };

  if (collapsed) {
    // Affichage minimal : couronne blanche sur fond rouge
    return (
      <div className="relative flex items-center justify-center w-12 h-12 mx-auto my-2">
        <a href={href} onClick={handleClick} className="flex items-center justify-center w-12 h-12 rounded-full bg-[#ff0033] shadow-lg hover:scale-110 transition-transform">
          <Crown size="lg" color="white" />
        </a>
        <DollarConfetti trigger={confetti} onComplete={() => setConfetti(false)} />
      </div>
    );
  }
  // Bloc complet en mode étendu
  return (
    <div className="relative">
      <div className={`relative bg-gradient-to-br from-[#18181b] to-[#232323] rounded-xl p-4 shadow-lg border border-[#232323] flex flex-col items-start justify-between w-full mb-2`}> 
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl text-[#ff0033]">{icon}</span>
          <span className="font-bold text-white text-[14px]">Débloquez Premium</span>
        </div>
        <span className="text-white text-[12px] mb-4 block opacity-80">Passez à la version premium pour débloquer tout le contenu et les outils.</span>
        <a href={href} onClick={handleClick} className="w-full">
          <button type="button" className="w-full flex items-center justify-center gap-2 bg-[#ff0033] hover:bg-[#cc0029] text-white py-2.5 rounded-lg font-semibold text-base transition-all duration-200 shadow-md">
            Go Premium <span className="ml-1">→</span>
          </button>
        </a>
        {/* Effet de lumière */}
        <span className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full blur-sm animate-pulse" />
        <span className="absolute top-6 right-8 w-1.5 h-1.5 bg-white/20 rounded-full blur-sm animate-pulse" />
        <span className="absolute top-8 right-4 w-1 h-1 bg-white/10 rounded-full blur-sm animate-pulse" />
      </div>
      <DollarConfetti trigger={confetti} onComplete={() => setConfetti(false)} />
    </div>
  );
}