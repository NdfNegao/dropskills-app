'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Users, Star, Edit, Trash2, Eye, Euro } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { StatCard } from '@/components/admin/AdminDashboard';

interface Pack {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  toolsCount: number;
  subscribers: number;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  revenue: number;
}

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      setPacks([
        {
          id: 1,
          name: 'Pack Développeur',
          description: 'Outils essentiels pour les développeurs',
          price: 29,
          currency: 'EUR',
          toolsCount: 5,
          subscribers: 45,
          status: 'active',
          createdAt: '2024-01-15',
          revenue: 1305
        },
        {
          id: 2,
          name: 'Pack Marketing',
          description: 'Suite complète pour les marketeurs',
          price: 19,
          currency: 'EUR',
          toolsCount: 3,
          subscribers: 32,
          status: 'active',
          createdAt: '2024-01-10',
          revenue: 608
        },
        {
          id: 3,
          name: 'Pack Designer',
          description: 'Outils créatifs pour les designers',
          price: 24,
          currency: 'EUR',
          toolsCount: 4,
          subscribers: 28,
          status: 'active',
          createdAt: '2024-01-08',
          revenue: 672
        },
        {
          id: 4,
          name: 'Pack Entreprise',
          description: 'Solution complète pour les entreprises',
          price: 99,
          currency: 'EUR',
          toolsCount: 12,
          subscribers: 8,
          status: 'active',
          createdAt: '2024-01-05',
          revenue: 792
        },
        {
          id: 5,
          name: 'Pack Étudiant',
          description: 'Tarif préférentiel pour les étudiants',
          price: 9,
          currency: 'EUR',
          toolsCount: 2,
          subscribers: 67,
          status: 'active',
          createdAt: '2024-01-12',
          revenue: 603
        },
        {
          id: 6,
          name: 'Pack Beta',
          description: 'Accès aux fonctionnalités en test',
          price: 15,
          currency: 'EUR',
          toolsCount: 3,
          subscribers: 0,
          status: 'draft',
          createdAt: '2024-01-20',
          revenue: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-300 border border-green-700';
      case 'inactive': return 'bg-red-900 text-red-300 border border-red-700';
      case 'draft': return 'bg-gray-900 text-gray-300 border border-gray-700';
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

  const handleEdit = (pack: Pack) => {
    console.log('Edit pack:', pack);
  };

  const handleDelete = (packId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pack ?')) {
      setPacks(packs.filter(pack => pack.id !== packId));
    }
  };

  const handleView = (pack: Pack) => {
    console.log('View pack details:', pack);
  };

  const columns = [
    {
      key: 'pack',
      label: 'Pack',
      render: (pack: Pack) => (
        <div>
          <div className="text-sm font-medium text-white">{pack.name}</div>
          <div className="text-sm text-gray-400">{pack.description}</div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Prix',
      render: (pack: Pack) => (
        <span className="text-sm text-white font-medium">
          €{pack.price}/mois
        </span>
      )
    },
    {
      key: 'tools',
      label: 'Outils',
      render: (pack: Pack) => (
        <span className="text-sm text-white">{pack.toolsCount} outils</span>
      )
    },
    {
      key: 'subscribers',
      label: 'Abonnés',
      render: (pack: Pack) => (
        <div className="flex items-center gap-1 text-sm text-white">
          <Users className="w-4 h-4 text-blue-400" />
          {pack.subscribers}
        </div>
      )
    },
    {
      key: 'revenue',
      label: 'Revenus',
      render: (pack: Pack) => (
        <span className="text-sm text-green-400 font-medium">
          €{pack.revenue.toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (pack: Pack) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pack.status)}`}>
          {getStatusText(pack.status)}
        </span>
      )
    }
  ];

  const actions = [
    {
      icon: Eye,
      label: 'Voir les détails',
      onClick: (pack: Pack) => handleView(pack),
      className: 'text-blue-400 hover:text-blue-300'
    },
    {
      icon: Edit,
      label: 'Modifier',
      onClick: (pack: Pack) => handleEdit(pack),
      className: 'text-yellow-400 hover:text-yellow-300'
    },
    {
      icon: Trash2,
      label: 'Supprimer',
      onClick: (pack: Pack) => handleDelete(pack.id),
      className: 'text-red-400 hover:text-red-300'
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Statut',
      options: [
        { value: 'all', label: 'Tous les statuts' },
        { value: 'active', label: 'Actif' },
        { value: 'inactive', label: 'Inactif' },
        { value: 'draft', label: 'Brouillon' }
      ]
    }
  ];

  const handleCreatePack = () => {
    console.log('Create new pack');
  };

  const totalRevenue = packs.reduce((sum, pack) => sum + pack.revenue, 0);
  const totalSubscribers = packs.reduce((sum, pack) => sum + pack.subscribers, 0);
  const activePacks = packs.filter(pack => pack.status === 'active').length;

  return (
    <AdminLayout
      title="Gestion des packs"
      icon={Package}
      actions={[
        {
          label: 'Nouveau pack',
          icon: Plus,
          onClick: handleCreatePack,
          variant: 'primary'
        }
      ]}
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total packs"
          value={packs.length.toString()}
          icon={Package}
          color="text-purple-400"
        />
        <StatCard
          title="Packs actifs"
          value={activePacks.toString()}
          icon={() => <div className="w-3 h-3 bg-green-400 rounded-full" />}
          color="text-green-400"
        />
        <StatCard
          title="Abonnements"
          value={totalSubscribers.toString()}
          icon={Users}
          color="text-blue-400"
        />
        <StatCard
          title="Revenus/mois"
          value={`€${(totalRevenue / 1000).toFixed(1)}k`}
          icon={Euro}
          color="text-yellow-400"
        />
      </div>

      {/* Table des packs */}
      <DataTable
        data={packs}
        columns={columns}
        actions={actions}
        filters={filters}
        loading={loading}
        searchPlaceholder="Rechercher un pack..."
        searchKeys={['name', 'description']}
        emptyMessage="Aucun pack trouvé"
      />
    </AdminLayout>
  );
}