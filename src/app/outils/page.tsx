'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { AiToolsGrid } from '@/components/AiToolsGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Sparkles } from 'lucide-react';

export default function OutilsPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Outils IA</h1>
              <p className="text-gray-400">Boostez votre business avec l'intelligence artificielle</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Outils disponibles</span>
              </div>
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-xs text-gray-400">Dont 5 outils premium</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <Bot className="w-4 h-4" />
                <span className="text-sm font-medium">Utilisations</span>
              </div>
              <div className="text-2xl font-bold text-white">1,234</div>
              <div className="text-xs text-gray-400">Ce mois-ci</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tous les outils</TabsTrigger>
            <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
            <TabsTrigger value="activation">Activation</TabsTrigger>
            <TabsTrigger value="trafic">Trafic</TabsTrigger>
            <TabsTrigger value="contenu">Contenu</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <AiToolsGrid />
          </TabsContent>

          <TabsContent value="acquisition">
            <AiToolsGrid category="Acquisition" />
          </TabsContent>

          <TabsContent value="activation">
            <AiToolsGrid category="Activation" />
          </TabsContent>

          <TabsContent value="trafic">
            <AiToolsGrid category="Trafic" />
          </TabsContent>

          <TabsContent value="contenu">
            <AiToolsGrid category="Contenu" />
          </TabsContent>
        </Tabs>
      </div>
    </LayoutWithSidebar>
  );
} 