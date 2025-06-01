'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import DataTable from '@/components/admin/DataTable';

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

  const statsData = [
    {
      title: "Total Utilisateurs",
      value: stats.total.toLocaleString(),
      change: "+12% ce mois",
      changeType: 'positive' as const,
      icon: <Users size={24} />
    },
    {
      title: "Actifs",
      value: stats.active.toLocaleString(),
      change: "+5% cette semaine",
      changeType: 'positive' as const,
      icon: <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"><div className="w-3 h-3 bg-white rounded-full" /></div>
    },
    {
      title: "Inactifs",
      value: stats.inactive.toLocaleString(),
      change: "-2% cette semaine",
      changeType: 'negative' as const,
      icon: <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center"><div className="w-3 h-3 bg-white rounded-full" /></div>
    },
    {
      title: "Nouveaux (7j)",
      value: stats.newThisWeek.toLocaleString(),
      change: "+8% vs semaine précédente",
      changeType: 'positive' as const,
      icon: <UserPlus size={24} />
    }
  ];

  const pageActions = (
    <button
      onClick={handleCreateUser}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <UserPlus size={20} />
      Nouvel utilisateur
    </button>
  );

  return (
    <AdminLayoutWithSidebar
      icon={<Users size={24} />}
      title="Gestion des Utilisateurs"
      subtitle="Gérez tous les utilisateurs de la plateforme"
      stats={statsData}
      actions={pageActions}
    >
      {/* Table des utilisateurs */}
      <div className="bg-white rounded-lg border border-gray-200">
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
      </div>
    </AdminLayoutWithSidebar>
  );
}