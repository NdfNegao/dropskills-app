'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, Clock, CheckCircle, AlertCircle, User, Reply, Archive, Trash2, Eye } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import DataTable from '@/components/admin/DataTable';

interface SupportTicket {
  id: number;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'general' | 'feature_request';
  created_at: string;
  updated_at: string;
  assigned_to?: string;
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      // Simuler un appel API
      setTimeout(() => {
        const mockTickets: SupportTicket[] = [
          {
            id: 1,
            user_name: "Alice Martin",
            user_email: "alice.martin@email.com",
            subject: "Problème de connexion",
            message: "Je n'arrive pas à me connecter à mon compte depuis ce matin.",
            status: "open",
            priority: "high",
            category: "technical",
            created_at: "2024-01-20T10:30:00Z",
            updated_at: "2024-01-20T10:30:00Z"
          },
          {
            id: 2,
            user_name: "Bob Dupont",
            user_email: "bob.dupont@email.com",
            subject: "Question sur la facturation",
            message: "Pouvez-vous m'expliquer les frais sur ma dernière facture ?",
            status: "in_progress",
            priority: "medium",
            category: "billing",
            created_at: "2024-01-20T09:15:00Z",
            updated_at: "2024-01-20T11:00:00Z",
            assigned_to: "Support Team"
          },
          {
            id: 3,
            user_name: "Claire Rousseau",
            user_email: "claire.rousseau@email.com",
            subject: "Demande de fonctionnalité",
            message: "Serait-il possible d'ajouter une fonction d'export en PDF ?",
            status: "resolved",
            priority: "low",
            category: "feature_request",
            created_at: "2024-01-19T14:20:00Z",
            updated_at: "2024-01-20T08:45:00Z",
            assigned_to: "Dev Team"
          }
        ];
        
        setTickets(mockTickets);
        setStats({
          total: mockTickets.length,
          open: mockTickets.filter(t => t.status === 'open').length,
          inProgress: mockTickets.filter(t => t.status === 'in_progress').length,
          resolved: mockTickets.filter(t => t.status === 'resolved').length
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error);
      setLoading(false);
    }
  };

  const handleView = (ticket: SupportTicket) => {
    console.log('Voir ticket:', ticket.id);
  };

  const handleReply = (ticket: SupportTicket) => {
    console.log('Répondre au ticket:', ticket.id);
  };

  const handleArchive = (ticketId: number) => {
    console.log('Archiver ticket:', ticketId);
  };

  const handleDelete = (ticketId: number) => {
    console.log('Supprimer ticket:', ticketId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-900 text-red-300 border border-red-700';
      case 'in_progress': return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      case 'resolved': return 'bg-green-900 text-green-300 border border-green-700';
      case 'closed': return 'bg-gray-900 text-gray-300 border border-gray-700';
      default: return 'bg-gray-900 text-gray-300 border border-gray-700';
    }
  };

  const getStatusText = (status: string) => {
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
      case 'urgent': return 'bg-red-900 text-red-300 border border-red-700';
      case 'high': return 'bg-orange-900 text-orange-300 border border-orange-700';
      case 'medium': return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      case 'low': return 'bg-green-900 text-green-300 border border-green-700';
      default: return 'bg-gray-900 text-gray-300 border border-gray-700';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'technical': return 'Technique';
      case 'billing': return 'Facturation';
      case 'general': return 'Général';
      case 'feature_request': return 'Fonctionnalité';
      default: return category;
    }
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

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (ticket: SupportTicket) => (
        <span className="font-mono text-blue-400">#{ticket.id}</span>
      )
    },
    {
      key: 'user_name',
      label: 'Utilisateur',
      sortable: true,
      render: (ticket: SupportTicket) => (
        <div>
          <div className="font-medium text-white">{ticket.user_name}</div>
          <div className="text-sm text-gray-400">{ticket.user_email}</div>
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Sujet',
      sortable: true,
      render: (ticket: SupportTicket) => (
        <div>
          <div className="font-medium text-white">{ticket.subject}</div>
          <div className="text-sm text-gray-400">{getCategoryText(ticket.category)}</div>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priorité',
      sortable: true,
      render: (ticket: SupportTicket) => (
        <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(ticket.priority)}`}>
          {getPriorityText(ticket.priority)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (ticket: SupportTicket) => (
        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(ticket.status)}`}>
          {getStatusText(ticket.status)}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Créé le',
      sortable: true,
      render: (ticket: SupportTicket) => (
        <span className="text-sm text-gray-400">
          {formatDate(ticket.created_at)}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: 'Voir',
      icon: <Eye className="w-4 h-4" />,
      onClick: (ticket: SupportTicket) => handleView(ticket),
      className: 'text-blue-400 hover:text-blue-300'
    },
    {
      label: 'Répondre',
      icon: <Reply className="w-4 h-4" />,
      onClick: (ticket: SupportTicket) => handleReply(ticket),
      className: 'text-green-400 hover:text-green-300'
    },
    {
      label: 'Archiver',
      icon: <Archive className="w-4 h-4" />,
      onClick: (ticket: SupportTicket) => handleArchive(ticket.id),
      className: 'text-yellow-400 hover:text-yellow-300'
    },
    {
      label: 'Supprimer',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (ticket: SupportTicket) => handleDelete(ticket.id),
      className: 'text-red-400 hover:text-red-300'
    }
  ];

  const pageStats = [
    {
      title: 'Total tickets',
      value: stats.total.toString(),
      change: '+3',
      changeType: 'positive' as const,
      icon: MessageCircle
    },
    {
      title: 'Ouverts',
      value: stats.open.toString(),
      change: '+1',
      changeType: 'negative' as const,
      icon: AlertCircle
    },
    {
      title: 'En cours',
      value: stats.inProgress.toString(),
      change: '=',
      changeType: 'neutral' as const,
      icon: Clock
    },
    {
      title: 'Résolus',
      value: stats.resolved.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: CheckCircle
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={MessageCircle}
      title="Support client"
      subtitle="Gérez les demandes de support"
      stats={pageStats}
    >
      <DataTable
        data={tickets}
        columns={columns}
        actions={actions}
        loading={loading}
        searchPlaceholder="Rechercher un ticket..."
        emptyMessage="Aucun ticket trouvé"
      />
    </AdminLayoutWithSidebar>
  );

}