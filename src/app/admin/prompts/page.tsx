"use client";
import { useState, useEffect } from 'react';
import { BrainCircuit, Plus, Star, Copy, Edit, Trash2, Eye } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import DataTable from '@/components/admin/DataTable';

interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  author: string;
  usage_count: number;
  rating: number;
  status: 'active' | 'inactive' | 'draft';
  is_public: boolean;
  created_at: string;
}

export default function AdminPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    public: 0,
    totalUsage: 0,
    averageRating: 0
  });

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    setLoading(true);
    try {
      // Simuler un appel API
      setTimeout(() => {
        const mockPrompts: Prompt[] = [
          {
            id: 1,
            title: "Générateur de contenu marketing",
            description: "Crée du contenu marketing engageant pour les réseaux sociaux",
            content: "Tu es un expert en marketing digital...",
            category: "Marketing",
            author: "Admin",
            usage_count: 1250,
            rating: 4.8,
            status: "active",
            is_public: true,
            created_at: "2024-01-15"
          },
          {
            id: 2,
            title: "Assistant rédaction SEO",
            description: "Optimise le contenu pour le référencement naturel",
            content: "Tu es un spécialiste SEO...",
            category: "SEO",
            author: "Admin",
            usage_count: 890,
            rating: 4.6,
            status: "active",
            is_public: true,
            created_at: "2024-01-12"
          },
          {
            id: 3,
            title: "Générateur d'emails de vente",
            description: "Crée des emails de vente persuasifs",
            content: "Tu es un copywriter expert...",
            category: "Copywriting",
            author: "Admin",
            usage_count: 567,
            rating: 4.7,
            status: "draft",
            is_public: false,
            created_at: "2024-01-10"
          }
        ];
        
        setPrompts(mockPrompts);
        setStats({
          total: mockPrompts.length,
          public: mockPrompts.filter(p => p.is_public).length,
          totalUsage: mockPrompts.reduce((sum, p) => sum + p.usage_count, 0),
          averageRating: mockPrompts.reduce((sum, p) => sum + p.rating, 0) / mockPrompts.length
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement des prompts:', error);
      setLoading(false);
    }
  };

  const handleEdit = (prompt: Prompt) => {
    console.log('Modifier prompt:', prompt.id);
  };

  const handleDelete = (promptId: number) => {
    console.log('Supprimer prompt:', promptId);
  };

  const handleView = (prompt: Prompt) => {
    console.log('Voir prompt:', prompt.id);
  };

  const handleCreatePrompt = () => {
    console.log('Créer nouveau prompt');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-300 border border-green-700';
      case 'inactive': return 'bg-red-900 text-red-300 border border-red-700';
      case 'draft': return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      default: return 'bg-gray-900 text-gray-300 border border-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Titre',
      sortable: true,
      render: (prompt: Prompt) => (
        <div>
          <div className="font-medium text-white">{prompt.title}</div>
          <div className="text-sm text-gray-400">{prompt.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Catégorie',
      sortable: true,
      render: (prompt: Prompt) => (
        <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm">
          {prompt.category}
        </span>
      )
    },
    {
      key: 'author',
      label: 'Auteur',
      sortable: true
    },
    {
      key: 'usage_count',
      label: 'Utilisations',
      sortable: true,
      render: (prompt: Prompt) => (
        <span className="font-mono">{prompt.usage_count.toLocaleString()}</span>
      )
    },
    {
      key: 'rating',
      label: 'Note',
      sortable: true,
      render: (prompt: Prompt) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span>{prompt.rating.toFixed(1)}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (prompt: Prompt) => (
        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(prompt.status)}`}>
          {getStatusText(prompt.status)}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: 'Voir',
      icon: <Eye className="w-4 h-4" />,
      onClick: (prompt: Prompt) => handleView(prompt),
      className: 'text-blue-400 hover:text-blue-300'
    },
    {
      label: 'Modifier',
      icon: <Edit className="w-4 h-4" />,
      onClick: (prompt: Prompt) => handleEdit(prompt),
      className: 'text-green-400 hover:text-green-300'
    },
    {
      label: 'Supprimer',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (prompt: Prompt) => handleDelete(prompt.id),
      className: 'text-red-400 hover:text-red-300'
    }
  ];

  const pageStats = [
    {
      title: 'Total prompts',
      value: stats.total.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: BrainCircuit
    },
    {
      title: 'Prompts publics',
      value: stats.public.toString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Eye
    },
    {
      title: 'Utilisations totales',
      value: stats.totalUsage.toLocaleString(),
      change: '+25%',
      changeType: 'positive' as const,
      icon: Copy
    },
    {
      title: 'Note moyenne',
      value: stats.averageRating.toFixed(1),
      change: '+0.2',
      changeType: 'positive' as const,
      icon: Star
    }
  ];

  const pageActions = [
    {
      label: 'Nouveau prompt',
      icon: <Plus className="w-4 h-4" />,
      onClick: handleCreatePrompt,
      variant: 'primary' as const
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={BrainCircuit}
      title="Gestion des prompts IA"
      subtitle="Gérez et organisez vos prompts IA"
      stats={pageStats}
      actions={pageActions}
    >
      <DataTable
        data={prompts}
        columns={columns}
        actions={actions}
        loading={loading}
        searchPlaceholder="Rechercher un prompt..."
        emptyMessage="Aucun prompt trouvé"
      />
    </AdminLayoutWithSidebar>
  );

}
}