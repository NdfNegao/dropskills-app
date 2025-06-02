import React from 'react';
import PageBentoLayout from './PageBentoLayout';
import LayoutWithSidebar from './LayoutWithSidebar';
import { IA_TOOLS } from '@/data/ai-tools';

interface ToolLayoutProps {
  toolId: string;
  children: React.ReactNode;
  showSidebar?: boolean;
}

/**
 * Layout unifié pour les outils IA - utilise PageBentoLayout avec les métadonnées appropriées
 * Permet une migration progressive de LayoutWithSidebar vers PageBentoLayout
 */
const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  toolId, 
  children, 
  showSidebar = true 
}) => {
  // Chercher les métadonnées de l'outil
  const tool = IA_TOOLS.find(t => t.href.includes(toolId));
  
  if (!tool) {
    // Fallback vers LayoutWithSidebar si outil non trouvé
    return (
      <LayoutWithSidebar showSidebar={showSidebar}>
        {children}
      </LayoutWithSidebar>
    );
  }

  return (
    <LayoutWithSidebar showSidebar={showSidebar}>
      <PageBentoLayout
        icon={tool.icon}
        title={tool.label}
        subtitle={tool.description || `Outil IA pour ${tool.label.toLowerCase()}`}
      >
        {children}
      </PageBentoLayout>
    </LayoutWithSidebar>
  );
};

export default ToolLayout; 