'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Crown, Search, Plus, Edit, Trash2, Eye, Filter, Users, Download, Star } from 'lucide-react';

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff0033]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des Produits</h1>
            <p className="text-gray-400">Gérez les formations et produits de DropSkills</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-[#ff0033] hover:bg-[#cc0029] px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouveau Produit
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-[#111111] p-6 rounded-lg border border-[#232323]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Produits</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-[#111111] p-6 rounded-lg border border-[#232323]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Premium</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.premiumProducts}</p>
              </div>
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-[#111111] p-6 rounded-lg border border-[#232323]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Gratuits</p>
                <p className="text-2xl font-bold text-green-500">{stats.freeProducts}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-[#111111] p-6 rounded-lg border border-[#232323]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Téléchargements</p>
                <p className="text-2xl font-bold text-purple-500">{stats.totalDownloads}</p>
              </div>
              <Download className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-[#111111] p-6 rounded-lg border border-[#232323]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Note Moyenne</p>
                <p className="text-2xl font-bold text-orange-500">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-[#111111] p-6 rounded-lg border border-[#232323] mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, catégorie, instructeur..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg focus:border-[#ff0033] focus:outline-none text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                className="bg-[#0a0a0a] border border-[#232323] rounded-lg px-4 py-2 text-white focus:border-[#ff0033] focus:outline-none"
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
        <div className="bg-[#111111] rounded-lg border border-[#232323] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0a0a] border-b border-[#232323]">
                <tr>
                  <th className="text-left p-4 font-semibold">Produit</th>
                  <th className="text-left p-4 font-semibold">Format</th>
                  <th className="text-left p-4 font-semibold">Catégorie</th>
                  <th className="text-left p-4 font-semibold">Statut</th>
                  <th className="text-left p-4 font-semibold">Téléchargements</th>
                  <th className="text-left p-4 font-semibold">Note</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-[#232323] hover:bg-[#0f0f0f]">
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
                          <h3 className="font-semibold text-white">{product.title}</h3>
                          {product.subtitle && (
                            <p className="text-sm text-gray-400">{product.subtitle}</p>
                          )}
                          {product.instructor && (
                            <p className="text-xs text-gray-500">par {product.instructor}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-[#1a1a1a] text-gray-300 text-sm rounded">
                        {product.format}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{product.category || 'Non défini'}</td>
                    <td className="p-4">
                      {product.is_premium ? (
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-500 font-semibold">Premium</span>
                        </div>
                      ) : (
                        <span className="text-green-500 font-semibold">Gratuit</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-300">{product.downloads}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-orange-500 fill-current" />
                        <span className="text-gray-300">{product.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-[#1a1a1a] rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-[#1a1a1a] rounded transition-colors"
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
              <p className="text-gray-400">Aucun produit trouvé</p>
            </div>
          )}
        </div>

        {/* Modal de création/édition */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] rounded-lg border border-[#232323] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-[#232323]">
                <h2 className="text-xl font-bold">
                  {currentProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg focus:border-[#ff0033] focus:outline-none text-white"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Format *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg focus:border-[#ff0033] focus:outline-none text-white"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg focus:border-[#ff0033] focus:outline-none text-white"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Catégorie
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg focus:border-[#ff0033] focus:outline-none text-white"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Instructeur
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg focus:border-[#ff0033] focus:outline-none text-white"
                      value={formData.instructor || ''}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Durée
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg focus:border-[#ff0033] focus:outline-none text-white"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description courte
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg focus:border-[#ff0033] focus:outline-none text-white resize-none"
                    value={formData.short_description || ''}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description complète
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg focus:border-[#ff0033] focus:outline-none text-white resize-none"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* CHECKBOX PREMIUM - PARTIE IMPORTANTE */}
                <div className="bg-[#0f0f0f] p-4 rounded-lg border border-[#232323]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_premium || false}
                      onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                      className="w-5 h-5 text-[#ff0033] bg-[#0a0a0a] border-[#232323] rounded focus:ring-[#ff0033] focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-300 font-medium">Produit Premium</span>
                    </div>
                  </label>
                  <p className="text-sm text-gray-400 mt-2 ml-8">
                    Les produits premium nécessitent un abonnement pour être téléchargés
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-[#232323]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#ff0033] hover:bg-[#cc0029] px-6 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Sauvegarde...' : (currentProduct ? 'Mettre à jour' : 'Créer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}