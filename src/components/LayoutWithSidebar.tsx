'use client';

import React, { useState } from 'react';
import DropskillsSidebar from './DropskillsSidebar';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import {
  Home, Lock, User, LogOut, 
  Sparkles, BrainCog, Rocket, FolderKanban, Mail, 
  CalendarCheck, LineChart, GraduationCap, Target, X, Users, HelpCircle,
  Heart, FolderOpen, MessageSquarePlus, Gift
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

// Outils IA pour mobile
const IA_TOOLS = [
  { icon: <BrainCog />, label: "ICP Maker", href: "/outils/icp-maker" },
  { icon: <Rocket />, label: "Générateur d'Offres", href: "/outils/generateur-offre" },
  { icon: <FolderKanban />, label: "Tunnel Maker", href: "/outils/tunnel-maker" },
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
    <div className="flex min-h-screen bg-background">
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
        fixed top-0 left-0 h-full w-80 bg-background text-foreground z-50 transform transition-transform duration-300 lg:hidden
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header mobile */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/dashboard" className="text-2xl font-extrabold">
            DROP <span className="text-primary">SKILLS</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation mobile */}
        <nav className="flex-1 flex flex-col gap-1 px-4 py-4 overflow-y-auto">
          {/* Navigation principale */}
          <MobileNavLink icon={<Home />} label="Accueil" href="/dashboard" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<GraduationCap />} label="Centre de Formation" href="/universite" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<Heart />} label="Favoris" href="/favoris" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<FolderOpen />} label="Outils IA" href="/outils" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<MessageSquarePlus />} label="Mentors IA" href="/ai-mentor" onClick={() => setMobileMenuOpen(false)} />
          
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

          {/* Aide & Personnalisation */}
          <div className="my-4 border-t border-border"></div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Aide & Personnalisation
          </div>
          
          <MobileNavLink icon={<MessageSquarePlus />} label="Proposer un outil" href="/demandes" onClick={() => setMobileMenuOpen(false)} />

          {/* Compte */}
          <div className="my-4 border-t border-border"></div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Compte
          </div>
          
          <MobileNavLink icon={<User />} label="Mon Compte" href="/compte" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<Users />} label="Affiliation" href="/affiliate" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<Gift />} label="Parrainage" href="/gift" onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink icon={<HelpCircle />} label="Support" href="/support" onClick={() => setMobileMenuOpen(false)} />
        </nav>

        {/* Footer mobile */}
        <div className="mt-auto p-4 border-t border-border">
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
            <div className="mt-3 text-center text-xs text-muted-foreground">
              Connecté en tant que {user.email}
              <div className="text-primary font-medium mt-1">
                {/* Premium à implémenter selon vos besoins */}
                {user.email === 'cyril.iriebi@gmail.com' && '🔧 Admin'}
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
        <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-foreground hover:scale-105 transition-transform">
            DROP<span className="text-primary">SKILLS</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Contenu avec padding adaptatif */}
        <div className="p-3 sm:p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Chargement...</span>
            </div>
          ) : (
            <div className="w-full max-w-full">
              {children}
            </div>
          )}
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
      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/20 transition-colors relative"
    >
      <div className="flex-shrink-0 w-5 h-5">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
      {isPremium && (
        <Lock className="ml-auto w-4 h-4 text-muted-foreground" />
      )}
    </Link>
  );
}