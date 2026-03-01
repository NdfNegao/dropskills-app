import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';
import { useAuth } from "@/hooks/useAuth";
import {
  Home, Lock, GraduationCap, FolderOpen, LogOut, ChevronLeft, ChevronRight, Users, HelpCircle, User, MessageSquarePlus, Heart, Shield, Gift
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
  const { canAccessPremium, isLoading, isAdmin } = useAuth();

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapseChange?.(value);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  const mainNavigation = [
    { icon: <Home size={18} />, label: "Accueil", href: "/dashboard", tooltip: "Accueil" },
    { icon: <GraduationCap size={18} />, label: "Centre de Formation", href: "/universite", tooltip: "Centre de formation" },
    { icon: <Heart size={18} />, label: "Favoris", href: "/favoris", tooltip: "Formations likées" },
    { icon: <FolderOpen size={18} />, label: "Outils IA", href: "/outils", tooltip: "Tous les outils IA" },
    { icon: <MessageSquarePlus size={18} />, label: "Mentors IA", href: "/ai-mentor", tooltip: "Mentors IA personnalisés" }
  ];

  const helpNavigation = [
    { icon: <MessageSquarePlus size={18} />, label: "Proposer un outil", href: "/demandes", tooltip: "Proposer un outil ou une amélioration" }
  ];

  const accountNavigation = [
    { icon: <User size={18} />, label: "Mon Compte", href: "/compte", tooltip: "Profil et paramètres" },
    { icon: <Users size={18} />, label: "Affiliation", href: "/affiliate", tooltip: "Gagnez de l'argent en recommandant DropSkills" },
    { icon: <Gift size={18} />, label: "Parrainage", href: "/gift", tooltip: "Programme de parrainage" },
    { icon: <HelpCircle size={18} />, label: "Support", href: "/support", tooltip: "Aide et support" }
  ];

  const adminNavigation = isAdmin ? [
    { icon: <Shield size={18} />, label: "Administration", href: "/admin", tooltip: "Panneau d'administration" }
  ] : [];

  if (isLoading) {
    return (
      <aside className={`flex flex-col h-screen bg-background text-foreground transition-all duration-300 border-r border-border
        w-64 hidden lg:flex fixed top-0 left-0 z-30 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`flex flex-col h-screen bg-background text-foreground border-r border-border
      ${collapsed ? "w-[72px]" : "w-64"} 
      hidden lg:flex
      fixed top-0 left-0 z-30
      transition-all duration-300
      ${className}
      `}>
      
      {/* Logo & collapse button */}
      <div className={`flex items-center border-b border-border ${collapsed ? 'justify-center px-3 py-4' : 'justify-between px-4 py-4'}`}>
        {!collapsed && (
          <Link href="/dashboard" className="transition-all duration-200 hover:opacity-80">
            <div className="text-xl font-extrabold tracking-tight">
              DROP<span className="text-primary">SKILLS</span>
            </div>
            <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mt-0.5">
              beta
            </div>
          </Link>
        )}
        <button 
          onClick={() => handleCollapse(!collapsed)} 
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background-secondary transition-all duration-200"
          aria-label={collapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-2 py-3 overflow-y-auto">
        
        {/* Section Navigation principale */}
        <SidebarSection label="Navigation" collapsed={collapsed} />
        <div className="space-y-0.5">
          {mainNavigation.map((item) => (
            <SidebarLink 
              key={item.label}
              collapsed={collapsed} 
              icon={item.icon} 
              label={item.label} 
              href={item.href}
              tooltip={item.tooltip}
            />
          ))}
        </div>

        {/* CTA Premium */}
        {!canAccessPremium && (
          <div className="mt-3 mb-1">
            <SidebarCTA 
              collapsed={collapsed} 
              icon={<Lock size={16} />} 
              label="Débloquer Premium" 
              cta="Upgrade"
              href="/premium"
            />
          </div>
        )}

        {/* Section Aide */}
        <SidebarSection label="Aide" collapsed={collapsed} />
        <div className="space-y-0.5">
          {helpNavigation.map((item) => (
            <SidebarLink
              key={item.label}
              collapsed={collapsed}
              icon={item.icon}
              label={item.label}
              href={item.href}
              tooltip={item.tooltip}
            />
          ))}
        </div>

        {/* Section Admin (si admin) */}
        {isAdmin && (
          <>
            <SidebarSection label="Admin" collapsed={collapsed} />
            <div className="space-y-0.5">
              {adminNavigation.map((item) => (
                <SidebarLink
                  key={item.label}
                  collapsed={collapsed}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  tooltip={item.tooltip}
                />
              ))}
            </div>
          </>
        )}

        {/* Section Compte */}
        <SidebarSection label="Compte" collapsed={collapsed} />
        <div className="space-y-0.5">
          {accountNavigation.map((item) => (
            <SidebarLink
              key={item.label}
              collapsed={collapsed}
              icon={item.icon}
              label={item.label}
              href={item.href}
              tooltip={item.tooltip}
            />
          ))}
        </div>

        {/* Déconnexion */}
        <div className="mt-1">
          <SignOutButton collapsed={collapsed} onSignOut={handleSignOut} />
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-border">
          <div className="text-[10px] text-muted-foreground/50 text-center">
            © {new Date().getFullYear()} Dropskills
          </div>
        </div>
      )}
    </aside>
  );
}

// ===== SUB-COMPONENTS =====

interface SidebarSectionProps {
  label: string;
  collapsed: boolean;
}

function SidebarSection({ label, collapsed }: SidebarSectionProps) {
  if (collapsed) {
    return <div className="my-3 h-px bg-border mx-1" />;
  }
  return (
    <div className="px-2 pt-4 pb-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
        {label}
      </span>
    </div>
  );
}

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  href?: string;
  tooltip?: string;
}

function SidebarLink({ 
  icon, 
  label, 
  collapsed, 
  href = "#", 
  tooltip
}: SidebarLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const isActive = href !== "#" && (pathname === href || pathname.startsWith(href + '/'));

  if (href === "#") return null;

  return (
    <Link href={href}>
      <div 
        className={`
          flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-150 relative cursor-pointer
          ${isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:bg-background-secondary hover:text-foreground'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${isActive ? 'text-primary' : ''}`}>
          {icon}
        </span>
        {!collapsed && (
          <span className="flex-1 text-sm font-medium">{label}</span>
        )}
        {isActive && !collapsed && (
          <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto flex-shrink-0" />
        )}
        {/* Tooltip en mode réduit */}
        {collapsed && isHovered && (
          <span 
            className="absolute left-14 px-2 py-1 rounded-md text-xs font-medium z-50 whitespace-nowrap shadow-lg"
            style={{ 
              backgroundColor: 'var(--card)', 
              color: 'var(--foreground)', 
              border: '1px solid var(--border)' 
            }}
          >
            {tooltip || label}
          </span>
        )}
      </div>
    </Link>
  );
}

interface SignOutButtonProps {
  collapsed: boolean;
  onSignOut: () => void;
}

function SignOutButton({ collapsed, onSignOut }: SignOutButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onSignOut}
      className={`
        flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-150 relative w-full text-left
        text-muted-foreground hover:bg-red-500/10 hover:text-red-500
        ${collapsed ? 'justify-center' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LogOut size={18} className="flex-shrink-0" />
      {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
      {collapsed && isHovered && (
        <span 
          className="absolute left-14 px-2 py-1 rounded-md text-xs font-medium z-50 whitespace-nowrap shadow-lg"
          style={{ 
            backgroundColor: 'var(--card)', 
            color: 'var(--foreground)', 
            border: '1px solid var(--border)' 
          }}
        >
          Déconnexion
        </span>
      )}
    </button>
  );
}

interface SidebarCTAProps {
  icon: React.ReactNode;
  label: string;
  cta: string;
  collapsed: boolean;
  href: string;
}

function SidebarCTA({ icon, collapsed, href }: SidebarCTAProps) {
  const [confetti, setConfetti] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setConfetti(true);
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setTimeout(() => {
        setConfetti(false);
        window.location.href = href;
      }, 700);
    }
  };

  if (collapsed) {
    return (
      <div className="relative flex items-center justify-center">
        <a 
          href={href} 
          onClick={handleClick} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-md hover:bg-primary-hover transition-colors"
        >
          <Crown size="sm" color="white" />
        </a>
        <DollarConfetti trigger={confetti} onComplete={() => setConfetti(false)} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-card rounded-xl p-3.5 border border-border">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-primary">{icon}</span>
          <span className="font-semibold text-foreground text-sm">Premium</span>
        </div>
        <p className="text-muted-foreground text-xs mb-3 leading-relaxed">
          Débloquez tout le contenu et les outils IA.
        </p>
        <a href={href} onClick={handleClick} className="block">
          <button 
            type="button" 
            className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            <Crown size="sm" color="white" />
            Go Premium
          </button>
        </a>
      </div>
      <DollarConfetti trigger={confetti} onComplete={() => setConfetti(false)} />
    </div>
  );
}
