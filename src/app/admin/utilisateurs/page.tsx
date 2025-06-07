'use client';
import { useState, useEffect } from 'react';
import { UserCheck, Users, UserPlus, Activity, Search, Filter, Edit, Trash2, Plus } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

interface User {
  id: string;
  email: string;
  name: string;
  subscription_status: 'free' | 'premium' | 'enterprise';
  created_at: string;
  last_login: string;
  is_active: boolean;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  newUsersThisMonth: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }
      
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
      
      // Calculer les stats à partir des données
      const totalUsers = data.pagination.total;
      const activeUsers = data.users.filter((u: User) => u.is_active).length;
      const premiumUsers = data.users.filter((u: User) => u.subscription_status === 'premium').length;
      const newUsersThisMonth = data.users.filter((u: User) => {
        const createdDate = new Date(u.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      }).length;
      
      setStats({
        totalUsers,
        activeUsers,
        premiumUsers,
        newUsersThisMonth
      });
      
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      free: { label: 'Gratuit', class: 'bg-gray-100 text-gray-800' },
      premium: { label: 'Premium', class: 'bg-blue-100 text-blue-800' },
      enterprise: { label: 'Enterprise', class: 'bg-purple-100 text-purple-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.free;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const statsData = stats ? [
    {
      title: "Total utilisateurs",
      value: stats.totalUsers.toString(),
      icon: <Users size={24} />
    },
    {
      title: "Actifs",
      value: stats.activeUsers.toString(),
      icon: <UserCheck size={24} />
    },
    {
      title: "Premium",
      value: stats.premiumUsers.toString(),
      icon: <UserPlus size={24} />
    },
    {
      title: "Nouveaux (30j)",
      value: stats.newUsersThisMonth.toString(),
      icon: <Activity size={24} />
    }
  ] : [];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Users size={24} />}
        title="Gestion des utilisateurs"
        subtitle="Gérez les comptes utilisateurs de la plateforme"
        stats={[]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff0033]"></div>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<Users size={24} />}
      title="Gestion des utilisateurs"
      subtitle="Gérez les comptes utilisateurs de la plateforme"
      stats={statsData}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          <p className="font-medium">Erreur</p>
          <p>{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff0033] focus:border-transparent w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg font-medium"
            >
              Rechercher
            </button>
          </form>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="free">Gratuit</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
              <Plus className="w-4 h-4" />
              Nouvel utilisateur
            </button>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold text-black mb-6">Liste des utilisateurs</h2>
        
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Nom</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Statut</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Inscription</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Dernière connexion</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-black font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">{getStatusBadge(user.subscription_status)}</td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="py-3 px-4 text-gray-600">{formatDate(user.last_login)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-1 rounded" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayoutWithSidebar>
  );
}