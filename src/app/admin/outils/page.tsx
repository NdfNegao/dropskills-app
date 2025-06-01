'use client';

import { useState, useEffect } from 'react';
import { Bot, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { StatCard } from '@/components/admin/AdminDashboard';

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'maintenance';
  usage: number;
  lastUsed: string;
  apiEndpoint: string;
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setTools([
        {
          id: 1,
          name: 'GPT-4 Assistant',
          description: 'Assistant IA avancé pour la génération de texte',
          category: 'Text Generation',
          status: 'active',
          usage: 1250,
          lastUsed: '2024-01-20',
          apiEndpoint: '/api/gpt4'
        },
        {
          id: 2,
          name: 'Image Generator',
          description: 'Générateur d\'images basé sur DALL-E',
          category: 'Image Generation',
          status: 'active',
          usage: 890,
          lastUsed: '2024-01-19',
          apiEndpoint: '/api/dalle'
        },
        {
          id: 3,
          name: 'Code Assistant',
          description: 'Assistant pour la génération et révision de code',
          category: 'Code Generation',
          status: 'maintenance',
          usage: 567,
          lastUsed: '2024-01-18',
          apiEndpoint: '/api/codegen'
        },
        {
          id: 4,
          name: 'Translation Tool',
          description: 'Outil de traduction multilingue',
          category: 'Translation',
          status: 'inactive',
          usage: 234,
          lastUsed: '2024-01-15',
          apiEndpoint: '/api/translate'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-300 border border-green-700';
      case 'inactive': return 'bg-red-900 text-red-300 border border-red-700';
      case 'maintenance': return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      default: return 'bg-gray-900 text-gray-300 border border-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleDelete = (toolId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet outil ?')) {
      setTools(tools.filter(tool => tool.id !== toolId));
    }
  };

  const handleSave = (toolData: Partial<Tool>) => {
    if (editingTool) {
      // Modifier un outil existant
      setTools(tools.map(tool => 
        tool.id === editingTool.id 
          ? { ...tool, ...toolData }
          : tool
      ));
    } else {
      // Créer un nouvel outil
      const newTool: Tool = {
        id: Date.now(),
        name: toolData.name || '',
        description: toolData.description || '',
        category: toolData.category || '',
        status: toolData.status || 'inactive',
        usage: 0,
        lastUsed: new Date().toISOString().split('T')[0],
        apiEndpoint: toolData.apiEndpoint || ''
      };
      setTools([...tools, newTool]);
    }
    setIsModalOpen(false);
    setEditingTool(null);
  };

  const columns = [
    {
      key: 'tool',
      label: 'Outil',
      render: (tool: Tool) => (
        <div>
          <div className="text-sm font-medium text-white">{tool.name}</div>
          <div className="text-sm text-gray-400">{tool.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Catégorie',
      render: (tool: Tool) => (
        <span className="text-sm text-white">{tool.category}</span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (tool: Tool) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tool.status)}`}>
          {getStatusText(tool.status)}
        </span>
      )
    },
    {
      key: 'usage',
      label: 'Utilisation',
      render: (tool: Tool) => (
        <span className="text-sm text-white">{tool.usage.toLocaleString()}</span>
      )
    },
    {
      key: 'lastUsed',
      label: 'Dernière utilisation',
      render: (tool: Tool) => (
        <span className="text-sm text-gray-400">{tool.lastUsed}</span>
      )
    }
  ];

  const actions = [
    {
      icon: ExternalLink,
      label: 'Tester l\'API',
      onClick: (tool: Tool) => window.open(tool.apiEndpoint, '_blank'),
      className: 'text-blue-400 hover:text-blue-300'
    },
    {
      icon: Edit,
      label: 'Modifier',
      onClick: (tool: Tool) => handleEdit(tool),
      className: 'text-yellow-400 hover:text-yellow-300'
    },
    {
      icon: Trash2,
      label: 'Supprimer',
      onClick: (tool: Tool) => handleDelete(tool.id),
      className: 'text-red-400 hover:text-red-300'
    }
  ];

  const filters = [
    {
      key: 'category',
      label: 'Catégorie',
      options: [
        { value: 'all', label: 'Toutes les catégories' },
        { value: 'Text Generation', label: 'Génération de texte' },
        { value: 'Image Generation', label: 'Génération d\'images' },
        { value: 'Code Generation', label: 'Génération de code' },
        { value: 'Translation', label: 'Traduction' }
      ]
    },
    {
      key: 'status',
      label: 'Statut',
      options: [
        { value: 'all', label: 'Tous les statuts' },
        { value: 'active', label: 'Actif' },
        { value: 'inactive', label: 'Inactif' },
        { value: 'maintenance', label: 'Maintenance' }
      ]
    }
  ];

  const handleCreateTool = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout
      title="Gestion des Outils IA"
      icon={Bot}
      actions={[
        {
          label: 'Nouvel outil',
          icon: Plus,
          onClick: handleCreateTool,
          variant: 'primary'
        }
      ]}
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Outils"
          value={tools.length.toString()}
          icon={Bot}
          color="text-blue-400"
        />
        <StatCard
          title="Actifs"
          value={tools.filter(t => t.status === 'active').length.toString()}
          icon={() => <div className="w-3 h-3 bg-green-400 rounded-full" />}
          color="text-green-400"
        />
        <StatCard
          title="En maintenance"
          value={tools.filter(t => t.status === 'maintenance').length.toString()}
          icon={() => <div className="w-3 h-3 bg-yellow-400 rounded-full" />}
          color="text-yellow-400"
        />
        <StatCard
          title="Utilisation totale"
          value={tools.reduce((sum, tool) => sum + tool.usage, 0).toLocaleString()}
          icon={ExternalLink}
          color="text-purple-400"
        />
      </div>

      {/* Table des outils */}
      <DataTable
        data={tools}
        columns={columns}
        actions={actions}
        filters={filters}
        loading={loading}
        searchPlaceholder="Rechercher un outil..."
        searchKeys={['name', 'description', 'category']}
        emptyMessage="Aucun outil trouvé"
      />

      {/* Modal pour créer/modifier un outil */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#111] rounded-xl p-6 border border-[#232323] w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingTool ? 'Modifier l\'outil' : 'Nouvel outil'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                status: formData.get('status') as 'active' | 'inactive' | 'maintenance',
                apiEndpoint: formData.get('apiEndpoint') as string
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nom</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTool?.name || ''}
                    required
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white focus:outline-none focus:border-[#ff0033]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingTool?.description || ''}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white focus:outline-none focus:border-[#ff0033]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Catégorie</label>
                  <select
                    name="category"
                    defaultValue={editingTool?.category || ''}
                    required
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white focus:outline-none focus:border-[#ff0033]"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Text Generation">Génération de texte</option>
                    <option value="Image Generation">Génération d'images</option>
                    <option value="Code Generation">Génération de code</option>
                    <option value="Translation">Traduction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Statut</label>
                  <select
                    name="status"
                    defaultValue={editingTool?.status || 'inactive'}
                    required
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white focus:outline-none focus:border-[#ff0033]"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Endpoint API</label>
                  <input
                    type="text"
                    name="apiEndpoint"
                    defaultValue={editingTool?.apiEndpoint || ''}
                    required
                    placeholder="/api/..."
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#232323] rounded-lg text-white focus:outline-none focus:border-[#ff0033]"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-[#232323] text-white rounded-lg hover:bg-[#333] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#ff0033] text-white rounded-lg hover:bg-[#cc0029] transition-colors"
                >
                  {editingTool ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}