'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import StepWizard, { WizardStep } from '@/components/StepWizard';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart3,
  Users,
  Target,
  Lightbulb,
  Package,
  Euro,
  Settings,
  RefreshCw
} from 'lucide-react';

interface CalculationFormData {
  productPrice: string;
  monthlySales: string;
  growthRate: string;
  fixedCosts: string;
  variableCosts: string;
}

interface CalculationResult {
  monthly: number;
  yearly: number;
  costs: number;
  profit: number;
  growth: number;
  formData: CalculationFormData;
}

interface StepProps {
  data: CalculationFormData;
  onChange: (updates: Partial<CalculationFormData>) => void;
  errors: Record<string, string>;
  isActive?: boolean;
}

// Composant pour l'étape des informations produit
function ProductInfoStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
        <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          💡 Conseils pour définir votre prix
        </h3>
        <div className="text-indigo-300 text-sm space-y-2">
          <p>• <strong>Prix psychologique :</strong> Testez différents prix pour maximiser les ventes</p>
          <p>• <strong>Analyse concurrentielle :</strong> Étudiez les prix de vos concurrents</p>
          <p>• <strong>Valeur perçue :</strong> Alignez votre prix sur la valeur apportée</p>
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">
          Prix du produit (€) *
          <span className="text-gray-400 text-sm ml-2">Le prix de vente unitaire de votre produit</span>
        </label>
        <input
          type="number"
          step="0.01"
          value={data.productPrice || ''}
          onChange={(e) => onChange({ ...data, productPrice: e.target.value })}
          className={`w-full bg-[#1a1a1a] border ${errors.productPrice ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none`}
          placeholder="Ex: 29.99"
        />
        {errors.productPrice && (
          <p className="text-red-400 text-sm mt-1">{errors.productPrice}</p>
        )}
      </div>

      <div>
        <label className="block text-white font-medium mb-2">
          Ventes mensuelles estimées (unités) *
          <span className="text-gray-400 text-sm ml-2">Nombre d&#39;unités vendues par mois</span>
        </label>
        <input
          type="number"
          value={data.monthlySales || ''}
          onChange={(e) => onChange({ ...data, monthlySales: e.target.value })}
          className={`w-full bg-[#1a1a1a] border ${errors.monthlySales ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none`}
          placeholder="Ex: 100"
        />
        {errors.monthlySales && (
          <p className="text-red-400 text-sm mt-1">{errors.monthlySales}</p>
        )}
      </div>
    </div>
  );
}

// Composant pour l'étape des coûts
function CostsStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
        <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          💡 Conseils pour optimiser vos coûts
        </h3>
        <div className="text-indigo-300 text-sm space-y-2">
          <p>• <strong>Coûts fixes :</strong> Loyer, salaires, abonnements (indépendants du volume)</p>
          <p>• <strong>Coûts variables :</strong> Matières premières, commissions (proportionnels aux ventes)</p>
          <p>• <strong>Négociation :</strong> Réduisez vos coûts variables avec la croissance</p>
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">
          Coûts fixes mensuels (€) *
          <span className="text-gray-400 text-sm ml-2">Charges fixes indépendantes du volume de ventes</span>
        </label>
        <input
          type="number"
          step="0.01"
          value={data.fixedCosts || ''}
          onChange={(e) => onChange({ ...data, fixedCosts: e.target.value })}
          className={`w-full bg-[#1a1a1a] border ${errors.fixedCosts ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none`}
          placeholder="Ex: 500"
        />
        {errors.fixedCosts && (
          <p className="text-red-400 text-sm mt-1">{errors.fixedCosts}</p>
        )}
      </div>

      <div>
        <label className="block text-white font-medium mb-2">
          Coûts variables par vente (€) *
          <span className="text-gray-400 text-sm ml-2">Coût de production/acquisition par unité vendue</span>
        </label>
        <input
          type="number"
          step="0.01"
          value={data.variableCosts || ''}
          onChange={(e) => onChange({ ...data, variableCosts: e.target.value })}
          className={`w-full bg-[#1a1a1a] border ${errors.variableCosts ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none`}
          placeholder="Ex: 2.50"
        />
        {errors.variableCosts && (
          <p className="text-red-400 text-sm mt-1">{errors.variableCosts}</p>
        )}
      </div>
    </div>
  );
}

