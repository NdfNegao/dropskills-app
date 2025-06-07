import Link from 'next/link';
import { AiTool, ICON_MAP } from '@/data/ai-tools';
import Crown from '@/components/ui/Crown';

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
      className={`block p-6 rounded-xl border border-border bg-card hover:border-primary transition-colors ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Icône avec dégradé */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>

        {/* Contenu */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-card-foreground">{tool.name}</h3>
            {tool.isPremium && (
              <Crown size="sm" color="yellow" />
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-3">{tool.description}</p>
          
          {/* Badge étape */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/20 text-xs">
            <span className="text-primary font-medium">{tool.stepTitle}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{tool.stepDescription}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}