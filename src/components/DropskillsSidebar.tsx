import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home, Lock, BookOpen, User, Settings, LogOut, 
  Sparkles, BrainCog, Rocket, FolderKanban, Mail, 
  CalendarCheck, LineChart, GraduationCap, ChevronLeft, ChevronRight,
  Target, Zap
} from "lucide-react";

// Outils IA mappés sur votre schéma V2 (6 outils comme demandé)
const IA_TOOLS = [
  { 
    icon: <BrainCog />, 
    label: "ICP Maker", 
    href: "/outils/icp-maker",
    type: "GENERATOR" 
  },
  { 
    icon: <Rocket />, 
    label: "Générateur d'Offre", 
    href: "/outils/generateur-offre",
    type: "GENERATOR" 
  },
  { 
    icon: <FolderKanban />, 
    label: "Tunnel de Vente IA", 
    href: "/outils/tunnel-vente",
    type: "ASSISTANT" 
  },
  { 
    icon: <Mail />, 
    label: "CopyMoneyMail", 
    href: "/outils/copy-money-mail",
    type: "OPTIMIZER" 
  },
  { 
    icon: <CalendarCheck />, 
    label: "Content System 90J", 
    href: "/outils/content-system",
    type: "ANALYZER" 
  },
  { 
    icon: <Target />, 
    label: "Lead Magnet Creator", 
    href: "/outils/lead-magnet",
    type: "GENERATOR" 
  },
];

interface DropskillsSidebarProps {
  isPremium?: boolean;
  userPacksCount?: number;
  className?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function DropskillsSidebar({ 
  isPremium = false, 
  userPacksCount = 0,
  className = "",
  onCollapseChange
}: DropskillsSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    onCollapseChange?.(value);
  };

