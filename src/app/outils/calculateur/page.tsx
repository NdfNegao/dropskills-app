'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  PieChart,
  Sparkles,
  Users,
  Target,
  Lightbulb,
  Zap
} from 'lucide-react';

interface RevenueData {
  monthly: number;
  yearly: number;
  growth: number;
  costs: number;
  profit: number;
}

export default function CalculateurRevenusPage() {
  const [formData, setFormData] = useState({
    productPrice: '',
    monthlySales: '',
    growthRate: '',
    fixedCosts: '',
    variableCosts: ''
  });
  const [results, setResults] = useState<RevenueData | null>(null);

  const calculateRevenue = () => {
    const price = parseFloat(formData.productPrice) || 0;
    const sales = parseFloat(formData.monthlySales) || 0;
    const growth = parseFloat(formData.growthRate) || 0;
    const fixed = parseFloat(formData.fixedCosts) || 0;
    const variable = parseFloat(formData.variableCosts) || 0;

    const monthlyRevenue = price * sales;
    const yearlyRevenue = monthlyRevenue * 12;
    const totalCosts = fixed + (variable * sales);
    const monthlyProfit = monthlyRevenue - totalCosts;

    setResults({
      monthly: monthlyRevenue,
      yearly: yearlyRevenue,
      growth: growth,
      costs: totalCosts,
      profit: monthlyProfit
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Calculateur de Revenus</h1>
              <p className="text-gray-400">Calculez et projetez vos revenus futurs avec précision</p>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de calcul */}
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Paramètres de calcul
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Prix du produit (€)
                </label>
                <input
                  type="number"
                  value={formData.productPrice}
                  onChange={(e) => setFormData({...formData, productPrice: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  placeholder="Ex: 29.99"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Ventes mensuelles (unités)
                </label>
                <input
                  type="number"
                  value={formData.monthlySales}
                  onChange={(e) => setFormData({...formData, monthlySales: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  placeholder="Ex: 100"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Taux de croissance mensuel (%)
                </label>
                <input
                  type="number"
                  value={formData.growthRate}
                  onChange={(e) => setFormData({...formData, growthRate: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  placeholder="Ex: 5"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Coûts fixes mensuels (€)
                </label>
                <input
                  type="number"
                  value={formData.fixedCosts}
                  onChange={(e) => setFormData({...formData, fixedCosts: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  placeholder="Ex: 500"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Coûts variables par vente (€)
                </label>
                <input
                  type="number"
                  value={formData.variableCosts}
                  onChange={(e) => setFormData({...formData, variableCosts: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D2FF] focus:outline-none"
                  placeholder="Ex: 2.50"
                />
              </div>

              <button
                onClick={calculateRevenue}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculer les revenus
              </button>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Métriques principales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-gray-400 text-sm">Revenus mensuels</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(results.monthly)}</p>
                  </div>

                  <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-400 text-sm">Revenus annuels</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(results.yearly)}</p>
                  </div>

                  <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="w-5 h-5 text-red-400" />
                      <span className="text-gray-400 text-sm">Coûts totaux</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(results.costs)}</p>
                  </div>

                  <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                    <div className="flex items-center gap-3 mb-2">
                      <PieChart className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-400 text-sm">Profit mensuel</span>
                    </div>
                    <p className={`text-2xl font-bold ${results.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(results.profit)}
                    </p>
                  </div>
                </div>

                {/* Analyse détaillée */}
                <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-400" />
                    Analyse détaillée
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                      <h4 className="text-white font-medium mb-2">Projection annuelle</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Revenus totaux :</span>
                          <span className="text-white ml-2 font-semibold">{formatCurrency(results.yearly)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Coûts annuels :</span>
                          <span className="text-white ml-2 font-semibold">{formatCurrency(results.costs * 12)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Profit annuel :</span>
                          <span className={`ml-2 font-semibold ${results.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(results.profit * 12)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Marge bénéficiaire :</span>
                          <span className="text-white ml-2 font-semibold">
                            {results.monthly > 0 ? ((results.profit / results.monthly) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {results.growth > 0 && (
                      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333]">
                        <h4 className="text-white font-medium mb-2">Projection avec croissance ({results.growth}%/mois)</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Revenus mois 6 :</span>
                            <span className="text-white ml-2 font-semibold">
                              {formatCurrency(results.monthly * Math.pow(1 + results.growth/100, 6))}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Revenus mois 12 :</span>
                            <span className="text-white ml-2 font-semibold">
                              {formatCurrency(results.monthly * Math.pow(1 + results.growth/100, 12))}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
                      <h4 className="text-indigo-400 font-medium mb-2">💡 Recommandations</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {results.profit < 0 && (
                          <li>• Réduisez vos coûts ou augmentez votre prix de vente</li>
                        )}
                        {results.profit > 0 && results.profit < results.monthly * 0.2 && (
                          <li>• Votre marge est faible, optimisez vos coûts</li>
                        )}
                        {results.profit > results.monthly * 0.3 && (
                          <li>• Excellente marge ! Considérez investir dans la croissance</li>
                        )}
                        <li>• Suivez vos métriques mensuellement pour ajuster votre stratégie</li>
                      </ul>
                    </div>
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
    </LayoutWithSidebar>
  );
} 