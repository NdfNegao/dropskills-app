import { Metadata } from 'next';
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Calendar, Filter, Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Support | Admin DropSkills',
  description: 'Gestion des tickets de support',
};

async function getTickets() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        },
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            responses: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return tickets;
  } catch (error) {
    console.error('Erreur lors de la récupération des tickets:', error);
    return [];
  }
}

export default async function SupportPage() {
  const tickets = await getTickets();

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500/10 text-red-400';
      case 'HIGH': return 'bg-orange-500/10 text-orange-400';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-400';
      case 'LOW': return 'bg-green-500/10 text-green-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-500/10 text-blue-400';
      case 'IN_PROGRESS': return 'bg-orange-500/10 text-orange-400';
      case 'RESOLVED': return 'bg-green-500/10 text-green-400';
      case 'CLOSED': return 'bg-gray-500/10 text-gray-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Support</h1>
        <div className="flex gap-2">
          <button className="bg-[#18181b] text-white px-4 py-2 rounded-lg border border-[#232323] hover:bg-[#232323] transition-colors">
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tickets</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ouverts</p>
              <p className="text-2xl font-bold text-white">{stats.open}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">En cours</p>
              <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Résolus</p>
              <p className="text-2xl font-bold text-white">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
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
              placeholder="Rechercher un ticket..."
              className="w-full bg-[#18181b] text-white rounded-lg pl-10 pr-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
            />
          </div>
          <select className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
            <option value="">Tous les statuts</option>
            <option value="OPEN">Ouvert</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="RESOLVED">Résolu</option>
            <option value="CLOSED">Fermé</option>
          </select>
          <select className="bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
            <option value="">Toutes les priorités</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">Élevée</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Faible</option>
          </select>
          <button className="bg-[#18181b] text-white px-4 py-2 rounded-lg border border-[#232323] hover:bg-[#232323] transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#18181b]">
              <tr>
                <th className="text-left text-gray-400 p-4 font-medium">Ticket</th>
                <th className="text-left text-gray-400 p-4 font-medium">Utilisateur</th>
                <th className="text-left text-gray-400 p-4 font-medium">Statut</th>
                <th className="text-left text-gray-400 p-4 font-medium">Priorité</th>
                <th className="text-left text-gray-400 p-4 font-medium">Assigné à</th>
                <th className="text-left text-gray-400 p-4 font-medium">Réponses</th>
                <th className="text-left text-gray-400 p-4 font-medium">Date</th>
                <th className="text-left text-gray-400 p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-[#232323] hover:bg-[#18181b]/50">
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{ticket.title}</p>
                      <p className="text-gray-400 text-sm line-clamp-2">{ticket.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#232323] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm">
                          {ticket.user.firstName} {ticket.user.lastName}
                        </p>
                        <p className="text-gray-400 text-xs">{ticket.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'OPEN' ? 'Ouvert' :
                       ticket.status === 'IN_PROGRESS' ? 'En cours' :
                       ticket.status === 'RESOLVED' ? 'Résolu' : 'Fermé'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'URGENT' ? 'Urgent' :
                       ticket.priority === 'HIGH' ? 'Élevée' :
                       ticket.priority === 'MEDIUM' ? 'Moyenne' : 'Faible'}
                    </span>
                  </td>
                  <td className="p-4">
                    {ticket.assignedTo ? (
                      <div className="text-white text-sm">
                        {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Non assigné</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">{ticket._count.responses}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="bg-[#00D2FF] text-black px-3 py-1 rounded text-xs font-medium hover:bg-[#00B8E6] transition-colors">
                        Voir
                      </button>
                      <button className="bg-[#18181b] text-white px-3 py-1 rounded text-xs border border-[#232323] hover:bg-[#232323] transition-colors">
                        Assigner
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Aucun ticket trouvé</p>
            <p className="text-gray-500 text-sm">Les tickets de support apparaîtront ici</p>
          </div>
        )}
      </div>
    </div>
  );
} 