import React from 'react';
import { AiToolCard } from './AiToolCard';
import { AI_TOOLS } from '@/data/ai-tools';

interface AiToolsGridProps {
  category?: string;
  step?: number;
  className?: string;
}

export function AiToolsGrid({ category, step, className = '' }: AiToolsGridProps) {
  // Filtrer les outils selon les props
  let filteredTools = AI_TOOLS;
  
  if (category) {
    filteredTools = filteredTools.filter(tool => tool.category === category);
  } else if (step) {
    filteredTools = filteredTools.filter(tool => tool.step === step);
  }

  if (filteredTools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Aucun outil trouvé</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full ${className}`}>
      {filteredTools.map((tool) => (
        <AiToolCard key={tool.id} tool={tool} className="w-full" />
      ))}
    </div>
  );
}