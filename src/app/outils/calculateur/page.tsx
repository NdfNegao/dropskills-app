'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Calculator, TrendingUp, DollarSign, ArrowLeft, BarChart3, PieChart } from 'lucide-react';

interface RevenueData {
  monthly: number;
  yearly: number;
  growth: number;
  costs: number;
  profit: number;
}

export default function CalculateurRevenusPage() {
  const { data: session } = useSession();
  const router = useRouter();
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

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      
      <main className="ml-0 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-[#ff0033] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux outils
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Calculateur de Revenus</h1>
                <p className="text-gray-400">Calculez et projetez vos revenus futurs</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de calcul */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <h3 className="text-lg font-semibold text-white mb-6">Paramètres de calcul</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prix du produit (€)
                  </label>
                  <input
                    type="number"
                    value={formData.productPrice}
                    onChange={(e) => setFormData({...formData, productPrice: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Ex: 29.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ventes mensuelles (unités)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlySales}
                    onChange={(e) => setFormData({...formData, monthlySales: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Ex: 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Taux de croissance mensuel (%)
                  </label>
                  <input
                    type="number"
                    value={formData.growthRate}
                    onChange={(e) => setFormData({...formData, growthRate: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Ex: 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Coûts fixes mensuels (€)
                  </label>
                  <input
                    type="number"
                    value={formData.fixedCosts}
                    onChange={(e) => setFormData({...formData, fixedCosts: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Ex: 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Coûts variables par vente (€)
                  </label>
                  <input
                    type="number"
                    value={formData.variableCosts}
                    onChange={(e) => setFormData({...formData, variableCosts: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-3 text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Ex: 2.50"
                  />
                </div>

                <button
                  onClick={calculateRevenue}
                  className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
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

                  {/* Projections */}
                  <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                    <h4 className="text-lg font-semibold text-white mb-4">Projections avec croissance</h4>
                    <div className="space-y-4">
                      {[3, 6, 12].map((months) => {
                        const projectedSales = parseFloat(formData.monthlySales) * Math.pow(1 + results.growth / 100, months);
                        const projectedRevenue = parseFloat(formData.productPrice) * projectedSales;
                        
                        return (
                          <div key={months} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                            <span className="text-gray-300">Dans {months} mois</span>
                            <div className="text-right">
                              <p className="text-white font-medium">{formatCurrency(projectedRevenue)}</p>
                              <p className="text-gray-400 text-sm">{Math.round(projectedSales)} ventes</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Analyse */}
                  <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
                    <h4 className="text-lg font-semibold text-white mb-4">Analyse</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Marge brute</span>
                        <span className="text-white font-medium">
                          {((results.profit / results.monthly) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Seuil de rentabilité</span>
                        <span className="text-white font-medium">
                          {Math.ceil(results.costs / parseFloat(formData.productPrice))} ventes/mois
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">ROI mensuel</span>
                        <span className={`font-medium ${results.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {((results.profit / results.costs) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[#111111] rounded-xl p-8 border border-[#232323] text-center">
                  <Calculator className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Remplissez les paramètres et cliquez sur "Calculer" pour voir vos projections
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Conseils */}
          <div className="mt-12 bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <h3 className="text-lg font-semibold text-white mb-4">Conseils pour optimiser vos revenus</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-white font-medium mb-2">Augmentez le prix</h4>
                <p className="text-gray-400 text-sm">
                  Testez des prix plus élevés pour améliorer votre marge
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-medium mb-2">Réduisez les coûts</h4>
                <p className="text-gray-400 text-sm">
                  Optimisez vos processus pour diminuer les coûts variables
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-medium mb-2">Boostez les ventes</h4>
                <p className="text-gray-400 text-sm">
                  Investissez dans le marketing pour augmenter le volume
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 