'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Edit, Trash2, Package, TrendingUp, DollarSign, Download } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

interface Product {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  price: number;
  downloads: number;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts([
        {
          id: '1',
          name: 'Formation Dropshipping 2025',
          category: 'Formation',
          status: 'active',
          price: 97,
          downloads: 1234,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Pack Outils IA Marketing',
          category: 'Outils',
          status: 'active',
          price: 47,
          downloads: 856,
          createdAt: '2024-02-01'
        },
        {
          id: '3',
          name: 'Template Notion Productivité',
          category: 'Template',
          status: 'draft',
          price: 27,
          downloads: 0,
          createdAt: '2024-03-10'
        }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statsData = [
    {
      icon: <Package className="w-5 h-5" />,
      label: "Total Produits",
      value: products.length.toString(),
      color: "text-blue-400"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Produits Actifs",
      value: products.filter(p => p.status === 'active').length.toString(),
      color: "text-green-400"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Brouillons",
      value: products.filter(p => p.status === 'draft').length.toString(),
      color: "text-yellow-400"
    },
    {
      icon: <Download className="w-5 h-5" />,
      label: "Total Téléchargements",
      value: products.reduce((sum, p) => sum + p.downloads, 0).toLocaleString(),
      color: "text-purple-400"
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      draft: 'Brouillon'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Package className="w-6 h-6" />}
        title="Gestion des Produits"
        subtitle="Chargement des produits..."
        stats={statsData.map(stat => ({ title: stat.label, value: '---', icon: stat.icon }))}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<Package className="w-6 h-6" />}
      title="Gestion des Produits"
      subtitle="Gérer les formations, outils et templates"
      stats={statsData.map(stat => ({ title: stat.label, value: stat.value, icon: stat.icon }))}
      actions={[
        {
          label: "Nouveau Produit",
          onClick: () => console.log('Nouveau produit'),
          variant: "default" as const,
          icon: <Plus className="w-4 h-4" />
        }
      ]}
    >
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Filtres et recherche */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table des produits */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléchargements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">Créé le {new Date(product.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.downloads.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par créer votre premier produit.'}
            </p>
          </div>
        )}
        </div>
    </AdminLayoutWithSidebar>
  );
}