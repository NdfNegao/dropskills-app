'use client';

import { useState, useEffect } from 'react';
import { Database, Users, FileText, Activity, RefreshCw, Download, Upload } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

interface DatabaseStats {
  totalUsers: number;
  totalProducts: number;
  totalSessions: number;
  databaseSize: string;
  lastBackup: string;
  uptime: string;
}

interface TableInfo {
  name: string;
  rows: number;
  size: string;
  lastUpdated: string;
}

export default function AdminDatabasePage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  const fetchDatabaseInfo = async () => {
    try {
      setRefreshing(true);
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 1234,
        totalProducts: 45,
        totalSessions: 5678,
        databaseSize: '2.3 GB',
        lastBackup: '2024-03-15 14:30:00',
        uptime: '99.9%'
      });

      setTables([
        {
          name: 'users',
          rows: 1234,
          size: '1.2 MB',
          lastUpdated: '2024-03-15 10:30:00'
        },
        {
          name: 'products',
          rows: 45,
          size: '256 KB',
          lastUpdated: '2024-03-15 09:15:00'
        },
        {
          name: 'sessions',
          rows: 5678,
          size: '3.4 MB',
          lastUpdated: '2024-03-15 14:45:00'
        },
        {
          name: 'analytics',
          rows: 12456,
          size: '8.7 MB',
          lastUpdated: '2024-03-15 14:50:00'
        },
        {
          name: 'feedback',
          rows: 234,
          size: '512 KB',
          lastUpdated: '2024-03-14 16:20:00'
        }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des informations de la base de données:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleBackup = async () => {
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Sauvegarde créée avec succès!');
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleExport = async (tableName: string) => {
    try {
      // Simuler un export
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Export de la table ${tableName} terminé!`);
    } catch (error) {
      alert('Erreur lors de l\'export');
    }
  };

  const statsData = stats ? [
    {
      title: "Utilisateurs",
      value: stats.totalUsers.toLocaleString(),
      icon: <Users size={24} />
    },
    {
      title: "Produits",
      value: stats.totalProducts,
      icon: <FileText size={24} />
    },
    {
      title: "Sessions",
      value: stats.totalSessions.toLocaleString(),
      icon: <Activity size={24} />
    },
    {
      title: "Taille DB",
      value: stats.databaseSize,
      icon: <Database size={24} />
    }
  ] : [];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Database size={24} />}
        title="Base de Données"
        subtitle="Gestion et monitoring de la base de données"
        stats={[...Array(4)].map((_, i) => ({
          title: "Chargement...",
          value: "---",
          icon: <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
        }))}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<Database size={24} />}
      title="Base de Données"
      subtitle="Gestion et monitoring de la base de données"
      stats={statsData}
      actions={
        <div className="flex gap-2">
          <button 
            onClick={fetchDatabaseInfo}
            disabled={refreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <button 
            onClick={handleBackup}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download size={20} />
            Sauvegarder
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Informations générales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Dernière sauvegarde</div>
              <div className="text-lg font-semibold text-gray-900">
                {stats ? new Date(stats.lastBackup).toLocaleString('fr-FR') : '---'}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Disponibilité</div>
              <div className="text-lg font-semibold text-green-600">
                {stats?.uptime || '---'}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Taille totale</div>
              <div className="text-lg font-semibold text-gray-900">
                {stats?.databaseSize || '---'}
              </div>
            </div>
          </div>
        </div>

        {/* Tables de la base de données */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Tables de la Base de Données</h3>
            <p className="text-sm text-gray-600 mt-1">Vue d'ensemble des tables principales</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lignes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière MAJ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tables.map((table) => (
                  <tr key={table.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{table.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {table.rows.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {table.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(table.lastUpdated).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleExport(table.name)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        <Upload size={14} />
                        Exporter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Database className="h-8 w-8 text-blue-600 mb-2" />
              <div className="font-medium text-gray-900">Optimiser DB</div>
              <div className="text-sm text-gray-600">Optimiser les performances</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <RefreshCw className="h-8 w-8 text-green-600 mb-2" />
              <div className="font-medium text-gray-900">Nettoyer Cache</div>
              <div className="text-sm text-gray-600">Vider le cache système</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Download className="h-8 w-8 text-purple-600 mb-2" />
              <div className="font-medium text-gray-900">Export Complet</div>
              <div className="text-sm text-gray-600">Exporter toute la DB</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Activity className="h-8 w-8 text-orange-600 mb-2" />
              <div className="font-medium text-gray-900">Logs Système</div>
              <div className="text-sm text-gray-600">Consulter les logs</div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}