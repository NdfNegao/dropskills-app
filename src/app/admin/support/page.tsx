"use client";

import { useState, useEffect } from 'react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { 
  HeadphonesIcon, Clock, CheckCircle, AlertTriangle, User, 
  Search, Filter, MoreHorizontal, MessageSquare, Calendar 
} from 'lucide-react';
import type { SupportTicket } from '@/types/admin';

interface SupportResponse {
  tickets: SupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [response, setResponse] = useState('');
  const [updatingTicket, setUpdatingTicket] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);

      const response = await fetch(`/api/admin/support?${params}`);
      const data: SupportResponse = await response.json();
      
      if (response.ok) {
        setTickets(data.tickets || []);
      } else {
        console.error('Erreur chargement tickets:', data);
      }
    } catch (error) {
      console.error('Erreur chargement tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      setUpdatingTicket(ticketId);
      const response = await fetch(`/api/admin/support/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchTickets();
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Erreur mise à jour ticket:', error);
    } finally {
      setUpdatingTicket(null);
    }
  };

  const addResponse = async (ticketId: string) => {
    if (!response.trim()) return;

    try {
      setUpdatingTicket(ticketId);
      const updateResponse = await fetch(`/api/admin/support/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          response: response.trim(),
          status: 'resolved',
          assigned_to: 'Équipe Support'
        })
      });

      if (updateResponse.ok) {
        setResponse('');
        await fetchTickets();
        if (selectedTicket && selectedTicket.id === ticketId) {
          const updatedTicket = await updateResponse.json();
          setSelectedTicket(updatedTicket);
        }
      }
    } catch (error) {
      console.error('Erreur ajout réponse:', error);
    } finally {
      setUpdatingTicket(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'in_progress': return 'En cours';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    if (!searchTerm) return true;
    return (
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const avgResponseTime = '2h 15min'; // À calculer réellement plus tard

  const statsData = [
    {
      title: "Tickets ouverts",
      value: openTickets.toString(),
      icon: <AlertTriangle size={24} />
    },
    {
      title: "En cours",
      value: inProgressTickets.toString(),
      icon: <Clock size={24} />
    },
    {
      title: "Résolus",
      value: resolvedTickets.toString(),
      icon: <CheckCircle size={24} />
    },
    {
      title: "Temps moyen",
      value: avgResponseTime,
      icon: <HeadphonesIcon size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<HeadphonesIcon size={24} />}
      title="Support Client"
      subtitle="Gestion des demandes et tickets de support"
      stats={statsData}
    >
      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher dans les tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">
              Tickets de Support ({filteredTickets.length})
            </h3>
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Trier par date
            </button>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setShowTicketDetail(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                        <h4 className="font-semibold text-black hover:text-blue-600 transition-colors">
                          {ticket.subject}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                          {getStatusLabel(ticket.status)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {getPriorityLabel(ticket.priority)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{ticket.user_email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(ticket.created_at)}</span>
                        </div>
                        {ticket.assigned_to && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>Assigné à {ticket.assigned_to}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 text-sm line-clamp-2">{ticket.message}</p>
                      
                      {ticket.response && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Réponse :</strong> {ticket.response}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {ticket.status === 'open' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTicketStatus(ticket.id, 'in_progress');
                          }}
                          disabled={updatingTicket === ticket.id}
                          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors disabled:opacity-50"
                        >
                          {updatingTicket === ticket.id ? '...' : 'Prendre en charge'}
                        </button>
                      )}
                      
                      {ticket.status === 'in_progress' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTicketStatus(ticket.id, 'resolved');
                          }}
                          disabled={updatingTicket === ticket.id}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {updatingTicket === ticket.id ? '...' : 'Résoudre'}
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                          setShowTicketDetail(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTickets.length === 0 && !loading && (
                <div className="text-center py-12">
                  <HeadphonesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun ticket trouvé</h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'Essayez de modifier vos filtres de recherche'
                      : 'Tous vos tickets sont traités !'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal détail ticket */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-black">Détail du ticket</h2>
                <button
                  onClick={() => setShowTicketDetail(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                  <p className="text-black font-medium">{selectedTicket.subject}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-600">{selectedTicket.user_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                    <span className={`inline-flex items-center gap-2`}>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedTicket.priority)}`}></div>
                      {getPriorityLabel(selectedTicket.priority)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedTicket.message}</p>
                  </div>
                </div>

                {selectedTicket.response && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Réponse</label>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-green-800 whitespace-pre-wrap">{selectedTicket.response}</p>
                    </div>
                  </div>
                )}

                {(!selectedTicket.response && selectedTicket.status !== 'resolved') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ajouter une réponse</label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Tapez votre réponse ici..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => addResponse(selectedTicket.id)}
                        disabled={!response.trim() || updatingTicket === selectedTicket.id}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {updatingTicket === selectedTicket.id ? 'Envoi...' : 'Envoyer réponse'}
                      </button>
                      <button
                        onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                        disabled={updatingTicket === selectedTicket.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {updatingTicket === selectedTicket.id ? '...' : 'Marquer comme résolu'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWithSidebar>
  );
}