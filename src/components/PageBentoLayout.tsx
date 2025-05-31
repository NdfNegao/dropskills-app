import React from 'react';

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
}

// ATTENTION : La section stats doit contenir exactement 4 blocs pour garantir l'alignement parfait du gabarit Bento. Ne jamais dépasser 4.

const PageBentoLayout: React.FC<PageBentoLayoutProps> = ({ icon, title, subtitle, stats, children }) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-gray-400">{subtitle}</p>
          </div>
        </div>
      </div>
      {/* Stats (optionnel) */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-1 ${stat.color || 'text-blue-400'}`}>{stat.icon}<span className="text-sm font-medium">{stat.label}</span></div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              {stat.description && <div className="text-xs text-gray-400">{stat.description}</div>}
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