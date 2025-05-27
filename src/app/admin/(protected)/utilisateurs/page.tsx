import { prisma } from '@/lib/prisma';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  UserPlus,
  Crown,
  Shield,
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';

async function getUsers() {
  return await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return Crown;
    case 'ADMIN':
      return Shield;
    default:
      return UserIcon;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'ADMIN':
      return 'text-blue-500 bg-blue-500/10';
    case 'SUPPORT':
      return 'text-green-500 bg-green-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'text-green-500 bg-green-500/10';
    case 'SUSPENDED':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'BANNED':
      return 'text-red-500 bg-red-500/10';
    case 'PENDING':
      return 'text-gray-500 bg-gray-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

export default async function UtilisateursAdmin() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-400">Gérez les comptes utilisateurs de votre plateforme</p>
        </div>
        <Link
          href="/admin/utilisateurs/nouveau"
          className="flex items-center gap-2 bg-[#ff0033] text-white px-4 py-2 rounded-lg hover:bg-[#cc0029] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter un utilisateur
        </Link>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full bg-[#1a1a1a] text-white pl-10 pr-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]"
            />
          </div>
          <select className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]">
            <option value="">Tous les rôles</option>
            <option value="USER">Utilisateur</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="SUPPORT">Support</option>
          </select>
          <select className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg border border-[#232323] focus:outline-none focus:border-[#ff0033]">
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="SUSPENDED">Suspendu</option>
            <option value="BANNED">Banni</option>
            <option value="PENDING">En attente</option>
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#ff0033]" />
            <span className="text-sm text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-400">Actifs</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {users.filter(u => u.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-400">Admins</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {users.filter(u => ['ADMIN', 'SUPER_ADMIN'].includes(u.role)).length}
          </p>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-400">Premium</span>
          </div>
          <p className="text-2xl font-bold text-white">
            0
          </p>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1a1a] border-b border-[#232323]">
              <tr>
                <th className="text-left p-4 text-gray-400 font-medium">Utilisateur</th>
                <th className="text-left p-4 text-gray-400 font-medium">Rôle</th>
                <th className="text-left p-4 text-gray-400 font-medium">Statut</th>
                <th className="text-left p-4 text-gray-400 font-medium">Abonnement</th>
                <th className="text-left p-4 text-gray-400 font-medium">Packs</th>
                <th className="text-left p-4 text-gray-400 font-medium">Dernière connexion</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const roleColor = getRoleColor(user.role);
                const statusColor = getStatusColor(user.status);
                
                return (
                  <tr key={user.id} className="border-b border-[#232323] hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#ff0033] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {(user.firstName?.[0] || 'U').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}`
                              : `Utilisateur ${user.id.slice(0, 8)}`
                            }
                          </p>
                          <p className="text-sm text-gray-400">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleColor}`}>
                        <RoleIcon className="w-3 h-3" />
                        {user.role}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {user.status}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white">-</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white">-</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 