'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { Crown, Search, Plus, Edit, Trash2, Eye, Filter, Users, Download, Star, Package } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  subtitle?: string;
  format: string;
  image?: string;
  description?: string;
  short_description?: string;
  is_premium: boolean;
  downloads: number;
  rating: number;
  category?: string;
  instructor?: string;
  duration?: string;
  students: number;
  created_at?: string;
}

interface AdminStats {
  totalProducts: number;
  premiumProducts: number;
  freeProducts: number;
  totalDownloads: number;
  avgRating: number;
}

export default function AdminProduitsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    premiumProducts: 0,
    freeProducts: 0,
    totalDownloads: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPremium, setFilterPremium] = useState<'all' | 'premium' | 'free'>('all');
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [submitting, setSubmitting] = useState(false);

  // Vérification d'authentification et permissions
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.email) {
      router.push('/');
      return;
    }
    
    if (session.user.email !== 'cyril.iriebi@gmail.com') {
      router.push('/dashboard');
      return;
    }

    fetchProducts();
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products?search=${searchTerm}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }

      const data = await response.json();
      setProducts(data.products || []);
      
      // Calculer les statistiques
      const totalProducts = data.products.length;
      const premiumProducts = data.products.filter((p: Product) => p.is_premium).length;
      const freeProducts = totalProducts - premiumProducts;
      const totalDownloads = data.products.reduce((sum: number, p: Product) => sum + (p.downloads || 0), 0);
      const avgRating = totalProducts > 0 
        ? data.products.reduce((sum: number, p: Product) => sum + (p.rating || 0), 0) / totalProducts
        : 0;

      setStats({
        totalProducts,
        premiumProducts,
        freeProducts,
        totalDownloads,
        avgRating
      });

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleCreate = () => {
    setCurrentProduct(null);
    setFormData({
      title: '',
      subtitle: '',
      format: 'Formation',
      category: '',
      instructor: '',
      duration: '',
      description: '',
      short_description: '',
      is_premium: false,
      downloads: 0,
      rating: 0,
      students: 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = currentProduct 
        ? `/api/admin/products/${currentProduct.id}`
        : '/api/admin/products';
      
      const method = currentProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      fetchProducts();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterPremium === 'all' ||
                         (filterPremium === 'premium' && product.is_premium) ||
                         (filterPremium === 'free' && !product.is_premium);
    
    return matchesSearch && matchesFilter;
  });

  if (status === 'loading' || loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Package className="w-5 h-5" />}
        title="Gestion des Produits"
        subtitle="Chargement des produits..."
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<Package className="w-5 h-5" />}
      title="Gestion des Produits"
      subtitle="Gérez vos produits et leurs configurations"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">Gestion des Produits</h1>
            <p className="text-gray-600">Gérez les formations et produits de DropSkills</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors text-white"
          >
            <Plus className="w-5 h-5" />
            Nouveau Produit
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Produits</p>
                <p className="text-2xl font-bold text-black">{stats.totalProducts}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Premium</p>
                <p className="text-2xl font-bold text-orange-600">{stats.premiumProducts}</p>
              </div>
              <Crown className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Gratuits</p>
                <p className="text-2xl font-bold text-green-600">{stats.freeProducts}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Téléchargements</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalDownloads}</p>
              </div>
              <Download className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Note Moyenne</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, catégorie, instructeur..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-black focus:border-blue-500 focus:outline-none"
                value={filterPremium}
                onChange={(e) => setFilterPremium(e.target.value as 'all' | 'premium' | 'free')}
              >
                <option value="all">Tous les produits</option>
                <option value="premium">Premium uniquement</option>
                <option value="free">Gratuits uniquement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-black">Produit</th>
                  <th className="text-left p-4 font-semibold text-black">Format</th>
                  <th className="text-left p-4 font-semibold text-black">Catégorie</th>
                  <th className="text-left p-4 font-semibold text-black">Statut</th>
                  <th className="text-left p-4 font-semibold text-black">Téléchargements</th>
                  <th className="text-left p-4 font-semibold text-black">Note</th>
                  <th className="text-left p-4 font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-black">{product.title}</h3>
                          {product.subtitle && (
                            <p className="text-sm text-gray-600">{product.subtitle}</p>
                          )}
                          {product.instructor && (
                            <p className="text-xs text-gray-500">par {product.instructor}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {product.format}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{product.category || 'Non défini'}</td>
                    <td className="p-4">
                      {product.is_premium ? (
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-600 font-semibold">Premium</span>
                        </div>
                      ) : (
                        <span className="text-green-600 font-semibold">Gratuit</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{product.downloads}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-blue-600 fill-current" />
                        <span className="text-gray-600">{product.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
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
              <p className="text-gray-600">Aucun produit trouvé</p>
            </div>
          )}
        </div>

        {/* Modal de création/édition */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-black">
                  {currentProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-black"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-black"
                      value={formData.format || ''}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Formation">Formation</option>
                      <option value="Course">Course</option>
                      <option value="ebook">eBook</option>
                      <option value="Workbook">Workbook</option>
                      <option value="Prompt Pack">Prompt Pack</option>
                      <option value="Guide">Guide</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-black"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-black"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructeur
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-black"
                      value={formData.instructor || ''}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-black"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description courte
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-black resize-none"
                    value={formData.short_description || ''}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description complète
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-black resize-none"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* CHECKBOX PREMIUM - PARTIE IMPORTANTE */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_premium || false}
                      onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                      className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700 font-medium">Produit Premium</span>
                    </div>
                  </label>
                  <p className="text-sm text-gray-600 mt-2 ml-8">
                    Les produits premium nécessitent un abonnement pour être téléchargés
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-gray-600 hover:text-black transition-colors"
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Sauvegarde...' : (currentProduct ? 'Mettre à jour' : 'Créer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWithSidebar>
  );
}