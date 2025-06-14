'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MessageSquare,
  PenTool,
  Target,
  TrendingUp,
  Megaphone,
  Video,
  Mail,
  Lightbulb,
  BarChart3,
  Users,
  Palette,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Icon mapping function
const getIcon = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    'PenTool': PenTool,
    'Target': Target,
    'TrendingUp': TrendingUp,
    'Megaphone': Megaphone,
    'Video': Video,
    'Mail': Mail,
    'Lightbulb': Lightbulb,
    'BarChart3': BarChart3,
    'Users': Users,
    'Palette': Palette,
    'MessageSquare': MessageSquare,
    'Zap': Zap
  };
  
  const IconComponent = iconMap[iconName] || MessageSquare;
  return <IconComponent className="w-6 h-6 text-white" />;
};

export interface MentorData {
  id: string;
  name: string;
  description: string;
  expertise: string[];
  icon: string;
  theme: string;
  href: string;
  isPopular?: boolean;
  estimatedResponseTime?: string;
  conversationCount?: number;
}

interface MentorCardProps {
  mentor: MentorData;
  className?: string;
  variant?: 'default' | 'compact';
}

export default function MentorCard({ 
  mentor, 
  className,
  variant = 'default'
}: MentorCardProps) {
  const isCompact = variant === 'compact';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="h-full relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        {mentor.isPopular && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Populaire
            </div>
          </div>
        )}

        <CardHeader className={cn('pb-3', isCompact ? 'p-4' : 'p-6')}>
          <div className="flex items-start gap-3">
            <div className={cn(
              'rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br',
              mentor.theme,
              isCompact ? 'w-10 h-10' : 'w-12 h-12'
            )}>
              {getIcon(mentor.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'font-semibold text-foreground truncate',
                isCompact ? 'text-base' : 'text-lg'
              )}>
                {mentor.name}
              </h3>
              <p className={cn(
                'text-muted-foreground line-clamp-2',
                isCompact ? 'text-xs' : 'text-sm'
              )}>
                {mentor.description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn('pt-0', isCompact ? 'p-4 pt-0' : 'p-6 pt-0')}>
          {/* Domaines d'expertise */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.slice(0, isCompact ? 2 : 3).map((skill, index) => (
                <span
                  key={index}
                  className={cn(
                    'bg-card-secondary border border-border text-foreground-secondary rounded-full font-medium hover:bg-primary-light hover:text-primary transition-colors',
                    isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                  )}
                >
                  {skill}
                </span>
              ))}
              {mentor.expertise.length > (isCompact ? 2 : 3) && (
                <span className={cn(
                  'bg-card-secondary border border-border text-foreground-secondary rounded-full font-medium hover:bg-primary-light hover:text-primary transition-colors',
                  isCompact ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                )}>
                  +{mentor.expertise.length - (isCompact ? 2 : 3)}
                </span>
              )}
            </div>
          </div>

          {/* Statistiques */}
          {!isCompact && (
            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              {mentor.estimatedResponseTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{mentor.estimatedResponseTime}</span>
                </div>
              )}
              {mentor.conversationCount && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{mentor.conversationCount.toLocaleString()} conversations</span>
                </div>
              )}
            </div>
          )}

          {/* Bouton d'action */}
          <Link href={mentor.href} className="block">
            <Button 
              className={cn(
                'w-full group-hover:bg-primary/90 transition-colors duration-200',
                isCompact ? 'h-8 text-xs' : 'h-9'
              )}
            >
              <span>Commencer la conversation</span>
              <ArrowRight className={cn(
                'transition-transform duration-200 group-hover:translate-x-1',
                isCompact ? 'w-3 h-3 ml-1' : 'w-4 h-4 ml-2'
              )} />
            </Button>
          </Link>
        </CardContent>

        {/* Effet de survol */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none',
          mentor.theme
        )} />
      </Card>
    </motion.div>
  );
}