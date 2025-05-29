'use client';

import React, { useState, useEffect } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Edit3,
  Trash2,
  Save,
  X,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Users,
  Filter,
  Search
} from 'lucide-react';

interface ProductRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  votes_count: number;
  user_id: string;
  user_email: string;
  admin_notes?: string;
  priority: 'low' | 'medium' | 'high';
  estimated_completion?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminProductRequestsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ProductRequest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editingRequest, setEditingRequest] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductRequest>>({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Vérifier les permissions admin
  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN'))) {
      router.push('/');
      return;
    }
  }, [user, isLoading, router]);

  // Charger les demandes
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await fetch('/api/admin/product-requests');
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
          setFilteredRequests(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des demandes:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN')) {
      loadRequests();
    }
  }, [user]);

  // Filtrer les demandes
  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(req => req.priority === priorityFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, priorityFilter]);

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleEdit = (request: ProductRequest) => {
    setEditingRequest(request.id);
    setEditForm({
      status: request.status,
      priority: request.priority,
      admin_notes: request.admin_notes || '',
      estimated_completion: request.estimated_completion || ''
    });
  };

  const handleSave = async (requestId: string) => {
    try {
      const response = await fetch('/api/admin/product-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId,
          ...editForm
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId ? result.request : req
          )
        );
        setEditingRequest(null);
        setEditForm({});
        showMessage('Demande mise à jour avec succès', 'success');
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      showMessage('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/product-requests?id=${requestId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRequests(prev => prev.filter(req => req.id !== requestId));
        showMessage('Demande supprimée avec succès', 'success');
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      showMessage('Erreur lors de la suppression', 'error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Lightbulb className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-400';
      case 'in_progress': return 'text-yellow-400';
      case 'completed': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
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

  if (isLoading || isLoadingData) {
    return (
      <LayoutWithSidebar>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
          <span className="ml-2 text-gray-300">Chargement...</span>
        </div>
      </LayoutWithSidebar>
    );
  }

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return null;
  }

  const stats = {
    total: requests.length,
    pending: requests.filter(req => req.status === 'pending').length,
    inProgress: requests.filter(req => req.status === 'in_progress').length,
    completed: requests.filter(req => req.status === 'completed').length,
    rejected: requests.filter(req => req.status === 'rejected').length,
    totalVotes: requests.reduce((sum, req) => sum + req.votes_count, 0)
  };

  return (
    <LayoutWithSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Gestion des Demandes de Produits
              </h1>
              <p className="text-gray-400">
                Administrez les demandes de la communauté
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#ff0033]/10 text-[#ff0033] px-4 py-2 rounded-full">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>

        {/* Message de feedback */}
        {message && (
          <div className={`border rounded-lg p-4 ${
            messageType === 'success' 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <p className={`text-sm ${
              messageType === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>{message}</p>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
            <p className="text-gray-400 text-sm">Total</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="text-2xl font-bold text-blue-400 mb-1">{stats.pending}</div>
            <p className="text-gray-400 text-sm">En attente</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.inProgress}</div>
            <p className="text-gray-400 text-sm">En cours</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.completed}</div>
            <p className="text-gray-400 text-sm">Terminées</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="text-2xl font-bold text-red-400 mb-1">{stats.rejected}</div>
            <p className="text-gray-400 text-sm">Rejetées</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.totalVotes}</div>
            <p className="text-gray-400 text-sm">Votes total</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-colors"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminées</option>
              <option value="rejected">Rejetées</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-colors"
            >
              <option value="all">Toutes les priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-[#111111] rounded-xl p-12 text-center border border-[#232323]">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucune demande trouvée</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-[#111111] rounded-xl p-6 border border-[#232323] hover:border-[#333] transition-colors">
                {editingRequest === request.id ? (
                  // Mode édition
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">{request.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditingRequest(null)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Annuler
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Statut</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white"
                        >
                          <option value="pending">En attente</option>
                          <option value="in_progress">En cours</option>
                          <option value="completed">Terminée</option>
                          <option value="rejected">Rejetée</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Priorité</label>
                        <select
                          value={editForm.priority}
                          onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white"
                        >
                          <option value="low">Basse</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Haute</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Date estimée</label>
                        <input
                          type="date"
                          value={editForm.estimated_completion}
                          onChange={(e) => setEditForm({ ...editForm, estimated_completion: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Notes admin</label>
                      <textarea
                        value={editForm.admin_notes}
                        onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white h-24 resize-none"
                        placeholder="Notes internes..."
                      />
                    </div>
                  </div>
                ) : (
                  // Mode affichage
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{request.title}</h3>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)} bg-current/10`}>
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status.replace('_', ' ')}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority === 'high' ? 'Haute' : request.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{request.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Demandeur:</span> {request.user_email}
                          </div>
                          <div>
                            <span className="font-medium">Créée le:</span> {formatDate(request.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span className="font-medium">{request.votes_count} votes</span>
                          </div>
                        </div>

                        {request.admin_notes && (
                          <div className="mt-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#333]">
                            <p className="text-gray-300 text-sm">
                              <span className="font-medium text-yellow-400">Notes admin:</span> {request.admin_notes}
                            </p>
                          </div>
                        )}

                        {request.estimated_completion && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-blue-400">
                            <Calendar className="w-3 h-3" />
                            <span>Livraison estimée: {new Date(request.estimated_completion).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(request)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Éditer
                        </button>
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 