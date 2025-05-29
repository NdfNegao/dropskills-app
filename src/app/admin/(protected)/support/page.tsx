'use client';

import { useState } from 'react';
import { MessageSquare, User, Clock, CheckCircle, AlertTriangle, Search, Filter } from 'lucide-react';

interface SupportTicket {
  id: string;
  user: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  category: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    user: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    subject: 'Problème avec l\'outil IA Générateur d\'offres',
    message: 'L\'outil ne génère pas de résultats quand je clique sur le bouton...',
    status: 'open',
    priority: 'high',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    category: 'Technique'
  },
  {
    id: '2',
    user: 'Marie Martin',
    email: 'marie.martin@email.com',
    subject: 'Question sur l\'abonnement Premium',
    message: 'Je voudrais savoir comment annuler mon abonnement...',
    status: 'in_progress',
    priority: 'medium',
    created_at: '2024-01-14T15:20:00Z',
    updated_at: '2024-01-15T09:15:00Z',
    category: 'Facturation'
  },
  {
    id: '3',
    user: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    subject: 'Demande de fonctionnalité',
    message: 'Serait-il possible d\'ajouter un export PDF pour les résultats...',
    status: 'resolved',
    priority: 'low',
    created_at: '2024-01-13T11:45:00Z',
    updated_at: '2024-01-14T16:30:00Z',
    category: 'Fonctionnalité'
  }
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchSearch && matchStatus && matchPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-400 bg-red-400/10';
      case 'in_progress': return 'text-yellow-400 bg-yellow-400/10';
      case 'resolved': return 'text-green-400 bg-green-400/10';
      case 'closed': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Support Client</h1>
          <p className="text-gray-400 mt-2">Gestion des tickets et demandes d'assistance</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
          <p className="text-gray-400 text-sm">Total tickets</p>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="text-2xl font-bold text-red-400 mb-1">{stats.open}</div>
          <p className="text-gray-400 text-sm">Ouverts</p>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.inProgress}</div>
          <p className="text-gray-400 text-sm">En cours</p>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="text-2xl font-bold text-green-400 mb-1">{stats.resolved}</div>
          <p className="text-gray-400 text-sm">Résolus</p>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
          <div className="text-2xl font-bold text-red-500 mb-1">{stats.urgent}</div>
          <p className="text-gray-400 text-sm">Urgents</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033]"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouverts</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolus</option>
            <option value="closed">Fermés</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
          >
            <option value="all">Toutes les priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Élevée</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1a1a] border-b border-[#232323]">
              <tr>
                <th className="text-left p-4 text-gray-400 font-medium">Utilisateur</th>
                <th className="text-left p-4 text-gray-400 font-medium">Sujet</th>
                <th className="text-left p-4 text-gray-400 font-medium">Catégorie</th>
                <th className="text-left p-4 text-gray-400 font-medium">Statut</th>
                <th className="text-left p-4 text-gray-400 font-medium">Priorité</th>
                <th className="text-left p-4 text-gray-400 font-medium">Créé le</th>
                <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-[#232323] hover:bg-[#1a1a1a]">
                  <td className="p-4">
                    <div>
                      <div className="text-white font-medium">{ticket.user}</div>
                      <div className="text-gray-400 text-sm">{ticket.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium max-w-xs truncate">
                      {ticket.subject}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300 text-sm">{ticket.category}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' && 'Ouvert'}
                      {ticket.status === 'in_progress' && 'En cours'}
                      {ticket.status === 'resolved' && 'Résolu'}
                      {ticket.status === 'closed' && 'Fermé'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'urgent' && 'Urgent'}
                      {ticket.priority === 'high' && 'Élevée'}
                      {ticket.priority === 'medium' && 'Moyenne'}
                      {ticket.priority === 'low' && 'Faible'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    <button className="text-[#ff0033] hover:underline text-sm">
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucun ticket trouvé</h3>
          <p className="text-gray-400">Aucun ticket ne correspond à vos critères de recherche</p>
        </div>
      )}
    </div>
  );
} 