// Composant pour l'étape de croissance
function GrowthStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
        <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          💡 Conseils pour la croissance
        </h3>
        <div className="text-indigo-300 text-sm space-y-2">
          <p>• <strong>Croissance réaliste :</strong> 5-15% par mois est un objectif ambitieux mais atteignable</p>
          <p>• <strong>Facteurs de croissance :</strong> Marketing, amélioration produit, expansion géographique</p>
          <p>• <strong>Suivi régulier :</strong> Ajustez vos projections selon les résultats réels</p>
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">
          Taux de croissance mensuel (%) 
          <span className="text-gray-400 text-sm ml-2">Croissance prévue des ventes chaque mois (optionnel)</span>
        </label>
        <input
          type="number"
          step="0.1"
          value={data.growthRate || ''}
          onChange={(e) => onChange({ ...data, growthRate: e.target.value })}
          className={`w-full bg-[#1a1a1a] border ${errors.growthRate ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none`}
          placeholder="Ex: 5 (pour 5% de croissance mensuelle)"
        />
        {errors.growthRate && (
          <p className="text-red-400 text-sm mt-1">{errors.growthRate}</p>
        )}
        <p className="text-gray-400 text-sm mt-2">
          Laissez vide si vous ne souhaitez pas inclure de projection de croissance
        </p>
      </div>

      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
        <h4 className="text-white font-medium mb-2">Aperçu des calculs</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• Revenus mensuels = Prix × Ventes mensuelles</p>
          <p>• Coûts totaux = Coûts fixes + (Coûts variables × Ventes)</p>
          <p>• Profit = Revenus - Coûts totaux</p>
          <p>• Projections avec croissance sur 6 et 12 mois</p>
        </div>
      </div>
    </div>
  );
}

