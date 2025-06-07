'use client';

import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { Users, Plus, Search, Edit, Trash2, Eye, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AffiliateData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commission_rate: number;
  total_sales: number;
  total_commission: number;
  referral_code: string;
  created_at: string;
  approved_at?: string;
  last_sale_at?: string;
  notes?: string;
}

interface AffiliatesStats {
  total: number;
  active: number;
  pending: number;
  totalCommissions: number;
  totalSales: number;
}

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<AffiliateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliateData | null>(null);
  const [statsData, setStatsData] = useState([
    {
      title: "Total affiliés",
      value: "0",
      change: "+0%",
      trend: "up" as const
    },
    {
      title: "Affiliés actifs",
      value: "0",
      change: "+0%",
      trend: "up" as const
    },
    {
      title: "Commissions ce mois",
      value: "€0",
      change: "+0%",
      trend: "up" as const
    },
    {
      title: "Ventes générées",
      value: "0",
      change: "+0%",
      trend: "up" as const
    }
  ]);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/affiliates');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des affiliés');
      }
      
      const data: AffiliateData[] = await response.json();
      setAffiliates(data);
      
      // Calculer les statistiques
      const stats = calculateStats(data);
      setStatsData([
        {
          title: "Total affiliés",
          value: stats.total.toString(),
          change: "+15%",
          trend: "up" as const
        },
        {
          title: "Affiliés actifs",
          value: stats.active.toString(),
          change: "+8%",
          trend: "up" as const
        },
        {
          title: "Commissions ce mois",
          value: `€${stats.totalCommissions.toLocaleString()}`,
          change: "+22%",
          trend: "up" as const
        },
        {
          title: "Ventes générées",
          value: stats.totalSales.toString(),
          change: "+18%",
          trend: "up" as const
        }
      ]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (affiliatesData: AffiliateData[]): AffiliatesStats => {
    return {
      total: affiliatesData.length,
      active: affiliatesData.filter(a => a.status === 'approved').length,
      pending: affiliatesData.filter(a => a.status === 'pending').length,
      totalCommissions: affiliatesData.reduce((sum, a) => sum + (a.total_commission || 0), 0),
      totalSales: affiliatesData.reduce((sum, a) => sum + (a.total_sales || 0), 0)
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche est gérée par le filtrage local
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      suspended: 'Suspendu'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString()}`;
  };

  // Filtrer les affiliés
  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = searchTerm === '' || 
      affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.referral_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Users size={24} />}
        title="Gestion des affiliés"
        subtitle="Gérez votre programme d'affiliation et les partenaires"
        stats={[]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff0033]"></div>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<Users size={24} />}
      title="Gestion des affiliés"
      subtitle="Gérez votre programme d'affiliation et les partenaires"
      stats={statsData}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          <p className="font-medium">Erreur</p>
          <p>{error}</p>
          <button 
            onClick={fetchAffiliates}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un affilié..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff0033] focus:border-transparent w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg font-medium"
            >
              Rechercher
            </button>
          </form>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
              <option value="suspended">Suspendu</option>
            </select>
            
            <button 
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Nouvel affilié
            </button>
          </div>
        </div>
      </div>

      {/* Liste des affiliés */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-black mb-6">Liste des affiliés</h2>
        
        {filteredAffiliates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun affilié trouvé</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Affilié</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Contact</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Code référent</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Performance</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Statut</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Inscription</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAffiliates.map((affiliate) => (
                <tr key={affiliate.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-black font-medium">{affiliate.name}</div>
                      <div className="text-sm text-gray-500">{affiliate.commission_rate}% commission</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {affiliate.email}
                      </div>
                      {affiliate.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {affiliate.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                      {affiliate.referral_code}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="text-green-600 font-semibold">{formatCurrency(affiliate.total_commission)}</div>
                      <div className="text-gray-500">{affiliate.total_sales} ventes</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(affiliate.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {formatDate(affiliate.created_at)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded" title="Voir">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingAffiliate(affiliate);
                          setShowModal(true);
                        }}
                        className="text-green-600 hover:text-green-800 p-1 rounded" 
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1 rounded" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Top performers */}
      {filteredAffiliates.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top performers
          </h3>
          <div className="space-y-3">
            {filteredAffiliates
              .filter(affiliate => affiliate.total_commission > 0)
              .sort((a, b) => b.total_commission - a.total_commission)
              .slice(0, 5)
              .map((affiliate) => (
                <div key={affiliate.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-700 font-medium">{affiliate.name}</span>
                    <div className="text-sm text-gray-500">{affiliate.referral_code}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">{formatCurrency(affiliate.total_commission)}</div>
                    <div className="text-sm text-gray-500">{affiliate.total_sales} ventes</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-black mb-4">Actions rapides</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Exporter les données
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
            Payer les commissions
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
            Rapport mensuel
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium">
            Approuver en masse
          </button>
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}