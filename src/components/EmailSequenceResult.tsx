'use client';

import { useState } from 'react';
import { Download, RefreshCw, ArrowLeft, ArrowRight, Mail, Copy, CheckCircle, Plus, ChevronLeft, ChevronRight, Clock, TrendingUp, Target, Zap, BarChart3, ExternalLink } from 'lucide-react';
import { EmailSequenceAnalysis } from '@/app/outils/copymoneymail/page';

interface EmailSequenceResultProps {
  analysis: EmailSequenceAnalysis;
  onBackToWizard: () => void;
  onRegenerate: () => void;
  onAddEmail: () => void;
  isRegenerating: boolean;
}

export function EmailSequenceResult({ analysis, onBackToWizard, onRegenerate, onAddEmail, isRegenerating }: EmailSequenceResultProps) {
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const currentEmail = analysis.emails[currentEmailIndex];

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

  const handleCopyEmail = () => {
    const emailContent = `Sujet: ${currentEmail.sujet}\n\n${currentEmail.corpsMessage}\n\n---\nVariante sujet: ${currentEmail.varianteSujet}`;
    handleCopy(emailContent, `Email ${currentEmail.numeroEmail}`);
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let content = `SÉQUENCE EMAIL - ${analysis.sequenceInfo.titre}\n`;
      content += `${analysis.sequenceInfo.description}\n\n`;
      content += `Durée totale: ${analysis.sequenceInfo.dureeTotal}\n`;
      content += `Objectif: ${analysis.sequenceInfo.objectifGlobal}\n\n`;
      content += '='.repeat(80) + '\n\n';
      
      analysis.emails.forEach((email) => {
        content += `EMAIL ${email.numeroEmail} - ${email.objectifEmail}\n`;
        content += '-'.repeat(40) + '\n';
        content += `Moment d'envoi: ${email.momentEnvoi}\n`;
        content += `Conseils: ${email.conseilsEnvoi}\n\n`;
        content += `SUJET: ${email.sujet}\n`;
        content += `VARIANTE: ${email.varianteSujet}\n\n`;
        content += `CORPS DU MESSAGE:\n${email.corpsMessage}\n\n`;
        content += `MÉTRIQUES ESTIMÉES:\n`;
        content += `- Taux d'ouverture: ${email.metriquesEstimees.tauxOuverture}%\n`;
        content += `- Taux de clic: ${email.metriquesEstimees.tauxClic}%\n`;
        content += `- Taux de conversion: ${email.metriquesEstimees.tauxConversion}%\n\n`;
        content += '='.repeat(80) + '\n\n';
      });
      
      content += `\nCONSEILS GÉNÉRAUX:\n`;
      content += `Segmentation: ${analysis.conseilsGeneraux.segmentation.join(', ')}\n`;
      content += `Automatisation: ${analysis.conseilsGeneraux.automatisation.join(', ')}\n`;
      content += `Optimisation: ${analysis.conseilsGeneraux.optimisation.join(', ')}\n`;
      content += `Délivrabilité: ${analysis.conseilsGeneraux.delivrabilite.join(', ')}\n\n`;
      
      content += `OUTILS RECOMMANDÉS: ${analysis.outilsRecommandes.join(', ')}\n`;
      content += `PROCHAINES ÉTAPES: ${analysis.prochainEtapes.join(', ')}\n`;
      
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'sequence-email-complete.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreviousEmail = () => {
    if (currentEmailIndex > 0) {
      setCurrentEmailIndex(currentEmailIndex - 1);
    }
  };

  const handleNextEmail = () => {
    if (currentEmailIndex < analysis.emails.length - 1) {
      setCurrentEmailIndex(currentEmailIndex + 1);
    }
  };

  const getMetriqueColor = (score: number) => {
    if (score >= 30) return 'text-green-600';
    if (score >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetriqueIcon = (score: number) => {
    if (score >= 30) return '🔥';
    if (score >= 20) return '👍';
    return '⚠️';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              💰 Votre Séquence Email est prête !
            </h1>
            <p className="text-gray-600">
              {analysis.sequenceInfo.titre} - {analysis.emails.length} emails qui convertissent
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
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
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

        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {getMetriqueIcon(analysis.metriquesGlobales.tauxOuvertureEstime)} {analysis.metriquesGlobales.tauxOuvertureEstime}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Taux d'ouverture estimé</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {getMetriqueIcon(analysis.metriquesGlobales.tauxClicEstime)} {analysis.metriquesGlobales.tauxClicEstime}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Taux de clic estimé</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {getMetriqueIcon(analysis.metriquesGlobales.tauxConversionEstime)} {analysis.metriquesGlobales.tauxConversionEstime}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Taux de conversion estimé</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              💰 {analysis.metriquesGlobales.revenusEstimes}
            </div>
            <p className="text-sm text-gray-600 mt-1">Revenus estimés</p>
          </div>
        </div>
      </div>

      {/* Navigation emails */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Email {currentEmail.numeroEmail} sur {analysis.emails.length}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousEmail}
              disabled={currentEmailIndex === 0}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-1">
              {analysis.emails.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEmailIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentEmailIndex 
                      ? 'bg-indigo-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextEmail}
              disabled={currentEmailIndex === analysis.emails.length - 1}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info email actuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{currentEmail.momentEnvoi}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{currentEmail.objectifEmail}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BarChart3 className="w-4 h-4" />
            <span>
              {currentEmail.metriquesEstimees.tauxOuverture}% ouverture, 
              {currentEmail.metriquesEstimees.tauxClic}% clic
            </span>
          </div>
        </div>

        {/* Contenu email */}
        <div className="space-y-6">
          {/* Sujets */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">📧 Lignes de sujet</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Sujet principal (A)</span>
                  <button
                    onClick={() => handleCopy(currentEmail.sujet, 'Sujet A')}
                    className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {copiedText === 'Sujet A' ? (
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
                <p className="text-gray-900 font-medium">{currentEmail.sujet}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Variante (B)</span>
                  <button
                    onClick={() => handleCopy(currentEmail.varianteSujet, 'Sujet B')}
                    className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {copiedText === 'Sujet B' ? (
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
                <p className="text-gray-900 font-medium">{currentEmail.varianteSujet}</p>
              </div>
            </div>
          </div>

          {/* Corps du message */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">📝 Corps du message</h3>
              <button
                onClick={() => handleCopy(currentEmail.corpsMessage, 'Corps')}
                className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
              >
                {copiedText === 'Corps' ? (
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
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">{currentEmail.corpsMessage}</pre>
              </div>
            </div>
          </div>

          {/* Conseils d'envoi */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 Conseils d'envoi</h3>
            <p className="text-blue-800">{currentEmail.conseilsEnvoi}</p>
          </div>
        </div>

        {/* Actions email */}
        <div className="flex justify-center mt-6 space-x-3">
          <button
            onClick={handleCopyEmail}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {copiedText === `Email ${currentEmail.numeroEmail}` ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Email copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copier cet email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conseils généraux */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Conseils pour maximiser vos résultats</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Segmentation
            </h3>
            <ul className="space-y-2">
              {analysis.conseilsGeneraux.segmentation.map((conseil, index) => (
                <li key={index} className="text-blue-800 text-sm flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
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
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
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
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Délivrabilité
            </h3>
            <ul className="space-y-2">
              {analysis.conseilsGeneraux.delivrabilite.map((conseil, index) => (
                <li key={index} className="text-orange-800 text-sm flex items-start">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Outils et prochaines étapes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2 text-indigo-600" />
            Outils recommandés
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.outilsRecommandes.map((outil, index) => (
              <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium">
                {outil}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-green-600" />
            Prochaines étapes
          </h3>
          <ul className="space-y-2">
            {analysis.prochainEtapes.map((etape, index) => (
              <li key={index} className="text-gray-700 flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                {etape}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions finales */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Prêt à lancer votre séquence ?
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Téléchargement...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Télécharger toute la séquence</span>
              </>
            )}
          </button>
          
          <button
            onClick={onAddEmail}
            disabled={isRegenerating}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un email</span>
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
                <span>Régénérer la séquence</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 