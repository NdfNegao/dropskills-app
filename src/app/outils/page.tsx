'use client';

import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import { AiToolsGrid } from '@/components/AiToolsGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Sparkles } from 'lucide-react';

export default function OutilsPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <ToolLayout toolId="outils">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Tous les Outils IA DropSkills
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez notre suite complète d'outils IA conçus pour accélérer votre business en ligne. 
            Chaque outil est optimisé pour maximiser vos conversions et automatiser vos tâches répétitives.
          </p>
        </div>
        
        <AiToolsGrid />
      </div>
    </ToolLayout>
  );
} 