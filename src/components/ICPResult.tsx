'use client';

import { useState } from 'react';
import { Download, ArrowRight, ArrowLeft, User, Brain, AlertTriangle, MapPin, MessageCircle, DollarSign, Target, CheckCircle, Sparkles } from 'lucide-react';
import { ICPAnalysis } from '@/app/outils/icp-maker/page';

interface ICPResultProps {
  analysis: ICPAnalysis;
  onBackToWizard: () => void;
}

export function ICPResult({ analysis, onBackToWizard }: ICPResultProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Ici on pourrait intégrer une librairie comme jsPDF ou appeler une API
      // Pour l'instant, on simule le téléchargement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulation du téléchargement
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = 'icp-analysis.json';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGenerateOffer = () => {
    // Sauvegarder les données ICP pour l'USP Maker
    localStorage.setItem('dropskills_icp_data', JSON.stringify(analysis));
    // Redirection vers l'USP Maker
    window.location.href = '/outils/usp-maker';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎯 Votre ICP est prêt !
            </h1>
            <p className="text-gray-600">
              Analyse complète de votre client idéal générée par l'IA
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
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Génération...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Profil Sociodémographique */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Profil Sociodémographique</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Âge</h3>
            <p className="text-gray-700">{analysis.profilSociodemographique.age}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Sexe</h3>
            <p className="text-gray-700">{analysis.profilSociodemographique.sexe}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Localisation</h3>
            <p className="text-gray-700">{analysis.profilSociodemographique.localisation}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Situation Pro</h3>
            <p className="text-gray-700">{analysis.profilSociodemographique.situationPro}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Niveau de Revenus</h3>
            <p className="text-gray-700">{analysis.profilSociodemographique.niveauRevenus}</p>
          </div>
        </div>
      </div>

      {/* Psychologie et Motivations */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Psychologie & Motivations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-700 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Besoins
            </h3>
            <ul className="space-y-2">
              {analysis.psychologieMotivations.besoins.map((besoin, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {besoin}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-700 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Désirs
            </h3>
            <ul className="space-y-2">
              {analysis.psychologieMotivations.desirs.map((desir, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {desir}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-red-700 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Peurs
            </h3>
            <ul className="space-y-2">
              {analysis.psychologieMotivations.peurs.map((peur, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {peur}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-orange-700 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Objections
            </h3>
            <ul className="space-y-2">
              {analysis.psychologieMotivations.objections.map((objection, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {objection}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Problèmes Principaux */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Problèmes Principaux</h2>
        </div>
        
        <div className="space-y-3">
          {analysis.problemePrincipaux.map((probleme, index) => (
            <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-gray-800">{probleme}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Où le trouver */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Où le trouver ?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Canaux</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.ouLeTrouver.canaux.map((canal, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {canal}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Plateformes</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.ouLeTrouver.plateformes.map((plateforme, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {plateforme}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Groupes</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.ouLeTrouver.groupes.map((groupe, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {groupe}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Événements</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.ouLeTrouver.evenements.map((evenement, index) => (
                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {evenement}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messaging Impactant */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Messaging Impactant</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Expressions clés</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.messagingImpactant.expressions.map((expression, index) => (
                <span key={index} className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium">
                  "{expression}"
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Accroches efficaces</h3>
            <div className="space-y-2">
              {analysis.messagingImpactant.accroches.map((accroche, index) => (
                <div key={index} className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg">
                  <p className="text-gray-800 italic">"{accroche}"</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Style de discours</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800">{analysis.messagingImpactant.styleDiscours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget & Pouvoir d'achat */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Budget & Pouvoir d'achat</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Budget Typique</h3>
            <p className="text-gray-700 text-lg font-medium">{analysis.budgetPouvoirAchat.budgetTypique}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Fréquence d'achat</h3>
            <p className="text-gray-700">{analysis.budgetPouvoirAchat.frequenceAchat}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Facteurs Prix</h3>
            <ul className="space-y-1">
              {analysis.budgetPouvoirAchat.facteursPrix.map((facteur, index) => (
                <li key={index} className="text-gray-700 text-sm">• {facteur}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Segments */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Segmentation</h2>
        </div>
        
        <div className="space-y-6">
          {/* Segment Principal */}
          <div className="border-2 border-teal-200 rounded-lg p-6 bg-teal-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-teal-900">{analysis.segments.principal.nom}</h3>
              <span className="px-3 py-1 bg-teal-200 text-teal-800 rounded-full text-sm font-medium">
                {analysis.segments.principal.pourcentage}
              </span>
            </div>
            <p className="text-teal-800">{analysis.segments.principal.description}</p>
          </div>
          
          {/* Variantes */}
          {analysis.segments.variantes.map((variante, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{variante.nom}</h3>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                  {variante.pourcentage}
                </span>
              </div>
              <p className="text-gray-700">{variante.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fiche Actionable */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">🚀 Fiche Actionable</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Résumé Exécutif</h3>
            <p className="text-blue-100 leading-relaxed">{analysis.ficheActionable.resumeExecutif}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Priorités Marketing</h3>
              <ul className="space-y-2">
                {analysis.ficheActionable.prioritesMarketing.map((priorite, index) => (
                  <li key={index} className="flex items-start text-blue-100">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {priorite}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Prochaines Étapes</h3>
              <ul className="space-y-2">
                {analysis.ficheActionable.prochainEtapes.map((etape, index) => (
                  <li key={index} className="flex items-start text-blue-100">
                    <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {etape}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Métriques à Suivre</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.ficheActionable.metriquesACles.map((metrique, index) => (
                <span key={index} className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {metrique}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Prêt à passer à l'action ?
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isGeneratingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Génération PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Télécharger l'ICP complet</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleGenerateOffer}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            <span>Enchaîner avec USP Maker IA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 