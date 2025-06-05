'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { 
  Bot, Plus, Search, Filter, Edit2, Trash2, Copy, 
  X, Check, AlertCircle, Loader2, Crown, Zap
} from 'lucide-react';

interface AiTool {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  icon: string;
  color: string;
  is_premium: boolean;
  step: number;
  step_title: string;
  step_description: string;
  endpoint: string;
  model: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ['Acquisition', 'Activation', 'Trafic', 'Contenu'];
const MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'];
const TYPES = [
  'ICP_MAKER', 'OFFER_GENERATOR', 'TITLE_GENERATOR', 'CONTENT_SYSTEM',
  'TUNNEL_BUILDER', 'EMAIL_SEQUENCE', 'LEAD_MAGNET', 'VEILLE_STRATEGIQUE'
];

export default function AdminOutilsPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [filteredTools, setFilteredTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState<AiTool | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'ICP_MAKER',
    category: 'Acquisition',
    icon: 'Bot',
    color: 'from-purple-500 to-indigo-600',
    is_premium: false,
    step: 1,
    step_title: '',
    step_description: '',
    endpoint: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 1000,
    system_prompt: ''
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Charger les outils
  useEffect(() => {
    fetchTools();
  }, []);

  // Filtrer les outils
  useEffect(() => {
    let filtered = tools;
    
    if (search) {
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tool => tool.category === categoryFilter);
    }

    if (premiumFilter !== 'all') {
      filtered = filtered.filter(tool => 
        premiumFilter === 'premium' ? tool.is_premium : !tool.is_premium
      );
    }
    
    setFilteredTools(filtered);
  }, [tools, search, categoryFilter, premiumFilter]);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/admin/ai-tools');
      const data = await response.json();
      setTools(data);
      setLoading(false);
    } catch (error) {
      showToast('error', 'Erreur lors du chargement des outils');
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingTool 
        ? `/api/admin/ai-tools/${editingTool.id}`
        : '/api/admin/ai-tools';
      
      const response = await fetch(url, {
        method: editingTool ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('success', editingTool ? 'Outil modifié avec succès' : 'Outil créé avec succès');
        setShowModal(false);
        fetchTools();
        resetForm();
      } else {
        throw new Error();
      }
    } catch (error) {
      showToast('error', 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet outil ?')) return;
    
    try {
      const response = await fetch(`/api/admin/ai-tools/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showToast('success', 'Outil supprimé avec succès');
        fetchTools();
      } else {
        throw new Error();
      }
    } catch (error) {
      showToast('error', 'Erreur lors de la suppression');
    }
  };

  const handleDuplicate = (tool: AiTool) => {
    const { id, created_at, updated_at, ...toolData } = tool;
    setFormData({
      ...toolData,
      name: `${tool.name} (copie)`
    });
    setEditingTool(null);
    setShowModal(true);
  };

  const handleEdit = (tool: AiTool) => {
    // Pré-remplir correctement le formulaire avec les données actuelles de l'outil
    const { id, created_at, updated_at, ...toolData } = tool;
    setFormData({
      ...toolData,
      temperature: Number(tool.temperature),
      max_tokens: Number(tool.max_tokens),
      step: Number(tool.step)
    });
    setEditingTool(tool);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'ICP_MAKER',
      category: 'Acquisition',
      icon: 'Bot',
      color: 'from-purple-500 to-indigo-600',
      is_premium: false,
      step: 1,
      step_title: '',
      step_description: '',
      endpoint: '',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000,
      system_prompt: ''
    });
    setEditingTool(null);
  };

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Bot size={24} />}
        title="Gestion des Outils IA"
        subtitle="Chargement des outils..."
      >
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<Bot size={24} />}
      title="Gestion des Outils IA"
      subtitle="Gérez les outils d'intelligence artificielle de la plateforme"
      stats={[
        {
          title: "Total outils",
          value: tools.length.toString(),
          icon: <Bot size={20} />
        },
        {
          title: "Premium",
          value: tools.filter(t => t.is_premium).length.toString(),
          icon: <Crown size={20} />
        },
        {
          title: "Gratuits",
          value: tools.filter(t => !t.is_premium).length.toString(),
          icon: <Zap size={20} />
        },
        {
          title: "Catégories",
          value: CATEGORIES.length.toString(),
          icon: <Bot size={20} />
        }
      ]}
    >
      <div className="h-full">
        {/* Header */}
        <header className="bg-[#111] border-b border-[#232323] px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Gestion des Outils IA</h1>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#ff0033] text-white rounded-lg hover:bg-[#e6002d] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un outil
            </button>
          </div>
        </header>

        {/* Filtres améliorés */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un outil..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-gray-300 text-black px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select 
              value={premiumFilter} 
              onChange={(e) => setPremiumFilter(e.target.value as 'all' | 'premium' | 'free')}
              className="bg-white border border-gray-300 text-black px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="premium">Premium uniquement</option>
              <option value="free">Gratuits uniquement</option>
            </select>
          </div>
        </div>

        {/* Tableau amélioré */}
        <div className="p-6">
          <div className="bg-[#111] rounded-xl border border-[#232323] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#1a1a1a] border-b border-[#232323]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Modèle</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232323]">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{tool.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{tool.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#232323] text-gray-300 text-xs rounded-full">
                        {tool.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300 font-mono">{tool.model}</span>
                    </td>
                    <td className="px-6 py-4">
                      {tool.is_premium ? (
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-500 font-semibold text-sm">Premium</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <span className="text-green-500 font-semibold text-sm">Gratuit</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(tool)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#232323] rounded-lg transition-colors"
                          title="Modifier l'outil"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(tool)}
                          className="p-2 text-gray-400 hover:text-purple-400 hover:bg-[#232323] rounded-lg transition-colors"
                          title="Dupliquer l'outil"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tool.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#232323] rounded-lg transition-colors"
                          title="Supprimer l'outil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  {search || categoryFilter !== 'all' || premiumFilter !== 'all' 
                    ? 'Aucun outil ne correspond aux critères de recherche'
                    : 'Aucun outil trouvé'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal amélioré */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#111] rounded-xl border border-[#232323] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-[#232323]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    {editingTool ? `Modifier "${editingTool.name}"` : 'Ajouter un nouvel outil'}
                  </h2>
                  <button
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                      placeholder="Nom de l'outil..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                    >
                      {TYPES.map(type => (
                        <option key={type} value={type}>{type.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Description de l'outil..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Modèle IA</label>
                    <select
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                    >
                      {MODELS.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Paramètres avancés */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Température</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
                    <input
                      type="number"
                      value={formData.max_tokens}
                      onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) || 1000 })}
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Étape</label>
                    <input
                      type="number"
                      value={formData.step}
                      onChange={(e) => setFormData({ ...formData, step: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Checkbox Premium mis en évidence */}
                <div className="bg-[#0f0f0f] p-4 rounded-lg border border-[#232323]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_premium}
                      onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                      className="w-5 h-5 text-[#ff0033] bg-[#0a0a0a] border-[#232323] rounded focus:ring-[#ff0033] focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-300 font-medium">Outil Premium</span>
                    </div>
                  </label>
                  <p className="text-sm text-gray-400 mt-2 ml-8">
                    Les outils premium nécessitent un abonnement pour être utilisés
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Endpoint API *</label>
                  <input
                    type="text"
                    required
                    value={formData.endpoint}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    placeholder="/api/ai/..."
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">System Prompt *</label>
                  <textarea
                    required
                    value={formData.system_prompt}
                    onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#232323] rounded-lg text-white focus:border-[#ff0033] focus:outline-none"
                    placeholder="Instructions pour l'IA..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-[#232323]">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#ff0033] text-white rounded-lg hover:bg-[#e6002d] transition-colors font-semibold"
                  >
                    {editingTool ? 'Mettre à jour' : 'Créer l\'outil'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-lg flex items-center gap-3 shadow-lg ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </AdminLayoutWithSidebar>
  );
}