'use client';

import { useState } from 'react';
import { AiToolsGrid } from '@/components/AiToolsGrid';
import { AARRRJourney } from '@/components/AARRRJourney';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { Grid, Navigation } from 'lucide-react';

type TabType = 'grid' | 'journey';

export default function OutilsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('grid');

  return (
    <LayoutWithSidebar>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {activeTab === 'grid' ? 'Outils IA pour Entrepreneurs' : 'Parcours AARRR - Framework de Croissance'}
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            {activeTab === 'grid' 
              ? 'Découvrez notre collection d\'outils IA spécialement conçus pour accélérer votre croissance entrepreneuriale. Explorez-les par grille ou suivez le parcours AARRR.'
              : 'Optimisez chaque étape de votre funnel de croissance avec nos outils IA spécialisés. Le framework AARRR vous guide de l\'acquisition à la monétisation.'
            }
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center">
          <div className="bg-[#111111] border border-[#232323] rounded-xl p-1.5 shadow-lg flex flex-row gap-2">
            <button
              onClick={() => setActiveTab('grid')}
              className={`
                relative flex items-center gap-3 px-8 py-4 rounded-lg font-medium transition-all duration-300 group
                ${activeTab === 'grid'
                  ? 'bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white shadow-lg shadow-[#ff0033]/25 transform scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a] hover:border-[#2a2a2a]'
                }
              `}
            >
              <Grid className={`w-5 h-5 transition-transform duration-300 ${
                activeTab === 'grid' ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              <span className="text-sm font-semibold tracking-wide">Grille d'outils</span>
              {activeTab === 'grid' && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff0033]/20 to-[#cc0029]/20 blur-xl -z-10" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`
                relative flex items-center gap-3 px-8 py-4 rounded-lg font-medium transition-all duration-300 group
                ${activeTab === 'journey'
                  ? 'bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white shadow-lg shadow-[#ff0033]/25 transform scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a] hover:border-[#2a2a2a]'
                }
              `}
            >
              <Navigation className={`w-5 h-5 transition-transform duration-300 ${
                activeTab === 'journey' ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              <span className="text-sm font-semibold tracking-wide">Parcours AARRR</span>
              {activeTab === 'journey' && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff0033]/20 to-[#cc0029]/20 blur-xl -z-10" />
              )}
            </button>
          </div>
        </div>
        
        {/* Content */}
        {activeTab === 'grid' ? (
          <AiToolsGrid />
        ) : (
          <AARRRJourney />
        )}
      </div>
    </LayoutWithSidebar>
  );
}