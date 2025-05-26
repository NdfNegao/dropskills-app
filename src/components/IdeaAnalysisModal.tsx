'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Zap,
  Loader2,
  Lightbulb
} from 'lucide-react';

interface IdeaAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: {
    title: string;
    description: string;
    revenue?: string;
  };
}

interface AnalysisData {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    differentiator: string;
    alerts: string[];
  };
  actionPlan: {
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
      aiTools: string[];
    };
    step3: {
      title: string;
      description: string;
    };
  };
  keyMetrics: {
    revenueEstimate: {
      min: string;
      max: string;
    };
    weeklyHours: string;
    majorAlert: string;
  };
  cta?: string;
}

export default function IdeaAnalysisModal({ isOpen, onClose, idea }: IdeaAnalysisModalProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeIdea = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ideas/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          potentialRevenue: idea.revenue
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'analyse');
      }

      const data = await response.json();
      
      if (data.success && data.analysis) {
        setAnalysisData(data.analysis);
      } else {
        throw new Error('Format de réponse invalide');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'analyse');
    } finally {
      setIsLoading(false);
    }
  };

  // Lancer l'analyse automatiquement à l'ouverture
  useEffect(() => {
    if (isOpen && !analysisData && !isLoading) {
      analyzeIdea();
    }
  }, [isOpen]);

  // Réinitialiser les données quand le modal se ferme
  useEffect(() => {
    if (!isOpen) {
      setAnalysisData(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] rounded-xl border border-[#232323] w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#232323]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ff0033]/10 rounded-lg">
              <Target className="w-6 h-6 text-[#ff0033]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Analyse IA de votre idée</h2>
              <p className="text-gray-400 text-sm">Plan d'action personnalisé en 6 mois</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#232323] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Idée analysée */}
          <div className="bg-[#0a0a0a] rounded-lg p-4 mb-6 border border-[#232323]">
            <h3 className="text-lg font-semibold text-white mb-2">{idea.title}</h3>
            <p className="text-gray-400 text-sm">{idea.description}</p>
            {idea.revenue && (
              <div className="mt-2">
                <span className="text-green-400 text-sm font-medium">{idea.revenue}</span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff0033] mx-auto mb-3" />
                <p className="text-white font-medium">Analyse en cours...</p>
                <p className="text-gray-400 text-sm">L'IA analyse votre idée et prépare un plan d'action</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-red-400 font-medium">Erreur d'analyse</h3>
              </div>
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={analyzeIdea}
                className="mt-3 bg-red-500/20 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-500/30 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Analysis Results */}
          {analysisData && (
            <div className="space-y-6">
              {/* 1. Analyse Express */}
              <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#232323]">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Analyse Express</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Forces */}
                  <div>
                    <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Forces
                    </h4>
                    <ul className="space-y-1">
                      {analysisData.analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Faiblesses */}
                  <div>
                    <h4 className="text-orange-400 font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Points d'attention
                    </h4>
                    <ul className="space-y-1">
                      {analysisData.analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Différenciateur */}
                {analysisData.analysis.differentiator && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                    <h4 className="text-blue-400 font-medium mb-1">Point différenciant</h4>
                    <p className="text-gray-300 text-sm">{analysisData.analysis.differentiator}</p>
                  </div>
                )}

                {/* Alertes */}
                {analysisData.analysis.alerts.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <h4 className="text-red-400 font-medium mb-2">⚠️ Alertes importantes</h4>
                    <ul className="space-y-1">
                      {analysisData.analysis.alerts.map((alert, index) => (
                        <li key={index} className="text-red-300 text-sm">• {alert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Plan d'action 3 étapes */}
              <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#232323]">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#ff0033]" />
                  <h3 className="text-lg font-semibold text-white">Plan d'action 3 étapes</h3>
                </div>

                <div className="space-y-4">
                  {/* Étape 1 */}
                  <div className="border border-[#232323] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-[#ff0033] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <h4 className="text-white font-medium">{analysisData.actionPlan.step1.title}</h4>
                    </div>
                    <p className="text-gray-300 text-sm">{analysisData.actionPlan.step1.description}</p>
                  </div>

                  {/* Étape 2 */}
                  <div className="border border-[#232323] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-[#ff0033] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <h4 className="text-white font-medium">{analysisData.actionPlan.step2.title}</h4>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{analysisData.actionPlan.step2.description}</p>
                    {analysisData.actionPlan.step2.aiTools.length > 0 && (
                      <div>
                        <h5 className="text-purple-400 text-sm font-medium mb-2 flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          Outils IA recommandés :
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {analysisData.actionPlan.step2.aiTools.map((tool, index) => (
                            <span key={index} className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Étape 3 */}
                  <div className="border border-[#232323] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-[#ff0033] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <h4 className="text-white font-medium">{analysisData.actionPlan.step3.title}</h4>
                    </div>
                    <p className="text-gray-300 text-sm">{analysisData.actionPlan.step3.description}</p>
                  </div>
                </div>
              </div>

              {/* 3. Chiffres clés */}
              <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#232323]">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Chiffres clés</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {analysisData.keyMetrics.revenueEstimate.min} - {analysisData.keyMetrics.revenueEstimate.max}
                    </div>
                    <div className="text-gray-400 text-sm">Revenus estimés (6 mois)</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1 flex items-center justify-center gap-1">
                      <Clock className="w-5 h-5" />
                      {analysisData.keyMetrics.weeklyHours}
                    </div>
                    <div className="text-gray-400 text-sm">Heures/semaine</div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-orange-400 font-medium mb-1">⚠️ Point de vigilance</div>
                    <div className="text-gray-300 text-sm">{analysisData.keyMetrics.majorAlert}</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/10 border border-[#ff0033]/20 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">🚀 Passe à l'action : commence dès aujourd'hui !</h3>
                <p className="text-gray-300 mb-4">
                  {analysisData.cta || "Tu as maintenant tous les éléments pour réussir. L'IA sera ton meilleur allié pour accélérer ta croissance !"}
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors"
                >
                  C'est parti ! 🔥
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 