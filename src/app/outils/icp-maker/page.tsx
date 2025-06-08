'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/PremiumGuard';
import ICPWizardV2 from '@/components/ICPWizardV2';
import ICPResult from '@/components/ICPResult';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  RefreshCw, 
  Download, 
  Loader2, 
  AlertCircle,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  Copy,
  BrainCog
} from 'lucide-react';

import { ICPFormData, ICPAnalysis } from '@/types/icp';
import { buildPrompt } from '@/lib/icpPromptBuilder';



function ICPMakerContent() {
  const [icpResult, setIcpResult] = useState<ICPAnalysis | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<ICPFormData | null>(null);
  const [formData, setFormData] = useState<ICPFormData>({
    secteur: '',
    produitService: '',
    promesseUnique: '',
    budgetCible: '',
    canaux: [],
    tonalite: '',
    geographie: '',
    objectifs: '',
    defis: '',
    valeurs: ''
  });


  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedResult = localStorage.getItem('dropskills_icp_maker_data');
    const savedFormData = localStorage.getItem('dropskills_icp_maker_form_data');
    
    if (savedResult && savedFormData) {
      try {
        setIcpResult(JSON.parse(savedResult));
        setLastFormData(JSON.parse(savedFormData));
        setShowWizard(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
        localStorage.removeItem('dropskills_icp_maker_data');
        localStorage.removeItem('dropskills_icp_maker_form_data');
      }
    }
  }, []);

  const handleGenerate = async (wizardData: ICPFormData) => {
    if (!wizardData.secteur || !wizardData.produitService) {
      setError('Veuillez remplir au minimum le secteur et le produit/service.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFormData(wizardData);
    setLastFormData(wizardData);
    setMetadata(null);
    try {
      // Construction du prompt dynamique
      const dynamicPrompt = buildPrompt(wizardData);
      const payload = {
        ...wizardData,
        prompt: dynamicPrompt
      };
      const response = await fetch('/api/icp/generate-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la génération');
      }
      setIcpResult(result.analysis);
      setMetadata(result.metadata || null);
      setShowWizard(false);
      localStorage.setItem('dropskills_icp_maker_data', JSON.stringify(result.analysis));
      localStorage.setItem('dropskills_icp_maker_form_data', JSON.stringify(wizardData));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGeneration = () => {
    setShowWizard(true);
    setIcpResult(null);
    setError(null);
    localStorage.removeItem('dropskills_icp_maker_data');
    localStorage.removeItem('dropskills_icp_maker_form_data');
  };

  const handleRegenerate = async () => {
    if (lastFormData) {
      await handleGenerate(lastFormData);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportToPDF = () => {
    if (icpResult) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>ICP Analysis - Dropskills</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1, h2, h3 { color: #333; }
                .section { margin-bottom: 20px; }
                ul { margin: 10px 0; }
                li { margin: 5px 0; }
              </style>
            </head>
            <body>
              <h1>Profil Client Idéal (ICP)</h1>
              ${JSON.stringify(icpResult, null, 2).replace(/\n/g, '<br>').replace(/\{|\}/g, '')}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  // Données initiales pour le wizard
  const initialData: ICPFormData = lastFormData || {
    secteur: '',
    produitService: '',
    promesseUnique: '',
    budgetCible: '',
    canaux: [],
    tonalite: '',
    objectifs: '',
    defis: '',
    valeurs: ''
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* Badge premium */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-xs font-bold text-gray-900 shadow border border-yellow-300 animate-pulse">Premium IA</span>
          {metadata?.generatedBy && (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-xs font-semibold text-white shadow border border-blue-300 ml-2">
              {metadata.generatedBy}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-semibold">4,892</p>
                <p className="text-gray-400 text-sm">ICP générés</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-semibold">+89%</p>
                <p className="text-gray-400 text-sm">Précision targeting</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-semibold">2,347</p>
                <p className="text-gray-400 text-sm">Entrepreneurs actifs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conseil */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 mb-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-white font-semibold mb-2">Conseils pour un ICP efficace</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p><strong>Optimisation :</strong> Plus vous êtes précis dans vos réponses, plus l'IA pourra créer un profil client détaillé et actionnable.</p>
              <p><strong>Utilisation des résultats :</strong> Utilisez votre ICP pour adapter vos messages marketing, choisir vos canaux de communication et affiner votre stratégie commerciale.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Wizard ou Résultats */}
        {showWizard ? (
          <ICPWizardV2
            initialData={initialData}
            onComplete={handleGenerate}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bouton Nouveau */}
            <div className="lg:col-span-2 flex justify-center mb-6">
              <button
                onClick={handleNewGeneration}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau ICP
              </button>
            </div>
            {/* Résultats */}
            <ICPResult
              result={icpResult}
              metadata={metadata}
              error={error}
              onRegenerate={handleRegenerate}
              onExport={exportToPDF}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ICPMakerPage() {
  return (
    <ToolLayout toolId="icp-maker">
      <PremiumGuard feature="ICP Maker IA">
        <ICPMakerContent />
      </PremiumGuard>
    </ToolLayout>
  );
}