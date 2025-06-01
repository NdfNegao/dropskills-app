'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, EyeOff, Key, Lock, Users, Activity } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

interface SecurityAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  logFailedAttempts: boolean;
}

export default function AdminSecurityPage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAlerts([
        {
          id: '1',
          type: 'warning',
          title: 'Tentatives de connexion suspectes',
          description: '5 tentatives de connexion échouées depuis la même IP',
          timestamp: '2024-03-15 14:30:00',
          resolved: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Mise à jour de sécurité disponible',
          description: 'Une nouvelle version avec des correctifs de sécurité est disponible',
          timestamp: '2024-03-15 10:15:00',
          resolved: false
        },
        {
          id: '3',
          type: 'error',
          title: 'Accès non autorisé détecté',
          description: 'Tentative d\'accès à une route admin sans autorisation',
          timestamp: '2024-03-14 16:45:00',
          resolved: true
        }
      ]);

      setSettings({
        twoFactorEnabled: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireSpecialChars: true,
        logFailedAttempts: true
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données de sécurité:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof SecuritySettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const statsData = [
    {
      title: "Alertes Actives",
      value: alerts.filter(a => !a.resolved).length,
      icon: <AlertTriangle size={24} />
    },
    {
      title: "Connexions Sécurisées",
      value: "98.5%",
      icon: <Shield size={24} />
    },
    {
      title: "Sessions Actives",
      value: "23",
      icon: <Users size={24} />
    },
    {
      title: "Dernière Analyse",
      value: "2h ago",
      icon: <Activity size={24} />
    }
  ];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Shield size={24} />}
        title="Sécurité"
        subtitle="Monitoring et configuration de la sécurité"
        stats={statsData.map(stat => ({ ...stat, value: '---' }))}
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
      icon={<Shield size={24} />}
      title="Sécurité"
      subtitle="Monitoring et configuration de la sécurité"
      stats={statsData}
    >
      <div className="space-y-6">
        {/* Alertes de sécurité */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alertes de Sécurité</h3>
            <p className="text-sm text-gray-600 mt-1">Événements de sécurité récents</p>
          </div>
          
          <div className="p-6 space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune alerte</h3>
                <p className="mt-1 text-sm text-gray-500">Tout semble sécurisé pour le moment.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertBgColor(alert.type)} ${alert.resolved ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {alert.title}
                          {alert.resolved && <span className="ml-2 text-xs text-green-600">(Résolu)</span>}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(alert.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Marquer comme résolu
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Paramètres de sécurité */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Paramètres de Sécurité</h3>
            <p className="text-sm text-gray-600 mt-1">Configuration des règles de sécurité</p>
          </div>
          
          {settings && (
            <div className="p-6 space-y-6">
              {/* Authentification */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Authentification</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Authentification à deux facteurs</label>
                      <p className="text-sm text-gray-500">Ajouter une couche de sécurité supplémentaire</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('twoFactorEnabled', !settings.twoFactorEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeout de session (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tentatives de connexion max
                      </label>
                      <input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mots de passe */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Politique des Mots de Passe</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longueur minimale
                      </label>
                      <input
                        type="number"
                        value={settings.passwordMinLength}
                        onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Caractères spéciaux requis</label>
                        <p className="text-sm text-gray-500">Exiger des caractères spéciaux dans les mots de passe</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('requireSpecialChars', !settings.requireSpecialChars)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          settings.requireSpecialChars ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.requireSpecialChars ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Journaliser les échecs de connexion</label>
                        <p className="text-sm text-gray-500">Enregistrer les tentatives de connexion échouées</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('logFailedAttempts', !settings.logFailedAttempts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          settings.logFailedAttempts ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.logFailedAttempts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clés API */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Clés API</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Clé API principale</label>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      {showApiKey ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
                  <div className="font-mono text-sm bg-white p-3 rounded border">
                    {showApiKey ? 'sk-1234567890abcdef1234567890abcdef' : '••••••••••••••••••••••••••••••••'}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      Régénérer
                    </button>
                    <button className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                      Copier
                    </button>
                  </div>
                </div>
              </div>

              {/* Bouton de sauvegarde */}
              <div className="pt-4 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sauvegarder les paramètres
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}