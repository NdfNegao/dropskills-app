'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import { StatCard } from '@/components/admin/AdminDashboard';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: string;
  plan: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 1234,
    active: 1156,
    inactive: 78,
    newThisWeek: 23
  });

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15', plan: 'Pro' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: '2024-01-10', plan: 'Basic' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', joinDate: '2024-01-05', plan: 'Pro' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', joinDate: '2024-01-20', plan: 'Premium' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'inactive', joinDate: '2024-01-08', plan: 'Basic' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    {
      key: 'user',
      label: 'Utilisateur',
      render: (user: User) => (
        <div>
          <div className="text-sm font-medium text-white">{user.name}</div>
          <div className="text-sm text-gray-400">{user.email}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (user: User) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          user.status === 'active' 
            ? 'bg-green-900 text-green-300 border border-green-700' 
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {user.status === 'active' ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (user: User) => (
        <span className="text-sm text-white">{user.plan}</span>
      )
    },
    {
      key: 'joinDate',
      label: 'Date d\'inscription',
      render: (user: User) => (
        <span className="text-sm text-gray-400">{user.joinDate}</span>
      )
    }
  ];

  const actions = [
    {
      icon: Eye,
      label: 'Voir',
      onClick: (user: User) => console.log('Voir utilisateur:', user.id),
      className: 'text-blue-400 hover:text-blue-300'
    },
    {
      icon: Edit,
      label: 'Modifier',
      onClick: (user: User) => console.log('Modifier utilisateur:', user.id),
      className: 'text-yellow-400 hover:text-yellow-300'
    },
    {
      icon: Trash2,
      label: 'Supprimer',
      onClick: (user: User) => console.log('Supprimer utilisateur:', user.id),
      className: 'text-red-400 hover:text-red-300'
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Statut',
      options: [
        { value: 'all', label: 'Tous les statuts' },
        { value: 'active', label: 'Actifs' },
        { value: 'inactive', label: 'Inactifs' }
      ]
    },
    {
      key: 'plan',
      label: 'Plan',
      options: [
        { value: 'all', label: 'Tous les plans' },
        { value: 'Basic', label: 'Basic' },
        { value: 'Pro', label: 'Pro' },
        { value: 'Premium', label: 'Premium' }
      ]
    }
  ];

  const handleCreateUser = () => {
    console.log('Créer un nouvel utilisateur');
  };

  return (
    <AdminLayout
      title="Gestion des Utilisateurs"
      icon={Users}
      actions={[
        {
          label: 'Nouvel utilisateur',
          icon: UserPlus,
          onClick: handleCreateUser,
          variant: 'primary'
        }
      ]}
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Utilisateurs"
          value={stats.total.toLocaleString()}
          icon={Users}
          color="text-blue-400"
        />
        <StatCard
          title="Actifs"
          value={stats.active.toLocaleString()}
          icon={() => <div className="w-3 h-3 bg-green-400 rounded-full" />}
          color="text-green-400"
        />
        <StatCard
          title="Inactifs"
          value={stats.inactive.toLocaleString()}
          icon={() => <div className="w-3 h-3 bg-red-400 rounded-full" />}
          color="text-red-400"
        />
        <StatCard
          title="Nouveaux (7j)"
          value={stats.newThisWeek.toLocaleString()}
          icon={UserPlus}
          color="text-purple-400"
        />
      </div>

      {/* Table des utilisateurs */}
      <DataTable
        data={users}
        columns={columns}
        actions={actions}
        filters={filters}
        loading={loading}
        searchPlaceholder="Rechercher par nom ou email..."
        searchKeys={['name', 'email']}
        emptyMessage="Aucun utilisateur trouvé"
      />
    </AdminLayout>
  );
}