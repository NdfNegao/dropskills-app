import { Metadata } from 'next';
import { BarChart3, TrendingUp, Users, Package, DollarSign, Activity } from 'lucide-react';
import PerformanceMetrics from '@/components/PerformanceMetrics';

export const metadata: Metadata = {
  title: 'Analytics | Admin DropSkills',
  description: 'Tableau de bord analytique pour DropSkills',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <div className="flex gap-2">
          <select className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
            <option>3 derniers mois</option>
            <option>12 derniers mois</option>
          </select>
        </div>
      </div>

      {/* Métriques de Performance Vercel */}
      <PerformanceMetrics />

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenus totaux</p>
              <p className="text-2xl font-bold text-white">€12,450</p>
              <p className="text-green-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15.3% vs mois dernier
              </p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Nouveaux utilisateurs</p>
              <p className="text-2xl font-bold text-white">1,234</p>
              <p className="text-blue-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8.2% vs mois dernier
              </p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Packs vendus</p>
              <p className="text-2xl font-bold text-white">456</p>
              <p className="text-purple-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12.1% vs mois dernier
              </p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Taux de conversion</p>
              <p className="text-2xl font-bold text-white">3.2%</p>
              <p className="text-orange-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +0.5% vs mois dernier
              </p>
            </div>
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Revenus par mois</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[8500, 9200, 7800, 10500, 11200, 12450].map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div 
                  className="bg-gradient-to-t from-[#00D2FF] to-[#3A7BD5] rounded-t"
                  style={{ height: `${(value / 12450) * 200}px`, width: '40px' }}
                />
                <span className="text-xs text-gray-400">
                  {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Catégories</h3>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'Templates', value: 45, color: 'bg-blue-500' },
              { name: 'Outils IA', value: 32, color: 'bg-purple-500' },
              { name: 'Formations', value: 28, color: 'bg-green-500' },
              { name: 'E-books', value: 18, color: 'bg-orange-500' },
              { name: 'Autres', value: 12, color: 'bg-gray-500' }
            ].map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="text-white">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-[#232323] rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-8">{category.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau des performances */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <h3 className="text-xl font-semibold text-white mb-6">Top Produits</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#232323]">
                <th className="text-left text-gray-400 pb-3">Produit</th>
                <th className="text-left text-gray-400 pb-3">Ventes</th>
                <th className="text-left text-gray-400 pb-3">Revenus</th>
                <th className="text-left text-gray-400 pb-3">Conversion</th>
                <th className="text-left text-gray-400 pb-3">Tendance</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {[
                { name: 'Pack Templates Premium', sales: 156, revenue: '€3,120', conversion: '4.2%', trend: '+12%' },
                { name: 'Générateur de Contenu IA', sales: 134, revenue: '€2,680', conversion: '3.8%', trend: '+8%' },
                { name: 'Formation Marketing Digital', sales: 89, revenue: '€2,225', conversion: '2.9%', trend: '+15%' },
                { name: 'E-book Stratégie Social Media', sales: 67, revenue: '€1,340', conversion: '3.1%', trend: '+5%' }
              ].map((product, index) => (
                <tr key={index} className="border-b border-[#232323]/50">
                  <td className="py-3 text-white">{product.name}</td>
                  <td className="py-3 text-gray-300">{product.sales}</td>
                  <td className="py-3 text-gray-300">{product.revenue}</td>
                  <td className="py-3 text-gray-300">{product.conversion}</td>
                  <td className="py-3">
                    <span className="text-green-400 text-sm">{product.trend}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 