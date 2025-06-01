'use client';

import React, { useState } from 'react';
import DropskillsSidebar from './DropskillsSidebar';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import {
  Home, Lock, BookOpen, User, Settings, LogOut, 
  Sparkles, BrainCog, Rocket, FolderKanban, Mail, 
  CalendarCheck, LineChart, GraduationCap, Target, X, Users, HelpCircle
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

// Outils IA pour mobile
const IA_TOOLS = [
  { icon: <BrainCog />, label: "ICP Maker", href: "/outils/icp-maker" },
  { icon: <Rocket />, label: "Générateur d'Offre", href: "/outils/generateur-offre" },
  { icon: <FolderKanban />, label: "Tunnel de Vente IA", href: "/outils/tunnel-maker" },
  { icon: <Mail />, label: "CopyMoneyMail", href: "/outils/copymoneymail" },
  { icon: <CalendarCheck />, label: "Content System 90J", href: "/outils/content-system" },
  { icon: <Target />, label: "Lead Magnet Creator", href: "/outils/lead-magnet" },
];

interface LayoutWithSidebarProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function LayoutWithSidebar({ 
  children, 
  showSidebar = true 
}: LayoutWithSidebarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, canAccessPremium, isLoading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Overlay pour mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar Desktop */}
      <DropskillsSidebar 
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Navigation Mobile Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-black text-white z-50 transform transition-transform duration-300 lg:hidden
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header mobile */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link href="/" className="text-2xl font-extrabold">
            DROP <span className="text-[#ff0033]">SKILLS</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg bg-[#232323] text-white hover:bg-[#333333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation mobile */}
        <nav className="flex-1 flex flex-col gap-1 px-4 py-4 overflow-y-auto">
          <MobileNavLink icon={<Home />} label="Accueil" href="/" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink 
            icon={<Lock />} 
            label="Centre de formation" 
            href="/universite" 
            isPremium={!canAccessPremium}
            onClick={() => setMobileMenuOpen(false)} 
          />
          
          {/* Divider */}
          <div className="my-4 border-t border-gray-800"></div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Outils IA Dropskills
          </div>
          
          <MobileNavLink icon={<Sparkles />} label="Tous les Outils IA" href="/outils" onClick={() => setMobileMenuOpen(false)} />
          
          {IA_TOOLS.map(tool => (
            <MobileNavLink 
              key={tool.label}
              icon={tool.icon} 
              label={tool.label} 
              href={tool.href}
              isPremium={!canAccessPremium}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}

          {/* CTA Premium */}
          {!canAccessPremium && (
            <div className="mt-4 p-4 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-lg">
              <div className="text-sm font-semibold mb-2">Débloquer l'IA Premium</div>
              <Link 
                href="/premium"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs bg-white text-black px-3 py-1 rounded-full font-medium"
              >
                Upgrade
              </Link>
            </div>
          )}

          {/* Aide & Support */}
          <div className="my-4 border-t border-gray-800"></div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Aide & Support
          </div>
          
          <MobileNavLink icon={<GraduationCap />} label="Centre de formation" href="/universite" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<LineChart />} label="Demandes de Produits" href="/demandes" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<Users />} label="Programme d'affiliation" href="/affiliate" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<HelpCircle />} label="Support" href="/support" onClick={() => setMobileMenuOpen(false)} />
        </nav>

        {/* Footer mobile */}
        <div className="mt-auto p-4 border-t border-gray-800">
          <MobileNavLink icon={<User />} label="Mon Compte" href="/compte" onClick={() => setMobileMenuOpen(false)} />
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
              <div className="text-[#ff0033] font-medium mt-1">
                {user.role === 'PREMIUM' && '👑 Premium'}
                {user.role === 'ADMIN' && '🛡️ Admin'}
                {user.role === 'SUPER_ADMIN' && '⚡ Super Admin'}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Contenu principal responsive */}
      <main className={`
        flex-1 transition-all duration-300 min-h-screen
        ml-0 lg:ml-20
        ${!sidebarCollapsed ? 'lg:ml-64' : ''}
      `}>
        {/* Header mobile avec bouton menu */}
        <div className="lg:hidden bg-[#111111] border-b border-[#232323] p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            DROP<span className="text-[#ff0033]">SKILLS</span>
          </h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-[#232323] text-white hover:bg-[#333333] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Contenu avec padding adaptatif */}
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
                <span className="ml-2 text-gray-300">Chargement...</span>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Composant pour les liens de navigation mobile
interface MobileNavLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  isPremium?: boolean;
  onClick: () => void;
}

function MobileNavLink({ icon, label, href, badge, isPremium, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#232323] transition-colors relative"
    >
      <div className="flex-shrink-0 w-5 h-5">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto bg-[#ff0033] text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
      {isPremium && (
        <Lock className="ml-auto w-4 h-4 text-gray-400" />
      )}
    </Link>
  );
} 