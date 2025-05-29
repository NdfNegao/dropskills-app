'use client';

import React, { useState, useEffect } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Check, 
  X, 
  Clock, 
  Mail, 
  Calendar,
  ExternalLink,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';

interface AffiliateApplication {
  id: string;
  user_email: string;
  contact_email: string;
  promotion_method: string;
  affiliate_code: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  total_commissions?: number;
  total_referrals?: number;
}

export default function AdminAffiliatesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<AffiliateApplication[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Vérifier les permissions admin
  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN'))) {
      router.push('/');
      return;
    }
  }, [user, isLoading, router]);

  // Charger les demandes d'affiliation
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await fetch('/api/admin/affiliates');
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
          setFilteredApplications(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des demandes:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN')) {
      loadApplications();
    }
  }, [user]);

  // Filtrer les applications
  useEffect(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.promotion_method.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/affiliates/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setApplications(prev => 
          prev.map(app => 
            app.id === id ? { ...app, status, updated_at: new Date().toISOString() } : app
          )
        );
        showMessage(`Demande ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès`, 'success');
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      showMessage('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      approved: 'bg-green-500/10 text-green-400 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
    };

    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <Check className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />
    };

    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
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
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <LayoutWithSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Gestion des Affiliés
              </h1>
              <p className="text-gray-400">
                Gérez les demandes d'affiliation et suivez les performances
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#ff0033]/10 text-[#ff0033] px-4 py-2 rounded-full">
              <Users className="w-4 h-4" />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
            <p className="text-gray-400 text-sm">Total demandes</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.pending}</div>
            <p className="text-gray-400 text-sm">En attente</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.approved}</div>
            <p className="text-gray-400 text-sm">Approuvées</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="text-2xl font-bold text-red-400 mb-1">{stats.rejected}</div>
            <p className="text-gray-400 text-sm">Rejetées</p>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par email ou méthode de promotion..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
                />
              </div>
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] transition-colors appearance-none pr-10"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="bg-[#111111] rounded-xl border border-[#232323] overflow-hidden">
          <div className="p-6 border-b border-[#232323]">
            <h2 className="text-xl font-semibold text-white">
              Demandes d'affiliation ({filteredApplications.length})
            </h2>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="divide-y divide-[#232323]">
              {filteredApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#ff0033]/10 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-[#ff0033]" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{application.contact_email}</h3>
                          <p className="text-gray-400 text-sm">Code: {application.affiliate_code}</p>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Email utilisateur:</p>
                          <p className="text-white text-sm">{application.user_email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Date de demande:</p>
                          <p className="text-white text-sm flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(application.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-2">Méthode de promotion:</p>
                        <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
                          <p className="text-white text-sm">{application.promotion_method}</p>
                        </div>
                      </div>

                      {application.status === 'approved' && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-[#1a1a1a] rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Commissions totales</p>
                            <p className="text-green-400 font-medium">{application.total_commissions || 0}€</p>
                          </div>
                          <div className="bg-[#1a1a1a] rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Parrainages</p>
                            <p className="text-blue-400 font-medium">{application.total_referrals || 0}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {application.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approuver
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Rejeter
                        </button>
                      </div>
                    )}

                    {application.status === 'approved' && (
                      <div className="ml-4">
                        <button
                          onClick={() => window.open('https://systeme.io/affiliates', '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Systeme.io
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 