import { useState, useEffect } from 'react';
import { AiToolCard } from './AiToolCard';

interface AiToolsGridProps {
  category?: string;
  step?: number;
  className?: string;
}

export function AiToolsGrid({ category, step, className = '' }: AiToolsGridProps) {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/admin/ai-tools');
      const data = await response.json();
      setTools(data);
    } catch (error) {
      console.error('Erreur lors du chargement des outils:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les outils selon les props
  let filteredTools = tools;
  
  if (category) {
    filteredTools = filteredTools.filter(tool => tool.category === category);
  } else if (step) {
    filteredTools = filteredTools.filter(tool => tool.step === step);
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Chargement des outils...</p>
      </div>
    );
  }

  if (filteredTools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Aucun outil trouvé</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {filteredTools.map((tool) => (
        <AiToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
} 