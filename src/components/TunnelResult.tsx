'use client';

import { useState } from 'react';
import { Download, RefreshCw, ArrowLeft, ArrowRight, Mail, Target, Lightbulb, Zap, BarChart3, CheckCircle, ExternalLink, ChevronRight, Clock, TrendingUp } from 'lucide-react';
import { TunnelAnalysis } from '@/app/outils/tunnel-maker/page';

interface TunnelResultProps {
  analysis: TunnelAnalysis;
  onBackToWizard: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function TunnelResult({ analysis, onBackToWizard, onRegenerate, isRegenerating }: TunnelResultProps) {
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleDownloadPlan = async () => {
    setIsGeneratingPlan(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulation du téléchargement
      const planContent = `
PLAN DE TUNNEL DE VENTE - ${new Date().toLocaleDateString()}

SCHÉMA DU TUNNEL:
${analysis.schemaTunnel.etapes.map((etape, index) => `${index + 1}. ${etape}`).join('\n')}

DESCRIPTION:
${analysis.schemaTunnel.description}

DURÉE ESTIMÉE: ${analysis.schemaTunnel.dureeEstimee}

ÉTAPES DÉTAILLÉES:
${analysis.etapesDetaillees.map((etape, index) => `
${index + 1}. ${etape.nom}
   Objectif: ${etape.objectif}
   Message clé: ${etape.messageCle}
   Call-to-action: ${etape.callToAction}
   Objection à lever: ${etape.objectionALever}
   Conseils copywriting: ${etape.conseilsCopywriting.join(', ')}
   Automatisation: ${etape.automatisationSuggestions.join(', ')}
`).join('\n')}

CONSEILS GÉNÉRAUX:
Copywriting: ${analysis.conseilsGeneraux.copywriting.join(', ')}
Automatisation: ${analysis.conseilsGeneraux.automatisation.join(', ')}
Optimisation: ${analysis.conseilsGeneraux.optimisation.join(', ')}

OUTILS RECOMMANDÉS:
${analysis.outilsRecommandes.join(', ')}
      `;
      
      const element = document.createElement('a');
      const file = new Blob([planContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'plan-tunnel-de-vente.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
    } catch (error) {
      console.error('Erreur lors de la génération du plan:', error);
      alert('Erreur lors de la génération du plan');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleGenerateEmails = () => {
    // Sauvegarder les données du tunnel pour CopyMoneyMail
    localStorage.setItem('dropskills_tunnel_data', JSON.stringify(analysis));
    // Redirection vers CopyMoneyMail AI
    window.location.href = '/outils/copymoneymail';
  };

  const getMetriqueColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMetriqueIcon = (score: number) => {
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
              🚀 Votre Tunnel de Vente est prêt !
            </h1>
            <p className="text-gray-600">
              Structure optimisée générée par l'IA pour maximiser vos conversions
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
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              {isRegenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Régénération...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Régénérer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Schéma du Tunnel */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Schéma du Tunnel</h2>
            <p className="text-orange-100">{analysis.schemaTunnel.description}</p>
          </div>
        </div>
        
        {/* Visualisation du tunnel */}
        <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {analysis.schemaTunnel.etapes.map((etape, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-center min-w-0">
                  <div className="text-sm font-medium">{etape}</div>
                </div>
                {index < analysis.schemaTunnel.etapes.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-white opacity-70" />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Durée: {analysis.schemaTunnel.dureeEstimee}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>{analysis.schemaTunnel.etapes.length} étapes</span>
            </div>
          </div>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {getMetriqueIcon(analysis.metriques.tauxConversionEstime)} {analysis.metriques.tauxConversionEstime}%
            </div>
            <div className="text-sm opacity-90">Taux de Conversion</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {getMetriqueIcon(analysis.metriques.complexite)} {analysis.metriques.complexite}/10
            </div>
            <div className="text-sm opacity-90">Complexité</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {getMetriqueIcon(analysis.metriques.potentielROI)} {analysis.metriques.potentielROI}x
            </div>
            <div className="text-sm opacity-90">Potentiel ROI</div>
          </div>
        </div>
      </div>

      {/* Étapes Détaillées */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Étapes Détaillées</h2>
        </div>
        
        <div className="space-y-6">
          {analysis.etapesDetaillees.map((etape, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{etape.nom}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🎯 Objectif</h4>
                    <p className="text-gray-700 text-sm">{etape.objectif}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">💬 Message clé</h4>
                    <p className="text-gray-700 text-sm italic">"{etape.messageCle}"</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🔥 Call-to-Action</h4>
                    <p className="text-gray-700 text-sm font-medium">{etape.callToAction}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">⚠️ Objection à lever</h4>
                    <p className="text-gray-700 text-sm">{etape.objectionALever}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">✍️ Conseils copywriting</h4>
                    <ul className="space-y-1">
                      {etape.conseilsCopywriting.map((conseil, idx) => (
                        <li key={idx} className="text-gray-700 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {conseil}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🤖 Automatisation</h4>
                    <ul className="space-y-1">
                      {etape.automatisationSuggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-gray-700 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conseils Généraux */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Conseils Généraux</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              Copywriting
            </h3>
            <ul className="space-y-2">
              {analysis.conseilsGeneraux.copywriting.map((conseil, index) => (
                <li key={index} className="text-blue-800 text-sm flex items-start">
                  <CheckCircle className="w-3 h-3 mt-0.5 mr-2 flex-shrink-0" />
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Automatisation
            </h3>
            <ul className="space-y-2">
              {analysis.conseilsGeneraux.automatisation.map((conseil, index) => (
                <li key={index} className="text-green-800 text-sm flex items-start">
                  <CheckCircle className="w-3 h-3 mt-0.5 mr-2 flex-shrink-0" />
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Optimisation
            </h3>
            <ul className="space-y-2">
              {analysis.conseilsGeneraux.optimisation.map((conseil, index) => (
                <li key={index} className="text-purple-800 text-sm flex items-start">
                  <CheckCircle className="w-3 h-3 mt-0.5 mr-2 flex-shrink-0" />
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Séquence Email */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Séquence Email Recommandée</h2>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">{analysis.sequenceEmail.description}</p>
        </div>
        
        <div className="space-y-4">
          {analysis.sequenceEmail.emails.map((email, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {email.jour}
                  </div>
                  <h4 className="font-medium text-gray-900">Jour {email.jour}</h4>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {email.objectif}
                </span>
              </div>
              <h5 className="font-medium text-gray-900 mb-2">📧 {email.sujet}</h5>
              <p className="text-gray-700 text-sm">{email.contenuCle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Outils Recommandés */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Outils Recommandés</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {analysis.outilsRecommandes.map((outil, index) => (
            <span key={index} className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
              {outil}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Prêt à mettre en place votre tunnel ?
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadPlan}
            disabled={isGeneratingPlan}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {isGeneratingPlan ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Génération...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Télécharger le plan complet</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleGenerateEmails}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>Générer avec CopyMoneyMail AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isRegenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Régénération...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Générer une nouvelle version</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 