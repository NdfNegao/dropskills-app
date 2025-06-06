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
          <div className="bg-gray-900/50 rounded-lg p-1 border border-gray-800">
            <button
              onClick={() => setActiveTab('grid')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all
                ${activeTab === 'grid'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <Grid className="w-4 h-4" />
              Grille d'outils
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all
                ${activeTab === 'journey'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <Navigation className="w-4 h-4" />
              Parcours AARRR
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