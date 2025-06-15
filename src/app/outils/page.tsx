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
      <div className="space-y-6 sm:space-y-8 w-full max-w-7xl mx-auto px-2 sm:px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            {activeTab === 'grid' ? 'Outils IA pour Entrepreneurs' : 'Parcours AARRR - Framework de Croissance'}
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed px-4">
            {activeTab === 'grid' 
              ? 'Découvrez notre collection d\'outils IA spécialement conçus pour accélérer votre croissance entrepreneuriale. Explorez-les par grille ou suivez le parcours AARRR.'
              : 'Optimisez chaque étape de votre funnel de croissance avec nos outils IA spécialisés. Le framework AARRR vous guide de l\'acquisition à la monétisation.'
            }
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center px-2">
          <div className="bg-[#111111] border border-[#232323] rounded-xl p-1.5 shadow-lg flex flex-col sm:flex-row gap-2 w-full sm:w-auto max-w-md sm:max-w-none">
            <button
              onClick={() => setActiveTab('grid')}
              className={`
                relative flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-300 group w-full sm:w-auto
                ${activeTab === 'grid'
                  ? 'bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white shadow-lg shadow-[#ff0033]/25 transform scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a] hover:border-[#2a2a2a]'
                }
              `}
            >
              <Grid className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                activeTab === 'grid' ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">Grille d'outils</span>
              {activeTab === 'grid' && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff0033]/20 to-[#cc0029]/20 blur-xl -z-10" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`
                relative flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-300 group w-full sm:w-auto
                ${activeTab === 'journey'
                  ? 'bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white shadow-lg shadow-[#ff0033]/25 transform scale-[1.02]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a] hover:border-[#2a2a2a]'
                }
              `}
            >
              <Navigation className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                activeTab === 'journey' ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">Parcours AARRR</span>
              {activeTab === 'journey' && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff0033]/20 to-[#cc0029]/20 blur-xl -z-10" />
              )}
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="w-full">
          {activeTab === 'grid' ? (
            <AiToolsGrid className="w-full" />
          ) : (
            <AARRRJourney />
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
}