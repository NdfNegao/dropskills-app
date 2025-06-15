import Link from 'next/link';
import { AiTool, ICON_MAP } from '@/data/ai-tools';
import Crown from '@/components/ui/Crown';

interface AiToolCardProps {
  tool: AiTool;
  className?: string;
}

// Fonction pour mapper les couleurs dynamiques vers des classes Tailwind statiques
const getColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    'purple-500': 'bg-purple-500',
    'blue-500': 'bg-blue-500',
    'orange-500': 'bg-orange-500',
    'green-500': 'bg-green-500',
    'red-500': 'bg-red-500',
    'yellow-500': 'bg-yellow-500',
    'pink-500': 'bg-pink-500',
    'indigo-500': 'bg-indigo-500',
    'teal-500': 'bg-teal-500',
    'cyan-500': 'bg-cyan-500',
    'emerald-500': 'bg-emerald-500',
    'violet-500': 'bg-violet-500',
    'fuchsia-500': 'bg-fuchsia-500',
    'rose-500': 'bg-rose-500',
    'amber-500': 'bg-amber-500',
    'lime-500': 'bg-lime-500',
    'sky-500': 'bg-sky-500',
    'slate-500': 'bg-slate-500',
    'gray-500': 'bg-gray-500',
    'zinc-500': 'bg-zinc-500',
    'neutral-500': 'bg-neutral-500',
    'stone-500': 'bg-stone-500'
  };
  
  return colorMap[color] || 'bg-purple-500'; // Couleur par défaut
};

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
      className={`block p-4 sm:p-6 rounded-xl border border-border bg-card hover:border-primary transition-colors w-full ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 w-full">
        {/* Icône avec dégradé */}
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg ${getColorClass(tool.color)} flex items-center justify-center flex-shrink-0`}>
          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 mb-2 w-full">
            <h3 className="text-base sm:text-lg font-semibold text-card-foreground break-words leading-tight">{tool.name}</h3>
            {tool.isPremium && (
              <Crown size="sm" color="yellow" className="flex-shrink-0 self-start" />
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-3 leading-relaxed break-words">{tool.description}</p>
          
          {/* Badge étape */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-muted/20 text-xs w-full">
            <span className="text-primary font-medium break-words">{tool.stepTitle}</span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-muted-foreground break-words">{tool.stepDescription}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}