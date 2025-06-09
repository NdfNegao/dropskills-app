import React from 'react';
import PageBentoLayout from './PageBentoLayout';
import LayoutWithSidebar from './LayoutWithSidebar';
import { AI_TOOLS, ICON_MAP } from '@/data/ai-tools';

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

interface ToolLayoutProps {
  toolId: string;
  children: React.ReactNode;
  showSidebar?: boolean;
  stats?: Stat[];
}

/**
 * Layout unifié pour les outils IA - utilise PageBentoLayout avec les métadonnées appropriées
 * Permet une migration progressive de LayoutWithSidebar vers PageBentoLayout
 */
const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  toolId, 
  children, 
  showSidebar = true,
  stats
}) => {
  // Chercher les métadonnées de l'outil par ID ou par href
  const tool = AI_TOOLS.find(t => 
    t.id === toolId || 
    t.href === `/outils/${toolId}` ||
    t.href.endsWith(`/${toolId}`)
  );
  
  if (!tool) {
    // Fallback vers LayoutWithSidebar si outil non trouvé
    return (
      <LayoutWithSidebar showSidebar={showSidebar}>
        {children}
      </LayoutWithSidebar>
    );
  }

  // Récupérer le composant d'icône
  const IconComponent = ICON_MAP[tool.icon];

  return (
    <LayoutWithSidebar showSidebar={showSidebar}>
      <PageBentoLayout
        icon={IconComponent ? <IconComponent className="w-6 h-6 text-white" /> : null}
        title={tool.name}
        subtitle={tool.description || `Outil IA pour ${tool.name.toLowerCase()}`}
        stats={stats}
      >
        {children}
      </PageBentoLayout>
    </LayoutWithSidebar>
  );
};

export default ToolLayout;