function CalculateurContent() {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [showWizard, setShowWizard] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Configuration du wizard
  const steps: WizardStep[] = [
    {
      id: 'product-info',
      title: 'Informations Produit',
      description: 'Définissez le prix et le volume de ventes de votre produit',
      icon: Package,
      component: ProductInfoStep,
      validation: (data: CalculationFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.productPrice?.trim()) {
          errors.productPrice = 'Le prix du produit est requis';
        } else if (parseFloat(data.productPrice) <= 0) {
          errors.productPrice = 'Le prix doit être supérieur à 0';
        }
        
        if (!data.monthlySales?.trim()) {
          errors.monthlySales = 'Le nombre de ventes mensuelles est requis';
        } else if (parseFloat(data.monthlySales) <= 0) {
          errors.monthlySales = 'Le nombre de ventes doit être supérieur à 0';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'costs',
      title: 'Structure de Coûts',
      description: 'Définissez vos coûts fixes et variables',
      icon: Euro,
      component: CostsStep,
      validation: (data: CalculationFormData) => {
        const errors: Record<string, string> = {};
        
        if (!data.fixedCosts?.trim()) {
          errors.fixedCosts = 'Les coûts fixes sont requis';
        } else if (parseFloat(data.fixedCosts) < 0) {
          errors.fixedCosts = 'Les coûts fixes ne peuvent pas être négatifs';
        }
        
        if (!data.variableCosts?.trim()) {
          errors.variableCosts = 'Les coûts variables sont requis';
        } else if (parseFloat(data.variableCosts) < 0) {
          errors.variableCosts = 'Les coûts variables ne peuvent pas être négatifs';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    },
    {
      id: 'growth',
      title: 'Projections de Croissance',
      description: 'Définissez vos objectifs de croissance (optionnel)',
      icon: TrendingUp,
      component: GrowthStep,
      isOptional: true,
      validation: (data: CalculationFormData) => {
        const errors: Record<string, string> = {};
        
        if (data.growthRate && data.growthRate.trim()) {
          const growth = parseFloat(data.growthRate);
          if (growth < 0) {
            errors.growthRate = 'Le taux de croissance ne peut pas être négatif';
          } else if (growth > 100) {
            errors.growthRate = 'Un taux de croissance supérieur à 100% par mois semble irréaliste';
          }
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      }
    }
  ];

  const handleCalculate = async (formData: CalculationFormData) => {
    setIsLoading(true);
    setShowWizard(false);
    
    // Simulation d'un délai de calcul
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const price = parseFloat(formData.productPrice) || 0;
    const sales = parseFloat(formData.monthlySales) || 0;
    const growth = parseFloat(formData.growthRate) || 0;
    const fixed = parseFloat(formData.fixedCosts) || 0;
    const variable = parseFloat(formData.variableCosts) || 0;

    const monthlyRevenue = price * sales;
    const yearlyRevenue = monthlyRevenue * 12;
    const totalCosts = fixed + variable * sales;
    const profit = monthlyRevenue - totalCosts;

    setResults({
      monthly: monthlyRevenue,
      yearly: yearlyRevenue,
      costs: totalCosts,
      profit: profit,
      growth: growth,
      formData: formData
    });
    
    setIsLoading(false);
  };

  const handleNewCalculation = () => {
    setResults(null);
    setShowWizard(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (showWizard) {
    return (
      <div className="max-w-4xl mx-auto">
        <StepWizard
          steps={steps}
          onComplete={handleCalculate}
          isLoading={isLoading}
          title="Calculateur de Revenus"
          description="Analysez la rentabilité de votre business avec des projections détaillées"
          initialData={{}}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header avec bouton retour */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analyse de Rentabilité</h1>
            <p className="text-gray-400">Résultats détaillés de votre projection financière</p>
          </div>
          <button
            onClick={handleNewCalculation}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Nouveau calcul
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-white font-semibold">3,247</p>
              <p className="text-gray-400 text-sm">Calculs effectués</p>
            </div>
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-semibold">€2.4M</p>
              <p className="text-gray-400 text-sm">Revenus projetés</p>
            </div>
          </div>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-semibold">1,456</p>
              <p className="text-gray-400 text-sm">Entrepreneurs actifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé des paramètres */}
      <div className="mb-8 bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          Paramètres utilisés
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Prix unitaire</p>
            <p className="text-white font-semibold">{formatCurrency(parseFloat(results?.formData.productPrice || '0'))}</p>
          </div>
          <div>
            <p className="text-gray-400">Ventes/mois</p>
            <p className="text-white font-semibold">{results?.formData.monthlySales} unités</p>
          </div>
          <div>
            <p className="text-gray-400">Coûts fixes</p>
            <p className="text-white font-semibold">{formatCurrency(parseFloat(results?.formData.fixedCosts || '0'))}</p>
          </div>
          <div>
            <p className="text-gray-400">Coûts variables</p>
            <p className="text-white font-semibold">{formatCurrency(parseFloat(results?.formData.variableCosts || '0'))}</p>
          </div>
          <div>
            <p className="text-gray-400">Croissance</p>
            <p className="text-white font-semibold">{results?.formData.growthRate || '0'}%/mois</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
          {results ? (
            <>
              {/* Métriques principales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                   <div className="flex items-center justify-between mb-2">
                     <TrendingUp className="w-8 h-8 text-green-400" />
                     <span className="text-green-400 text-sm font-medium">+{((results.monthlyProfit / results.monthlyRevenue) * 100).toFixed(1)}%</span>
                   </div>
                   <p className="text-gray-400 text-sm mb-1">Revenus mensuels</p>
                   <p className="text-2xl font-bold text-white">{formatCurrency(results.monthlyRevenue)}</p>
                 </div>
                 
                 <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
                   <div className="flex items-center justify-between mb-2">
                     <BarChart3 className="w-8 h-8 text-blue-400" />
                     <span className="text-blue-400 text-sm font-medium">x12</span>
                   </div>
                   <p className="text-gray-400 text-sm mb-1">Revenus annuels</p>
                   <p className="text-2xl font-bold text-white">{formatCurrency(results.yearlyRevenue)}</p>
                 </div>
                 
                 <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6">
                   <div className="flex items-center justify-between mb-2">
                     <DollarSign className="w-8 h-8 text-red-400" />
                     <span className="text-red-400 text-sm font-medium">Coûts</span>
                   </div>
                   <p className="text-gray-400 text-sm mb-1">Coûts totaux/mois</p>
                   <p className="text-2xl font-bold text-white">{formatCurrency(results.totalCosts)}</p>
                 </div>
                 
                 <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
                   <div className="flex items-center justify-between mb-2">
                     <Target className="w-8 h-8 text-purple-400" />
                     <span className="text-purple-400 text-sm font-medium">Net</span>
                   </div>
                   <p className="text-gray-400 text-sm mb-1">Bénéfice mensuel</p>
                   <p className="text-2xl font-bold text-white">{formatCurrency(results.monthlyProfit)}</p>
                 </div>
              </div>

              {/* Projections de croissance */}
              <div className="bg-[#111111] rounded-xl p-6 border border-[#232323] mb-8">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Projections de croissance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="text-center">
                     <p className="text-gray-400 text-sm mb-2">Dans 6 mois</p>
                     <p className="text-2xl font-bold text-blue-400">
                       {formatCurrency(results.monthlyRevenue * Math.pow(1 + parseFloat(results.formData.growthRate) / 100, 6))}
                     </p>
                     <p className="text-gray-500 text-xs mt-1">Revenus mensuels</p>
                   </div>
                   <div className="text-center">
                     <p className="text-gray-400 text-sm mb-2">Dans 12 mois</p>
                     <p className="text-2xl font-bold text-purple-400">
                       {formatCurrency(results.monthlyRevenue * Math.pow(1 + parseFloat(results.formData.growthRate) / 100, 12))}
                     </p>
                     <p className="text-gray-500 text-xs mt-1">Revenus mensuels</p>
                   </div>
                   <div className="text-center">
                     <p className="text-gray-400 text-sm mb-2">Total année 1</p>
                     <p className="text-2xl font-bold text-green-400">
                       {formatCurrency(
                         Array.from({length: 12}, (_, i) => 
                           results.monthlyRevenue * Math.pow(1 + parseFloat(results.formData.growthRate) / 100, i)
                         ).reduce((sum, revenue) => sum + revenue, 0)
                       )}
                     </p>
                     <p className="text-gray-500 text-xs mt-1">Revenus cumulés</p>
                   </div>
                 </div>
              </div>

              {/* Analyse et recommandations */}
              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6">
                <h3 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Analyse et recommandations
                </h3>
                <div className="space-y-4">
                   {results.monthlyProfit > 0 ? (
                     <>
                       <div className="flex items-start gap-3">
                         <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                         <div>
                           <p className="text-white font-medium">Rentabilité positive</p>
                           <p className="text-gray-400 text-sm">Votre modèle économique est viable avec une marge de {((results.monthlyProfit / results.monthlyRevenue) * 100).toFixed(1)}%</p>
                         </div>
                       </div>
                       {((results.monthlyProfit / results.monthlyRevenue) * 100) < 20 && (
                         <div className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                           <div>
                             <p className="text-white font-medium">Optimisation possible</p>
                             <p className="text-gray-400 text-sm">Votre marge est correcte mais pourrait être améliorée en optimisant les coûts ou en ajustant les prix</p>
                           </div>
                         </div>
                       )}
                       <div className="flex items-start gap-3">
                         <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                         <div>
                           <p className="text-white font-medium">Potentiel de croissance</p>
                           <p className="text-gray-400 text-sm">Avec {results.formData.growthRate}% de croissance mensuelle, vous pourriez multiplier vos revenus par {(Math.pow(1 + parseFloat(results.formData.growthRate) / 100, 12)).toFixed(1)} en un an</p>
                         </div>
                       </div>
                     </>
                   ) : (
                     <>
                       <div className="flex items-start gap-3">
                         <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                         <div>
                           <p className="text-white font-medium">Rentabilité négative</p>
                           <p className="text-gray-400 text-sm">Vos coûts dépassent vos revenus. Une restructuration est nécessaire.</p>
                         </div>
                       </div>
                       <div className="flex items-start gap-3">
                         <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                         <div>
                           <p className="text-white font-medium">Actions recommandées</p>
                           <p className="text-gray-400 text-sm">Réduisez les coûts, augmentez les prix ou améliorez le volume de ventes</p>
                         </div>
                       </div>
                     </>
                   )}
                 </div>
              </div>
            </>
          ) : (
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Calculateur de Revenus</h3>
                <p className="text-gray-400 mb-4">
                  Remplissez le formulaire pour calculer vos projections de revenus
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>📊 Analyse détaillée de rentabilité</p>
                  <p>📈 Projections avec croissance</p>
                  <p>💡 Recommandations personnalisées</p>
                  <p>⚡ Calculs instantanés</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}

export default function CalculateurPage() {
  return (
    <ToolLayout toolId="calculateur">
      <CalculateurContent />
    </ToolLayout>
  );
}