'use client';
import { useState, useEffect } from 'react';
import { UserCheck, UserPlus, DollarSign, Edit, Trash2, Eye, Mail, ExternalLink } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import DataTable from '@/components/admin/DataTable';

interface Affiliate {
  id: number;
  name: string;
  email: string;
  affiliate_code: string;
  sales_count: number;
  commission_earned: number;
  commission_pending: number;
  status: 'active' | 'inactive' | 'pending';
  joined_date: string;
  last_sale: string;
}

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalCommissions: 0,
    pendingCommissions: 0
  });

  useEffect(() => {
    loadAffiliates();
  }, []);

  const loadAffiliates = async () => {
    setLoading(true);
    try {
      // Simuler un appel API
      setTimeout(() => {
        const mockAffiliates: Affiliate[] = [
          {
            id: 1,
            name: "Marie Dubois",
            email: "marie.dubois@email.com",
            affiliate_code: "MARIE2024",
            sales_count: 15,
            commission_earned: 750.00,
            commission_pending: 125.00,
            status: "active",
            joined_date: "2024-01-15",
            last_sale: "2024-01-20"
          },
          {
            id: 2,
            name: "Pierre Martin",
            email: "pierre.martin@email.com",
            affiliate_code: "PIERRE2024",
            sales_count: 8,
            commission_earned: 400.00,
            commission_pending: 75.00,
            status: "active",
            joined_date: "2024-01-10",
            last_sale: "2024-01-18"
          },
          {
            id: 3,
            name: "Sophie Laurent",
            email: "sophie.laurent@email.com",
            affiliate_code: "SOPHIE2024",
            sales_count: 3,
            commission_earned: 150.00,
            commission_pending: 50.00,
            status: "pending",
            joined_date: "2024-01-18",
            last_sale: "2024-01-19"
          }
        ];
        
        setAffiliates(mockAffiliates);
        setStats({
          total: mockAffiliates.length,
          active: mockAffiliates.filter(a => a.status === 'active').length,
          totalCommissions: mockAffiliates.reduce((sum, a) => sum + a.commission_earned, 0),
          pendingCommissions: mockAffiliates.reduce((sum, a) => sum + a.commission_pending, 0)
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement des affiliés:', error);
      setLoading(false);
    }
  };

  const handleEdit = (affiliate: Affiliate) => {
    console.log('Modifier affilié:', affiliate.id);
  };

  const handleDelete = (affiliateId: number) => {
    console.log('Supprimer affilié:', affiliateId);
  };

  const handleView = (affiliate: Affiliate) => {
    console.log('Voir affilié:', affiliate.id);
  };

  const handleContact = (affiliate: Affiliate) => {
    window.open(`mailto:${affiliate.email}`, '_blank');
  };

  const handleCreateAffiliate = () => {
    console.log('Créer nouvel affilié');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-300 border border-green-700';
      case 'inactive': return 'bg-red-900 text-red-300 border border-red-700';
      case 'pending': return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
      default: return 'bg-gray-900 text-gray-300 border border-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Affilié',
      sortable: true,
      render: (affiliate: Affiliate) => (
        <div>
          <div className="font-medium text-white">{affiliate.name}</div>
          <div className="text-sm text-gray-400">{affiliate.email}</div>
        </div>
      )
    },
    {
      key: 'affiliate_code',
      label: 'Code affilié',
      sortable: true,
      render: (affiliate: Affiliate) => (
        <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm font-mono">
          {affiliate.affiliate_code}
        </span>
      )
    },
    {
      key: 'sales_count',
      label: 'Ventes',
      sortable: true,
      render: (affiliate: Affiliate) => (
        <span className="font-mono">{affiliate.sales_count}</span>
      )
    },
    {
      key: 'commission_earned',
      label: 'Commission gagnée',
      sortable: true,
      render: (affiliate: Affiliate) => (
        <span className="font-mono text-green-400">
          €{affiliate.commission_earned.toFixed(2)}
        </span>
      )
    },
    {
      key: 'commission_pending',
      label: 'En attente',
      sortable: true,
      render: (affiliate: Affiliate) => (
        <span className="font-mono text-yellow-400">
          €{affiliate.commission_pending.toFixed(2)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (affiliate: Affiliate) => (
        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(affiliate.status)}`}>
          {getStatusText(affiliate.status)}
        </span>
      )
    }
  ];

  const actions = [
    {
      label: 'Voir',
      icon: <Eye className="w-4 h-4" />,
      onClick: (affiliate: Affiliate) => handleView(affiliate),
      className: 'text-blue-400 hover:text-blue-300'
    },
    {
      label: 'Contacter',
      icon: <Mail className="w-4 h-4" />,
      onClick: (affiliate: Affiliate) => handleContact(affiliate),
      className: 'text-purple-400 hover:text-purple-300'
    },
    {
      label: 'Modifier',
      icon: <Edit className="w-4 h-4" />,
      onClick: (affiliate: Affiliate) => handleEdit(affiliate),
      className: 'text-green-400 hover:text-green-300'
    },
    {
      label: 'Supprimer',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (affiliate: Affiliate) => handleDelete(affiliate.id),
      className: 'text-red-400 hover:text-red-300'
    }
  ];

  const pageStats = [
    {
      title: 'Total affiliés',
      value: stats.total.toString(),
      change: '+5',
      changeType: 'positive' as const,
      icon: UserCheck
    },
    {
      title: 'Affiliés actifs',
      value: stats.active.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: UserPlus
    },
    {
      title: 'Commissions payées',
      value: `€${stats.totalCommissions.toFixed(0)}`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      title: 'En attente',
      value: `€${stats.pendingCommissions.toFixed(0)}`,
      change: '+€50',
      changeType: 'positive' as const,
      icon: DollarSign
    }
  ];

  const pageActions = [
    {
      label: 'Nouvel affilié',
      icon: <UserPlus className="w-4 h-4" />,
      onClick: handleCreateAffiliate,
      variant: 'primary' as const
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={UserCheck}
      title="Gestion des affiliés"
      subtitle="Gérez votre programme d'affiliation"
      stats={pageStats}
      actions={pageActions}
    >
      <DataTable
        data={affiliates}
        columns={columns}
        actions={actions}
        loading={loading}
        searchPlaceholder="Rechercher un affilié..."
        emptyMessage="Aucun affilié trouvé"
      />
    </AdminLayoutWithSidebar>
  );

}