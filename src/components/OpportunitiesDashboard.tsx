'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, ArrowLeft, Filter, TrendingUp, AlertCircle, Bookmark, Bell, Share2, FileText, ExternalLink, ChevronDown, ChevronUp, Target, DollarSign, Activity, Award, X, Save, BarChart2, Play } from 'lucide-react';
import { VeilleAnalysis, Opportunity } from '@/app/outils/agent-veille/page';

interface OpportunitiesDashboardProps {
  analysis: VeilleAnalysis;
  onBackToWizard: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  savedOpportunities: string[];
  onSaveOpportunity: (id: string) => void;
  alerts: Record<string, boolean>;
  onToggleAlert: (id: string) => void;
}

export function OpportunitiesDashboard({ 
  analysis, 
  onBackToWizard, 
  onRefresh, 
  isRefreshing,
  savedOpportunities,
  onSaveOpportunity,
  alerts,
  onToggleAlert
}: OpportunitiesDashboardProps) {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedScore, setSelectedScore] = useState<string>('all');
  const [showBlueOceanOnly, setShowBlueOceanOnly] = useState(false);
  const [expandedOpportunity, setExpandedOpportunity] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Filtrer les opportunités
  const filteredOpportunities = useMemo(() => {
    return analysis.opportunites.filter(opp => {
      const sectorMatch = selectedSector === 'all' || opp.secteur === selectedSector;
      const scoreMatch = selectedScore === 'all' || 
        (selectedScore === 'high' && opp.scoring.scoreGlobal >= 80) ||
        (selectedScore === 'medium' && opp.scoring.scoreGlobal >= 60 && opp.scoring.scoreGlobal < 80) ||
        (selectedScore === 'low' && opp.scoring.scoreGlobal < 60);
      const blueOceanMatch = !showBlueOceanOnly || opp.isBlueOcean;
      
      return sectorMatch && scoreMatch && blueOceanMatch;
    });
  }, [analysis.opportunites, selectedSector, selectedScore, showBlueOceanOnly]);

  // Obtenir les secteurs uniques
  const sectors = useMemo(() => {
    const uniqueSectors = new Set(analysis.opportunites.map(opp => opp.secteur));
    return Array.from(uniqueSectors);
  }, [analysis.opportunites]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '🔥';
    if (score >= 60) return '👍';
    return '⚠️';
  };

  const handleShare = (opportunity: Opportunity) => {
    const text = `Opportunité détectée : ${opportunity.titre}\n${opportunity.description}\nScore: ${opportunity.scoring.scoreGlobal}/100`;
    navigator.clipboard.writeText(text);
    alert('Opportunité copiée dans le presse-papier !');
  };

  const handleStartAnalysis = () => {
    router.push('/outils/icp-maker');
  };

  const handleOpportunityClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleCloseDetails = () => {
    setSelectedOpportunity(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🦾 Opportunités Détectées
            </h1>
            <p className="text-gray-600">
              {analysis.veilleInfo.titre} - {analysis.veilleInfo.nombreOpportunites} opportunités identifiées
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onBackToWizard}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isRefreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Actualisation...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Actualiser</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analysis.metriques.opportunitesBlueOcean}
            </div>
            <p className="text-sm text-gray-600 mt-1">Blue Ocean 🌊</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(analysis.metriques.scoreMovenPertinence)}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Score moyen</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analysis.metriques.secteursPrioritaires.length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Secteurs clés</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analysis.metriques.potentielTotalEstime}
            </div>
            <p className="text-sm text-gray-600 mt-1">Potentiel total</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtres:</span>
            </div>
            
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tous les secteurs</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            
            <select
              value={selectedScore}
              onChange={(e) => setSelectedScore(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tous les scores</option>
              <option value="high">Score élevé (80+)</option>
              <option value="medium">Score moyen (60-79)</option>
              <option value="low">Score faible (&lt;60)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showBlueOceanOnly}
                onChange={(e) => setShowBlueOceanOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Blue Ocean uniquement 🌊</span>
            </label>
          </div>
        </div>
      </div>

      {/* Liste des opportunités */}
      <div className={view === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredOpportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            onClick={() => handleOpportunityClick(opportunity)}
            className={`bg-[#1a1a1a] rounded-xl p-6 border border-[#232323] cursor-pointer transition-all hover:border-[#ff0033]/50 ${
              selectedOpportunity?.id === opportunity.id ? 'ring-2 ring-[#ff0033]' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{opportunity.titre}</h3>
                <p className="text-sm text-gray-400 mt-1">{opportunity.secteur}</p>
              </div>
              {opportunity.isBlueOcean && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
                  Blue Ocean
                </span>
              )}
            </div>

            <p className="text-gray-300 mt-4 line-clamp-3">{opportunity.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Pertinence</div>
                <div className={`text-lg font-semibold ${getScoreColor(opportunity.scoring.pertinence)}`}>
                  {opportunity.scoring.pertinence}/10
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Potentiel</div>
                <div className={`text-lg font-semibold ${getScoreColor(opportunity.scoring.potentielFinancier)}`}>
                  {opportunity.scoring.potentielFinancier}/10
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveOpportunity(opportunity.id);
                  }}
                  className={`p-2 rounded-lg ${
                    savedOpportunities.includes(opportunity.id)
                      ? 'bg-[#ff0033] text-white'
                      : 'bg-[#232323] text-gray-400 hover:text-white'
                  }`}
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAlert(opportunity.id);
                  }}
                  className={`p-2 rounded-lg ${
                    alerts[opportunity.id]
                      ? 'bg-[#ff0033] text-white'
                      : 'bg-[#232323] text-gray-400 hover:text-white'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(opportunity);
                  }}
                  className="p-2 rounded-lg bg-[#232323] text-gray-400 hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartAnalysis();
                  }}
                  className="p-2 rounded-lg bg-[#232323] text-gray-400 hover:text-white"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Synthèse des tendances */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#232323]">
        <h2 className="text-xl font-bold text-white mb-4">Synthèse des tendances</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Tendances principales</h3>
            <ul className="space-y-2">
              {analysis.syntheseTendances.tendancesPrincipales.map((tendance, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-[#ff0033] mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{tendance}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Signaux faibles</h3>
            <ul className="space-y-2">
              {analysis.syntheseTendances.signauxFaibles.map((signal, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{signal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Recommandations</h3>
            <ul className="space-y-2">
              {analysis.syntheseTendances.recommandationsStrategiques.map((reco, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{reco}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal détail opportunité */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111111] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedOpportunity.titre}</h2>
                  <p className="text-gray-400 mt-1">{selectedOpportunity.secteur}</p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="p-2 rounded-lg bg-[#232323] text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white">Description</h3>
                <p className="text-gray-300 mt-2">{selectedOpportunity.description}</p>
              </div>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-400">Pertinence</div>
                  <div className={`text-lg font-semibold ${getScoreColor(selectedOpportunity.scoring.pertinence)}`}>
                    {selectedOpportunity.scoring.pertinence}/10
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Nouveauté</div>
                  <div className={`text-lg font-semibold ${getScoreColor(selectedOpportunity.scoring.nouveaute)}`}>
                    {selectedOpportunity.scoring.nouveaute}/10
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Difficulté</div>
                  <div className={`text-lg font-semibold ${getScoreColor(selectedOpportunity.scoring.difficulte)}`}>
                    {selectedOpportunity.scoring.difficulte}/10
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Potentiel</div>
                  <div className={`text-lg font-semibold ${getScoreColor(selectedOpportunity.scoring.potentielFinancier)}`}>
                    {selectedOpportunity.scoring.potentielFinancier}/10
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white">Actions recommandées</h3>
                <ul className="mt-4 space-y-2">
                  {selectedOpportunity.actionsRecommandees.map((action, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Play className="w-4 h-4 text-[#ff0033] mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedOpportunity.lienReference && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white">Lien de référence</h3>
                  <a
                    href={selectedOpportunity.lienReference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff0033] hover:underline mt-2 inline-block"
                  >
                    {selectedOpportunity.lienReference}
                  </a>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveOpportunity(selectedOpportunity.id);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      savedOpportunities.includes(selectedOpportunity.id)
                        ? 'bg-[#ff0033] text-white'
                        : 'bg-[#232323] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {savedOpportunities.includes(selectedOpportunity.id)
                        ? 'Sauvegardé'
                        : 'Sauvegarder'}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleAlert(selectedOpportunity.id);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      alerts[selectedOpportunity.id]
                        ? 'bg-[#ff0033] text-white'
                        : 'bg-[#232323] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>
                      {alerts[selectedOpportunity.id]
                        ? 'Alertes activées'
                        : 'Activer alertes'}
                    </span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#232323] text-gray-400 hover:text-white"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#232323] text-gray-400 hover:text-white"
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span>Analyser</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 