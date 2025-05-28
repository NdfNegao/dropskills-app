'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, RefreshCw, ArrowRight, ArrowLeft, Sparkles, Target, Brain, TrendingUp, MessageCircle, BarChart3, CheckCircle, ExternalLink } from 'lucide-react';
import { USPAnalysis } from '@/app/outils/usp-maker/page';

interface USPResultProps {
  analysis: USPAnalysis;
  onBackToWizard: () => void;
  onReformulate: () => void;
  isReformulating: boolean;
}

export function USPResult({ analysis, onBackToWizard, onReformulate, isReformulating }: USPResultProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isGeneratingTunnel, setIsGeneratingTunnel] = useState(false);
  const router = useRouter();

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      alert('Erreur lors de la copie');
    }
  };

  const handleGenerateTunnel = () => {
    // Sauvegarder les données USP pour le Tunnel Maker
    localStorage.setItem('dropskills_usp_data', JSON.stringify(analysis));
    // Redirection vers Tunnel Maker IA
    router.push('/outils/tunnel-maker');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '🔥';
    if (score >= 60) return '👍';
    return '⚠️';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ✨ Votre USP est prête !
            </h1>
            <p className="text-gray-600">
              Proposition de valeur unique générée par l'IA
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
              onClick={onReformulate}
              disabled={isReformulating}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isReformulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Reformulation...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Reformuler</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* USP Principale */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">USP Principale</h2>
        </div>
        
        <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
          <p className="text-2xl font-bold leading-relaxed mb-4">
            "{analysis.uspPrincipale}"
          </p>
          <button
            onClick={() => handleCopy(analysis.uspPrincipale, 'USP Principale')}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
          >
            {copiedText === 'USP Principale' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copier l'USP</span>
              </>
            )}
          </button>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {getScoreIcon(analysis.metriques.scoreImpact)} {analysis.metriques.scoreImpact}%
            </div>
            <div className="text-sm opacity-90">Score d'Impact</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {getScoreIcon(analysis.metriques.memorabilite)} {analysis.metriques.memorabilite}%
            </div>
            <div className="text-sm opacity-90">Mémorabilité</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {getScoreIcon(analysis.metriques.clarte)} {analysis.metriques.clarte}%
            </div>
            <div className="text-sm opacity-90">Clarté</div>
          </div>
        </div>
      </div>

      {/* Variantes */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">3 Variantes d'USP</h2>
        </div>
        
        <div className="space-y-6">
          {/* Variante Rationnelle */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="w-5 h-5 text-blue-600 mr-2" />
                Angle Rationnel
              </h3>
              <button
                onClick={() => handleCopy(analysis.variantes.rationnel, 'Variante Rationnelle')}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {copiedText === 'Variante Rationnelle' ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-700 italic">"{analysis.variantes.rationnel}"</p>
          </div>

          {/* Variante Émotionnelle */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageCircle className="w-5 h-5 text-pink-600 mr-2" />
                Angle Émotionnel
              </h3>
              <button
                onClick={() => handleCopy(analysis.variantes.emotionnel, 'Variante Émotionnelle')}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
              >
                {copiedText === 'Variante Émotionnelle' ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-700 italic">"{analysis.variantes.emotionnel}"</p>
          </div>

          {/* Variante Exclusive */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                Angle Exclusif
              </h3>
              <button
                onClick={() => handleCopy(analysis.variantes.exclusif, 'Variante Exclusive')}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                {copiedText === 'Variante Exclusive' ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-700 italic">"{analysis.variantes.exclusif}"</p>
          </div>
        </div>
      </div>

      {/* Explication */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Pourquoi cette USP va convertir</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Pourquoi ce positionnement</h3>
            <p className="text-gray-700">{analysis.explication.pourquoi}</p>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Votre différenciateur clé</h3>
            <p className="text-gray-700">{analysis.explication.differenciateur}</p>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Impact attendu</h3>
            <p className="text-gray-700">{analysis.explication.impact}</p>
          </div>
        </div>
      </div>

      {/* Conseils d'utilisation */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Comment utiliser votre USP</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="font-semibold text-indigo-900 mb-3 flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              Page de vente
            </h3>
            <p className="text-indigo-800 text-sm leading-relaxed">{analysis.conseilUtilisation.pageSale}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Publicité
            </h3>
            <p className="text-purple-800 text-sm leading-relaxed">{analysis.conseilUtilisation.publicite}</p>
          </div>
          
          <div className="bg-pink-50 rounded-lg p-6">
            <h3 className="font-semibold text-pink-900 mb-3 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Réseaux sociaux
            </h3>
            <p className="text-pink-800 text-sm leading-relaxed">{analysis.conseilUtilisation.reseauxSociaux}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Email marketing
            </h3>
            <p className="text-green-800 text-sm leading-relaxed">{analysis.conseilUtilisation.emailMarketing}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Prêt à transformer votre USP en ventes ?
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleCopy(analysis.uspPrincipale, 'USP Complète')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {copiedText === 'USP Complète' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>USP copiée !</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copier l'USP principale</span>
              </>
            )}
          </button>
          
          <button
            onClick={onReformulate}
            disabled={isReformulating}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isReformulating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Reformulation...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Générer de nouvelles variantes</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleGenerateTunnel}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            <span>Enchaîner avec Tunnel Maker IA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 