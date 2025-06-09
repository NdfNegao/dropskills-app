'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color?: string; // ex: 'text-blue-400'
  description?: string;
}

interface PageBentoLayoutProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  stats?: Stat[];
  children: React.ReactNode;
  color?: string; // Couleur gradient personnalisée (ex: 'from-blue-500 to-purple-600')
}

// ATTENTION : La section stats doit contenir exactement 4 blocs pour garantir l'alignement parfait du gabarit Bento. Ne jamais dépasser 4.

const PageBentoLayout: React.FC<PageBentoLayoutProps> = ({ icon, title, subtitle, stats, children, color }) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${color || 'from-[#ff0033] to-[#cc0029]'} rounded-lg flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          
          {/* Lien de retour vers la liste des outils IA */}
          <Link 
            href="/outils" 
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Retour aux outils IA</span>
            <span className="sm:hidden">Retour</span>
          </Link>
        </div>
      </div>
      {/* Stats (optionnel) */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-1 ${stat.color || 'text-blue-400'}`}>{stat.icon}<span className="text-sm font-medium">{stat.label}</span></div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              {stat.description && <div className="text-xs text-muted-foreground">{stat.description}</div>}
            </div>
          ))}
        </div>
      )}
      {/* Contenu métier */}
      {children}
    </div>
  );
};

export default PageBentoLayout;