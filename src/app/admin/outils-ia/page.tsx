'use client';

import { useState, useEffect } from 'react';
import { Bot, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { StatCard } from '@/components/admin/AdminDashboard';

interface AiTool {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'maintenance';
  usage: number;
  lastUsed: string;
  apiEndpoint: string;
}

export default function AdminAiToolsPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleEdit = (tool: AiTool) => {
    console.log('Edit tool:', tool);
  };

  const handleDelete = (toolId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet outil ?')) {
      setTools(tools.filter(tool => tool.id !== toolId));
    }
  };

  const columns = [
    {
      key: 'tool',
      label: 'Outil',
      render: (tool: AiTool) => (
        <div>
          <div className="text-sm font-medium text-white">{tool.name}</div>
          <div className="text-sm text-gray-400">{tool.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Catégorie',
      render: (tool: AiTool) => (
        <span className="text-sm text-white">{tool.category}</span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (tool: AiTool) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tool.status)}`}>
          {getStatusText(tool.status)}
        </span>
      )
    },
    {
      key: 'usage',
      label: 'Utilisation',
      render: (tool: AiTool) => (
        <span className="text-sm text-white">{tool.usage.toLocaleString()}</span>
      )
    },
    {
      key: 'lastUsed',
      label: 'Dernière utilisation',
      render: (tool: AiTool) => (
        <span className="text-sm text-gray-400">{tool.lastUsed}</span>
      )
    }
  ];

  const actions = [
    {
      icon: ExternalLink,
      label: 'Tester l\'API',
      onClick: (tool: AiTool) => window.open(tool.apiEndpoint, '_blank'),
      className: 'text-blue-400 hover:text-blue-300'
    },
    {
      icon: Edit,
      label: 'Modifier',
      onClick: (tool: AiTool) => handleEdit(tool),
      className: 'text-yellow-400 hover:text-yellow-300'
    },
    {
      icon: Trash2,
      label: 'Supprimer',
      onClick: (tool: AiTool) => handleDelete(tool.id),
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
    console.log('Create new tool');
  };

  return (
    <AdminLayout
      title="Outils IA"
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
    </AdminLayout>
  );
}