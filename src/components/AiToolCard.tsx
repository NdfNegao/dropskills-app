import Link from 'next/link';
import { AiTool, ICON_MAP } from '@/data/ai-tools';
import { Crown } from 'lucide-react';

interface AiToolCardProps {
  tool: AiTool;
  className?: string;
}

export function AiToolCard({ tool, className = '' }: AiToolCardProps) {
  // Récupérer le composant icône depuis la map
  const IconComponent = ICON_MAP[tool.icon] || ICON_MAP['Bot'];
  
  // Vérifier que href existe
  if (!tool.href) {
    console.warn('AiToolCard: href is undefined for tool:', tool);
    return null;
  }
  
  return (
    <Link 
      href={tool.href}
      className={`block p-6 rounded-xl border border-[#232323] bg-[#111] hover:border-[#ff0033] transition-colors ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Icône avec dégradé */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>

        {/* Contenu */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
            {tool.isPremium && (
              <Crown className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          <p className="text-gray-400 text-sm mb-3">{tool.description}</p>
          
          {/* Badge étape */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1a1a] text-xs">
            <span className="text-[#ff0033] font-medium">{tool.stepTitle}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{tool.stepDescription}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}