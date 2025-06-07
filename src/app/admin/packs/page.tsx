"use client";
import { useState, useEffect } from 'react';
import { Package, Plus, TrendingUp, DollarSign, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  status: 'active' | 'draft' | 'archived';
  sales_count: number;
  revenue: number;
  created_at: string;
  updated_at: string;
  products_count: number;
  category: string;
}

interface PackStats {
  totalPacks: number;
  activePacks: number;
  totalRevenue: number;
  totalSales: number;
}

export default function AdminPacks() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [stats, setStats] = useState<PackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);

  useEffect(() => {
    fetchPacks();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const response = await fetch(`/api/admin/packs?${params}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des packs');
      }
      
      const data = await response.json();
      setPacks(data.packs || data); // Gérer les deux formats de réponse
      
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
      }
      
      if (data.stats) {
        setStats(data.stats);
      } else {
        // Calculer les stats à partir des données si pas fournies
        const totalPacks = data.packs?.length || data.length || 0;
        const activePacks = (data.packs || data).filter((p: Pack) => p.status === 'active').length;
        const totalRevenue = (data.packs || data).reduce((sum: number, p: Pack) => sum + (p.revenue || 0), 0);
        const totalSales = (data.packs || data).reduce((sum: number, p: Pack) => sum + (p.sales_count || 0), 0);
        
        setStats({
          totalPacks,
          activePacks,
          totalRevenue,
          totalSales
        });
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des packs:', error);
      setError('Erreur lors du chargement des packs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPacks();
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Actif', class: 'bg-green-100 text-green-800' },
      draft: { label: 'Brouillon', class: 'bg-yellow-100 text-yellow-800' },
      archived: { label: 'Archivé', class: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const statsData = stats ? [
    {
      title: "Total packs",
      value: stats.totalPacks.toString(),
      icon: <Package size={24} />
    },
    {
      title: "Packs actifs",
      value: stats.activePacks.toString(),
      icon: <TrendingUp size={24} />
    },
    {
      title: "Revenus totaux",
      value: formatPrice(stats.totalRevenue),
      icon: <DollarSign size={24} />
    },
    {
      title: "Ventes totales",
      value: stats.totalSales.toString(),
      icon: <TrendingUp size={24} />
    }
  ] : [];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Package size={24} />}
        title="Gestion des packs"
        subtitle="Gérez les packs de formations et produits"
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
      icon={<Package size={24} />}
      title="Gestion des packs"
      subtitle="Gérez les packs de formations et produits"
      stats={statsData}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          <p className="font-medium">Erreur</p>
          <p>{error}</p>
          <button 
            onClick={fetchPacks}
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
                placeholder="Rechercher un pack..."
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
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
            
            <button 
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Nouveau pack
            </button>
          </div>
        </div>
      </div>

      {/* Liste des packs */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-black mb-6">Liste des packs</h2>
        
        {packs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun pack trouvé</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Nom</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Prix</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Produits</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Ventes</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Revenus</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Statut</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packs.map((pack) => (
                  <tr key={pack.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-black font-medium">{pack.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{pack.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-black font-medium">{formatPrice(pack.price)}</div>
                      {pack.original_price && (
                        <div className="text-sm text-gray-500 line-through">{formatPrice(pack.original_price)}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{pack.products_count || 0} produits</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">{pack.sales_count || 0}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">{formatPrice(pack.revenue || 0)}</td>
                    <td className="py-3 px-4">{getStatusBadge(pack.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded" title="Voir">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingPack(pack);
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Top performers */}
      {packs.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-black mb-4">Top performers</h3>
          <div className="space-y-3">
            {packs
              .filter(pack => pack.sales_count > 0)
              .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
              .slice(0, 3)
              .map((pack) => (
                <div key={pack.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-700 font-medium">{pack.name}</span>
                  <span className="text-green-600 font-semibold">{pack.sales_count} ventes</span>
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
            Rapport de ventes
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
            Analyser les performances
          </button>
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}