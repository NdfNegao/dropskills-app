import { Metadata } from 'next';
import { FileText, User, Calendar, Filter, Search, Download, Eye } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Logs | Admin DropSkills',
  description: 'Historique des actions d\'administration',
};

async function getLogs() {
  try {
    const logs = await prisma.adminLog.findMany({
      include: {
        admin: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limiter à 100 logs récents
    });
    return logs;
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    return [];
  }
}

export default async function LogsPage() {
  const logs = await getLogs();

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-500/10 text-green-400';
    if (action.includes('UPDATE')) return 'bg-blue-500/10 text-blue-400';
    if (action.includes('DELETE')) return 'bg-red-500/10 text-red-400';
    if (action.includes('SUSPEND') || action.includes('BAN')) return 'bg-orange-500/10 text-orange-400';
    return 'bg-gray-500/10 text-gray-400';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('USER')) return '👤';
    if (action.includes('PACK')) return '📦';
    if (action.includes('TOOL')) return '🤖';
    if (action.includes('WEBHOOK')) return '🔗';
    if (action.includes('SUBSCRIPTION')) return '💳';
    return '📝';
  };

  const formatAction = (action: string) => {
    const actionMap: { [key: string]: string } = {
      'USER_CREATED': 'Utilisateur créé',
      'USER_UPDATED': 'Utilisateur modifié',
      'USER_DELETED': 'Utilisateur supprimé',
      'USER_SUSPENDED': 'Utilisateur suspendu',
      'USER_BANNED': 'Utilisateur banni',
      'PACK_CREATED': 'Pack créé',
      'PACK_UPDATED': 'Pack modifié',
      'PACK_DELETED': 'Pack supprimé',
      'PACK_PUBLISHED': 'Pack publié',
      'SUBSCRIPTION_GRANTED': 'Abonnement accordé',
      'SUBSCRIPTION_REVOKED': 'Abonnement révoqué',
      'TOOL_CONFIGURED': 'Outil configuré',
      'WEBHOOK_PROCESSED': 'Webhook traité',
      'CUSTOM': 'Action personnalisée'
    };
    return actionMap[action] || action;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Logs d'Administration</h1>
        <div className="flex gap-2">
          <button className="bg-[#18181b] text-white px-4 py-2 rounded-lg border border-[#232323] hover:bg-[#232323] transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Actions</p>
              <p className="text-2xl font-bold text-white">{logs.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Aujourd'hui</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(log => {
                  const today = new Date();
                  const logDate = new Date(log.createdAt);
                  return logDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admins Actifs</p>
              <p className="text-2xl font-bold text-white">
                {new Set(logs.map(log => log.adminId)).size}
              </p>
            </div>
            <User className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Actions Critiques</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(log => 
                  log.action.includes('DELETE') || 
                  log.action.includes('BAN') || 
                  log.action.includes('SUSPEND')
                ).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              className="w-full bg-[#18181b] text-white rounded-lg pl-10 pr-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
            />
          </div>
          <select className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
            <option value="">Toutes les actions</option>
            <option value="USER">Actions utilisateurs</option>
            <option value="PACK">Actions packs</option>
            <option value="TOOL">Actions outils</option>
            <option value="WEBHOOK">Actions webhooks</option>
            <option value="SUBSCRIPTION">Actions abonnements</option>
          </select>
          <select className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
            <option value="">Toutes les ressources</option>
            <option value="users">Utilisateurs</option>
            <option value="packs">Packs</option>
            <option value="tools">Outils</option>
            <option value="tickets">Tickets</option>
          </select>
          <input
            type="date"
            className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
          />
          <button className="bg-[#18181b] text-white px-4 py-2 rounded-lg border border-[#232323] hover:bg-[#232323] transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Liste des logs */}
      <div className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#18181b]">
              <tr>
                <th className="text-left text-gray-400 p-4 font-medium">Action</th>
                <th className="text-left text-gray-400 p-4 font-medium">Administrateur</th>
                <th className="text-left text-gray-400 p-4 font-medium">Ressource</th>
                <th className="text-left text-gray-400 p-4 font-medium">Description</th>
                <th className="text-left text-gray-400 p-4 font-medium">IP</th>
                <th className="text-left text-gray-400 p-4 font-medium">Date</th>
                <th className="text-left text-gray-400 p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[#232323] hover:bg-[#18181b]/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getActionIcon(log.action)}</span>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {formatAction(log.action)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#232323] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm">
                          {log.admin.firstName} {log.admin.lastName}
                        </p>
                        <p className="text-gray-400 text-xs">{log.admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white text-sm">{log.resource || 'N/A'}</p>
                      {log.resourceId && (
                        <p className="text-gray-400 text-xs font-mono">{log.resourceId.slice(0, 8)}...</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {log.description || 'Aucune description'}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm font-mono">
                      {log.ipAddress || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-400 text-sm">
                      <p>{new Date(log.createdAt).toLocaleDateString('fr-FR')}</p>
                      <p className="text-xs">{new Date(log.createdAt).toLocaleTimeString('fr-FR')}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-[#232323] rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Aucun log trouvé</p>
            <p className="text-gray-500 text-sm">L'historique des actions apparaîtra ici</p>
          </div>
        )}
      </div>
    </div>
  );
} 