  return (
    <aside className={`flex flex-col h-screen bg-black text-white transition-all duration-300 shadow-xl
      ${collapsed ? "w-20" : "w-64"} 
      fixed top-0 left-0 z-30
      ${className}
      `}>
      
      {/* Logo & collapse button */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
        <Link href="/" className={`text-2xl font-extrabold transition-all duration-200 ${collapsed ? "hidden" : "block"}`}>
          DROP <span className="text-[#ff0033]">SKILLS</span>
        </Link>
        <button 
          onClick={() => handleCollapse(!collapsed)} 
          className="text-neutral-400 hover:text-[#ff0033] transition-colors"
          aria-label={collapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* PARTIE 1 : CORE BUSINESS */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
        <SidebarLink 
          collapsed={collapsed} 
          icon={<Home />} 
          label="Accueil" 
          href="/"
          tooltip="Accueil & visite guidée" 
        />
        
        <SidebarLink 
          collapsed={collapsed} 
          icon={<Lock />} 
          label="Mon Coffre" 
          href="/coffre"
          tooltip={`Mes ${userPacksCount} produit(s) acheté(s)`}
          badge={userPacksCount > 0 ? userPacksCount.toString() : undefined}
        />
        
        <SidebarLink 
          collapsed={collapsed} 
          icon={<BookOpen />} 
          label="Catalogue" 
          href="/catalogue"
          tooltip="Tous les produits Dropskills" 
        />

        {/* PARTIE 2 : OUTILS IA */}
        <SidebarDivider collapsed={collapsed} label="Outils IA Dropskills" />
        
        <SidebarLink 
          collapsed={collapsed} 
          icon={<Sparkles />} 
          label="Tous les Outils IA" 
          href="/outils"
          tooltip="Vue d'ensemble des outils IA"
        />
        
        {IA_TOOLS.map(tool => (
          <SidebarLink 
            key={tool.label} 
            collapsed={collapsed} 
            icon={tool.icon} 
            label={tool.label} 
            href={tool.href}
            tooltip={`Outil ${tool.type.toLowerCase()}`}
            isPremium={!isPremium} // Affiche le lock si pas premium
          />
        ))}

        {/* CTA Premium */}
        {!isPremium && (
          <div className="mt-3">
            <SidebarCTA 
              collapsed={collapsed} 
              icon={<Lock />} 
              label="Débloquer l'IA Premium" 
              cta="Upgrade"
              href="/premium"
            />
          </div>
        )}

        {/* AIDE & SUPPORT */}
        <SidebarDivider collapsed={collapsed} label="Aide & Personnalisation" />
        
        <SidebarLink 
          collapsed={collapsed} 
          icon={<GraduationCap />} 
          label="Tutoriels" 
          href="/tutoriels"
          tooltip="Guides et formations"
        />
        
        <SidebarLink 
          collapsed={collapsed} 
          icon={<LineChart />} 
          label="Demandes de Produits" 
          href="/demandes"
          tooltip="Suggère ou vote pour de nouveaux contenus" 
        />
      </nav>

      {/* FOOTER */}
      <div className="mt-auto mb-4 flex flex-col gap-1 px-2 border-t border-gray-800 pt-4">
        <SidebarLink 
          collapsed={collapsed} 
          icon={<User />} 
          label="Mon Compte" 
          href="/compte"
          tooltip="Profil et paramètres"
        />
        
        <SidebarLink 
          collapsed={collapsed} 
          icon={<Settings />} 
          label="Paramètres" 
          href="/parametres"
          tooltip="Configuration"
        />
        
        <button
          onClick={() => {
            // Logique de déconnexion
            router.push('/auth/logout');
          }}
          className={`group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/50 transition font-medium relative text-left w-full`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Déconnexion</span>}
          {collapsed && (
            <span className="absolute left-20 bg-black text-white rounded px-2 py-1 shadow-lg text-xs opacity-0 group-hover:opacity-100 z-50 transition whitespace-nowrap">
              Déconnexion
            </span>
          )}
        </button>
        
        {!collapsed && (
          <div className="text-xs text-neutral-600 mt-2 px-2 text-center">
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
  isPremium?: boolean;
}

function SidebarLink({ 
  icon, 
  label, 
  collapsed, 
  href = "#", 
  tooltip, 
  badge,
  isPremium = false 
}: SidebarLinkProps) {
  const content = (
    <div className={`group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ff0033]/10 hover:text-[#ff0033] transition font-medium relative ${isPremium ? 'opacity-60' : ''}`}>
      <span className="text-xl relative">
        {icon}
        {isPremium && (
          <Lock size={12} className="absolute -top-1 -right-1 text-yellow-500" />
        )}
      </span>
      
      {!collapsed && (
        <span className="flex-1">{label}</span>
      )}
      
      {!collapsed && badge && (
        <span className="bg-[#ff0033] text-white text-xs rounded-full px-2 py-1 font-bold">
          {badge}
        </span>
      )}
      
      {collapsed && (tooltip || label) && (
        <span className="absolute left-20 bg-black text-white rounded px-2 py-1 shadow-lg text-xs opacity-0 group-hover:opacity-100 z-50 transition whitespace-nowrap border border-gray-700">
          {tooltip || label}
          {isPremium && " (Premium requis)"}
        </span>
      )}
    </div>
  );

  if (href === "#" || isPremium) {
    return <div className={isPremium ? "cursor-not-allowed" : "cursor-pointer"}>{content}</div>;
  }

  return <Link href={href}>{content}</Link>;
}

function SidebarDivider({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) {
    return <div className="my-4 h-px bg-neutral-800"></div>;
  }

  return (
    <div className="my-4 flex items-center gap-2 text-xs text-neutral-400 font-bold uppercase tracking-wide">
      <span className="flex-1 h-px bg-neutral-800"></span>
      <span className="px-2">{label}</span>
      <span className="flex-1 h-px bg-neutral-800"></span>
    </div>
  );
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
      className={`flex items-center gap-2 bg-gradient-to-r from-[#ff0033] to-red-600 text-white font-semibold px-3 py-2 rounded-xl shadow-lg transition hover:scale-105 ${collapsed ? 'justify-center' : ''}`}
    >
      <span>{icon}</span>
      {!collapsed && <span className="flex-1">{label}</span>}
      {!collapsed && (
        <span className="bg-black/20 text-xs rounded px-2 py-1">
          {cta}
        </span>
      )}
    </Link>
  );
} 