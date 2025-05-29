import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';
import { useAuth } from "@/hooks/useAuth";
import {
  Home, Lock, GraduationCap, FolderOpen, Sparkles, 
  Settings, LogOut, ChevronLeft, ChevronRight, 
  BrainCog, Users, HelpCircle, User
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

  // Navigation principale simplifiée
  const mainNavigation = [
    {
      icon: <Home />,
      label: "Accueil",
      href: "/",
      tooltip: "Hub d'accueil et guides",
      isActive: true
    },
    {
      icon: <GraduationCap />,
      label: "Université",
      href: "/universite",
      tooltip: "Centre de formation - Tous les cours",
      isActive: true,
      badge: "NOUVEAU"
    },
    {
      icon: <FolderOpen />,
      label: "Mon Coffre",
      href: "/coffre",
      tooltip: "Mes ressources, favoris et outputs IA",
      isActive: true,
      requiresAuth: true
    },
    {
      icon: <Sparkles />,
      label: "Outils IA",
      href: "/outils",
      tooltip: "Générateurs et assistants IA",
      isActive: true,
      premiumFeatures: true
    }
  ];

  // Navigation secondaire
  const secondaryNavigation = [
    {
      icon: <Users />,
      label: "Programme d'affiliation",
      href: "/affiliate",
      tooltip: "Gagnez de l'argent en recommandant DropSkills"
    }
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
    <aside className={`flex flex-col h-screen bg-black text-white transition-all duration-300 shadow-xl
      ${collapsed ? "w-20" : "w-64"} 
      hidden lg:flex
      fixed top-0 left-0 z-30
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
        <div className="space-y-1">
          {mainNavigation.map((item, index) => (
            <SidebarLink 
              key={item.label}
              collapsed={collapsed} 
              icon={item.icon} 
              label={item.label} 
              href={item.href}
              tooltip={item.tooltip}
              badge={item.badge}
              requiresAuth={item.requiresAuth}
              premiumFeatures={item.premiumFeatures}
              canAccessPremium={canAccessPremium}
              user={user}
              index={index}
            />
          ))}
        </div>

        {/* CTA Premium avec animation */}
        {!canAccessPremium && (
          <div className="mt-6 px-2">
            <SidebarCTA 
              collapsed={collapsed} 
              icon={<Lock />} 
              label="Débloquer Premium" 
              cta="Upgrade"
              href="/premium"
            />
          </div>
        )}

        {/* Divider animé */}
        <div className="my-6 px-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>

        {/* Navigation secondaire */}
        <div className="space-y-1">
          {secondaryNavigation.map((item, index) => (
            <SidebarLink 
              key={item.label}
              collapsed={collapsed} 
              icon={item.icon} 
              label={item.label} 
              href={item.href}
              tooltip={item.tooltip}
              index={index + 10}
            />
          ))}
        </div>
      </nav>

      {/* Footer avec animations */}
      <div className="mt-auto mb-4 flex flex-col gap-1 px-2 border-t border-gray-800 pt-4">
        <SidebarLink 
          collapsed={collapsed} 
          icon={<User />} 
          label="Mon Compte" 
          href="/compte"
          tooltip="Profil et paramètres"
          index={20}
        />
        
        <SidebarLink 
          collapsed={collapsed} 
          icon={<HelpCircle />} 
          label="Support" 
          href="/support"
          tooltip="Aide et documentation"
          index={21}
        />
        
        <SidebarLink 
          collapsed={collapsed} 
          icon={<Settings />} 
          label="Paramètres" 
          href="/parametres"
          tooltip="Configuration"
          index={22}
        />
        
        <button
          onClick={handleSignOut}
          className={`group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/50 transition-all duration-200 font-medium relative text-left w-full hover:scale-105`}
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-200" />
          {!collapsed && <span>Déconnexion</span>}
          {collapsed && (
            <span className="absolute left-20 bg-black text-white rounded px-2 py-1 shadow-lg text-xs opacity-0 group-hover:opacity-100 z-50 transition-all duration-200 whitespace-nowrap border border-gray-700">
              Déconnexion
            </span>
          )}
        </button>
        
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
  badge?: string;
  requiresAuth?: boolean;
  premiumFeatures?: boolean;
  canAccessPremium?: boolean;
  user?: any;
  index?: number;
}

function SidebarLink({ 
  icon, 
  label, 
  collapsed, 
  href = "#", 
  tooltip, 
  badge,
  requiresAuth = false,
  premiumFeatures = false,
  canAccessPremium = false,
  user,
  index = 0
}: SidebarLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Vérifier l'accès
  const hasAccess = !requiresAuth || user;
  const isPremiumLocked = premiumFeatures && !canAccessPremium;
  
  const content = (
    <div 
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium relative hover:scale-105 ${
        isPremiumLocked ? 'opacity-60' : ''
      } ${
        hasAccess ? 'hover:bg-[#ff0033]/10 hover:text-[#ff0033]' : 'hover:bg-gray-800'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`text-xl relative transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
        {icon}
        {isPremiumLocked && (
          <Lock size={12} className="absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
        )}
      </span>
      
      {!collapsed && (
        <span className="flex-1 transition-all duration-200">{label}</span>
      )}
      
      {!collapsed && badge && (
        <span className="bg-[#ff0033] text-white text-xs rounded-full px-2 py-1 font-bold animate-pulse">
          {badge}
        </span>
      )}
      
      {collapsed && (tooltip || label) && (
        <span className={`absolute left-20 bg-black text-white rounded px-2 py-1 shadow-lg text-xs transition-all duration-200 whitespace-nowrap border border-gray-700 z-50 ${
          isHovered ? 'opacity-100 translate-x-2' : 'opacity-0'
        }`}>
          {tooltip || label}
          {isPremiumLocked && " (Premium requis)"}
        </span>
      )}
    </div>
  );

  if (href === "#" || (!hasAccess && requiresAuth)) {
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
    <Link
      href={href}
      className={`flex items-center gap-2 bg-gradient-to-r from-[#ff0033] to-red-600 text-white font-semibold px-3 py-2 rounded-xl shadow-lg transition-all duration-200 hover:opacity-90 hover:shadow-xl ${
        collapsed ? 'justify-center' : ''
      }`}
    >
      <span className="transition-transform duration-200 hover:rotate-12">{icon}</span>
      {!collapsed && <span className="flex-1">{label}</span>}
      {!collapsed && (
        <span className="bg-black/20 text-xs rounded px-2 py-1">
          {cta}
        </span>
      )}
    </Link>
  );
} 