'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';

export interface VeilleFormData {
  secteur: string;
  zone: string;
  objectif: string;
  typeOpportunite: string[];
  budgetRessources: string;
  frequenceVeille: string;
  canauxVeille: string[];
}

export interface VeilleAnalysis {
  opportunites: Opportunity[];
  trends: any[];
  veilleInfo: {
    titre: string;
    nombreOpportunites: number;
  };
  metriques: {
    opportunitesBlueOcean: number;
    scoreGlobalMoyen: number;
    scoreMovenPertinence: number;
    secteursPrioritaires: string[];
    potentielTotalEstime: string;
  };
  syntheseTendances: {
    tendancesPrincipales: string[];
    signauxFaibles: string[];
    recommandationsStrategiques: string[];
  };
  summary: {
    totalOpportunities: number;
    blueOceanCount: number;
    averageScore: number;
    topSectors: string[];
  };
  metadata: {
    analysisDate: string;
    secteur: string;
    zone: string;
  };
}
import { 
  Search, 
  TrendingUp, 
  Target, 
  Globe, 
  BarChart3, 
  Bell, 
  Bookmark, 
  ArrowRight,
  Eye,
  Filter,
  Calendar,
  CheckCircle,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export interface Opportunity {
  id: string;
  titre: string;
  description: string;
  secteur: string;
  canal: string;
  scoring: {
    pertinence: number;
    nouveaute: number;
    difficulte: number;
    potentielFinancier: number;
    niveauConcurrence: number;
    scoreGlobal: number;
  };
  actionsRecommandees: string[];
  dateDetection: string;
  tags: string[];
  isBlueOcean?: boolean;
  lienReference?: string;
}

function AgentVeilleContent() {
  const [activeTab, setActiveTab] = useState<'setup' | 'opportunities' | 'trends'>('setup');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]);

  // Données simulées pour la démo
  const mockOpportunities: Opportunity[] = [
    {
      id: '1',
      titre: 'IA Conversationnelle pour PME',
      description: 'Marché émergent des chatbots IA spécialisés pour les petites entreprises locales',
      secteur: 'Tech',
      canal: 'LinkedIn',
      scoring: {
        pertinence: 95,
        nouveaute: 88,
        difficulte: 65,
        potentielFinancier: 92,
        niveauConcurrence: 45,
        scoreGlobal: 85
      },
      actionsRecommandees: ['Créer un MVP', 'Identifier 10 prospects', 'Développer une stratégie de pricing'],
      dateDetection: '2024-01-15',
      tags: ['IA', 'SaaS', 'PME'],
      isBlueOcean: true
    },
    {
      id: '2',
      titre: 'Formation IA pour Seniors',
      description: 'Niche inexploitée : formations simplifiées aux outils IA pour les 50+',
      secteur: 'Formation',
      canal: 'Facebook',
      scoring: {
        pertinence: 78,
        nouveaute: 92,
        difficulte: 55,
        potentielFinancier: 75,
        niveauConcurrence: 25,
        scoreGlobal: 75
      },
      actionsRecommandees: ['Créer un cours pilote', 'Tester sur 20 personnes', 'Partenariat avec centres seniors'],
      dateDetection: '2024-01-14',
      tags: ['Formation', 'Seniors', 'IA'],
      isBlueOcean: true
    },
    {
      id: '3',
      titre: 'Audit IA pour E-commerce',
      description: 'Service d\'audit et optimisation IA pour boutiques en ligne',
      secteur: 'Consulting',
      canal: 'Twitter',
      scoring: {
        pertinence: 85,
        nouveaute: 70,
        difficulte: 75,
        potentielFinancier: 88,
        niveauConcurrence: 60,
        scoreGlobal: 76
      },
      actionsRecommandees: ['Développer une checklist', 'Créer des cas d\'usage', 'Proposer un audit gratuit'],
      dateDetection: '2024-01-13',
      tags: ['E-commerce', 'Audit', 'IA'],
      isBlueOcean: false
    }
  ];

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setOpportunities(mockOpportunities);
    setActiveTab('opportunities');
    setIsAnalyzing(false);
  };

  const handleSaveOpportunity = (opportunityId: string) => {
    const newSaved = savedOpportunities.includes(opportunityId)
      ? savedOpportunities.filter(id => id !== opportunityId)
      : [...savedOpportunities, opportunityId];
    
    setSavedOpportunities(newSaved);
    localStorage.setItem('dropskills_saved_opportunities', JSON.stringify(newSaved));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-xl flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Agent Veille IA
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Automatisez votre veille concurrentielle et technologique avec l'IA
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-1 flex">
          {[
            { id: 'setup', label: 'Configuration', icon: Target },
            { id: 'opportunities', label: 'Opportunités', icon: TrendingUp },
            { id: 'trends', label: 'Tendances', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#ff0033] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Tab */}
      {activeTab === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Secteur & Zone */}
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#ff0033]" />
                Secteur & Zone Géographique
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secteur d'activité</label>
                  <select 
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                    value={formData.secteur || ''}
                    onChange={(e) => setFormData({...formData, secteur: e.target.value})}
                  >
                    <option value="">Sélectionner un secteur</option>
                    <option value="tech">Technologie</option>
                    <option value="formation">Formation</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="consulting">Consulting</option>
                    <option value="sante">Santé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Zone géographique</label>
                  <select 
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                    value={formData.zone || ''}
                    onChange={(e) => setFormData({...formData, zone: e.target.value})}
                  >
                    <option value="">Sélectionner une zone</option>
                    <option value="france">France</option>
                    <option value="europe">Europe</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Objectifs */}
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#ff0033]" />
                Objectifs de Veille
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Nouvelles opportunités business',
                  'Tendances émergentes',
                  'Analyse concurrentielle',
                  'Innovations technologiques',
                  'Niches inexploitées',
                  'Partenariats potentiels'
                ].map((objectif) => (
                  <label key={objectif} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#ff0033] bg-transparent border-gray-600 rounded focus:ring-[#ff0033]"
                    />
                    <span className="text-gray-300">{objectif}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Canaux de veille */}
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#ff0033]" />
                Canaux de Veille
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'LinkedIn', icon: '💼' },
                  { name: 'Twitter', icon: '🐦' },
                  { name: 'Reddit', icon: '🔴' },
                  { name: 'YouTube', icon: '📺' },
                  { name: 'Google Trends', icon: '📈' },
                  { name: 'Product Hunt', icon: '🚀' },
                  { name: 'GitHub', icon: '💻' },
                  { name: 'News Tech', icon: '📰' }
                ].map((canal) => (
                  <label key={canal.name} className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#ff0033] bg-transparent border-gray-600 rounded focus:ring-[#ff0033]"
                    />
                    <span className="text-xl">{canal.icon}</span>
                    <span className="text-gray-300 text-sm">{canal.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Lancer l'analyse */}
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Lancer l'Analyse</h3>
              <button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-[#ff0033] to-red-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Démarrer l'IA
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                L'analyse prend environ 2-3 minutes
              </p>
            </div>

            {/* Statistiques */}
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Dernière Analyse</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Opportunités détectées</span>
                  <span className="text-white font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Blue Ocean</span>
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Score moyen</span>
                  <span className="text-yellow-400 font-bold">78/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Dernière mise à jour</span>
                  <span className="text-gray-300 text-sm">Il y a 2h</span>
                </div>
              </div>
            </div>

            {/* Alertes */}
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#ff0033]" />
                Alertes Actives
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Nouvelles opportunités IA</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-300">Tendances émergentes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Concurrence faible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opportunités Tab */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* Filtres */}
          <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 font-medium">Filtres :</span>
              </div>
              <select className="bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option>Tous les secteurs</option>
                <option>Tech</option>
                <option>Formation</option>
                <option>E-commerce</option>
              </select>
              <select className="bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm">
                <option>Score : Tous</option>
                <option>Score &gt; 80</option>
                <option>Score &gt; 70</option>
                <option>Score &gt; 60</option>
              </select>
              <button className="bg-[#ff0033] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-colors">
                Blue Ocean uniquement
              </button>
            </div>
          </div>

          {/* Liste des opportunités */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opportunities.map((opportunity, index) => (
              <div
                key={opportunity.id}
                className="bg-[#111111] border border-[#232323] rounded-xl p-6 hover:border-[#333] transition-all duration-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{opportunity.titre}</h3>
                      {opportunity.isBlueOcean && (
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                          Blue Ocean
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{opportunity.description}</p>
                  </div>
                  <button
                    onClick={() => handleSaveOpportunity(opportunity.id)}
                    className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${
                      savedOpportunities.includes(opportunity.id) 
                        ? 'text-[#ff0033] fill-current' 
                        : 'text-gray-400'
                    }`} />
                  </button>
                </div>

                {/* Score global */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 font-medium">Score Global</span>
                    <span className="text-white font-bold">{opportunity.scoring.scoreGlobal}/100</span>
                  </div>
                  <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#ff0033] to-red-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${opportunity.scoring.scoreGlobal}%` }}
                    ></div>
                  </div>
                </div>

                {/* Métriques détaillées */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Pertinence', value: opportunity.scoring.pertinence, color: 'text-green-400' },
                    { label: 'Nouveauté', value: opportunity.scoring.nouveaute, color: 'text-blue-400' },
                    { label: 'Potentiel €', value: opportunity.scoring.potentielFinancier, color: 'text-yellow-400' },
                    { label: 'Concurrence', value: 100 - opportunity.scoring.niveauConcurrence, color: 'text-purple-400' }
                  ].map((metric) => (
                    <div key={metric.label} className="text-center">
                      <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                      <div className="text-xs text-gray-400">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {opportunity.tags.map((tag) => (
                    <span key={tag} className="bg-[#1a1a1a] text-gray-400 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions recommandées */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Actions recommandées :</h4>
                  <ul className="space-y-1">
                    {opportunity.actionsRecommandees.slice(0, 2).map((action, idx) => (
                      <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#232323]">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(opportunity.dateDetection).toLocaleDateString('fr-FR')}
                    <span>•</span>
                    <span>{opportunity.canal}</span>
                  </div>
                  <button className="text-[#ff0033] text-xs hover:underline">
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tendances Tab */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tendances principales */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#ff0033]" />
                Tendances Émergentes
              </h3>
              <div className="space-y-4">
                {[
                  { trend: 'IA Conversationnelle pour PME', growth: '+245%', confidence: 92 },
                  { trend: 'Formation IA pour Seniors', growth: '+180%', confidence: 88 },
                  { trend: 'Audit IA E-commerce', growth: '+156%', confidence: 85 },
                  { trend: 'Automatisation No-Code', growth: '+134%', confidence: 82 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">{item.trend}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-green-400 text-sm font-medium">{item.growth}</span>
                        <span className="text-gray-400 text-sm">Confiance: {item.confidence}%</span>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Signaux Faibles
              </h3>
              <div className="space-y-3">
                {[
                  'Augmentation des recherches "IA éthique"',
                  'Émergence du terme "AI-first business"',
                  'Croissance des formations IA en français',
                  'Intérêt pour l\'IA explicable'
                ].map((signal, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar métriques */}
          <div className="space-y-6">
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Métriques Clés</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#ff0033] mb-1">3</div>
                  <div className="text-sm text-gray-400">Opportunités Blue Ocean</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">78</div>
                  <div className="text-sm text-gray-400">Score Moyen Pertinence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">€2.5M</div>
                  <div className="text-sm text-gray-400">Potentiel Total Estimé</div>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Secteurs Prioritaires</h3>
              <div className="space-y-3">
                {[
                  { sector: 'IA & Tech', percentage: 45 },
                  { sector: 'Formation', percentage: 30 },
                  { sector: 'E-commerce', percentage: 15 },
                  { sector: 'Consulting', percentage: 10 }
                ].map((item) => (
                  <div key={item.sector}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">{item.sector}</span>
                      <span className="text-white text-sm">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#ff0033] to-red-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgentVeillePage() {
  return (
    <ToolLayout toolId="agent-veille">
      <PremiumGuard feature="Agent de Veille IA">
        <AgentVeilleContent />
      </PremiumGuard>
    </ToolLayout>
  );
}