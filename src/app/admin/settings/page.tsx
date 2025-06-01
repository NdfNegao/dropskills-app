'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Mail, Globe, Palette, Bell, Database, Shield, Server, Users, Lock } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

interface AppSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  analyticsEnabled: boolean;
  maxFileSize: number;
  sessionTimeout: number;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings({
        siteName: 'DropSkills',
        siteDescription: 'Plateforme de formations et outils IA pour entrepreneurs',
        contactEmail: 'contact@dropskills.com',
        supportEmail: 'support@dropskills.com',
        maintenanceMode: false,
        registrationEnabled: true,
        emailNotifications: true,
        analyticsEnabled: true,
        maxFileSize: 10,
        sessionTimeout: 30,
        theme: 'auto',
        language: 'fr'
      });
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Paramètres sauvegardés avec succès!');
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: <Settings size={20} /> },
    { id: 'email', label: 'Email', icon: <Mail size={20} /> },
    { id: 'appearance', label: 'Apparence', icon: <Palette size={20} /> },
    { id: 'security', label: 'Sécurité', icon: <Shield size={20} /> },
    { id: 'system', label: 'Système', icon: <Database size={20} /> }
  ];

  const statsData = [
    {
      icon: <Server className="w-5 h-5" />,
      label: "Mode",
      value: settings?.maintenanceMode ? "Maintenance" : "Production",
      color: "text-blue-400"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
      value: settings?.emailNotifications ? "Activées" : "Désactivées",
      color: "text-green-400"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Inscriptions",
      value: settings?.registrationEnabled ? "Ouvertes" : "Fermées",
      color: "text-purple-400"
    },
    {
      icon: <Lock className="w-5 h-5" />,
      label: "Session",
      value: `${settings?.sessionTimeout || 30}min`,
      color: "text-yellow-400"
    }
  ];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Settings className="w-6 h-6" />}
        title="Configuration"
        subtitle="Chargement des paramètres..."
        stats={statsData.map(stat => ({ title: stat.label, value: '---', icon: stat.icon }))}
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
      icon={<Settings className="w-6 h-6" />}
      title="Configuration"
      subtitle="Gérer les paramètres de l'application"
      stats={statsData.map(stat => ({ title: stat.label, value: stat.value, icon: stat.icon }))}
      actions={[
        {
          label: "Sauvegarder",
          onClick: handleSave,
          variant: "default" as const,
          icon: <Save className="w-4 h-4" />,
          loading: saving
        },
        {
          label: "Actualiser",
          onClick: fetchSettings,
          variant: "secondary" as const,
          icon: <RefreshCw className="w-4 h-4" />,
          loading: loading
        }
      ]}
    >
        <div className="bg-white rounded-lg border border-gray-200">
        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du site
                </label>
                <input
                  type="text"
                  value={settings?.siteName || ''}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du site
                </label>
                <textarea
                  value={settings?.siteDescription || ''}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={settings?.contactEmail || ''}
                    onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de support
                  </label>
                  <input
                    type="email"
                    value={settings?.supportEmail || ''}
                    onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Mode maintenance</h3>
                    <p className="text-sm text-gray-500">Désactiver temporairement le site</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.maintenanceMode || false}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Inscriptions ouvertes</h3>
                    <p className="text-sm text-gray-500">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.registrationEnabled || false}
                      onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Notifications par email</h3>
                  <p className="text-sm text-gray-500">Envoyer des notifications par email aux utilisateurs</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.emailNotifications || false}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Configuration SMTP</h4>
                <p className="text-sm text-gray-500">Les paramètres SMTP doivent être configurés dans les variables d'environnement.</p>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thème
                </label>
                <select
                  value={settings?.theme || 'auto'}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue
                </label>
                <select
                  value={settings?.language || 'fr'}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout de session (minutes)
                </label>
                <input
                  type="number"
                  value={settings?.sessionTimeout || 30}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  min="5"
                  max="1440"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Sécurité avancée</h4>
                <p className="text-sm text-yellow-700">Les paramètres de sécurité avancés (2FA, politique de mots de passe, etc.) sont configurés dans le panneau de sécurité.</p>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille maximale des fichiers (MB)
                </label>
                <input
                  type="number"
                  value={settings?.maxFileSize || 10}
                  onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Analytics activés</h3>
                  <p className="text-sm text-gray-500">Collecter des données d'utilisation anonymes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.analyticsEnabled || false}
                    onChange={(e) => handleSettingChange('analyticsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Informations système</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>Version: 1.0.0</p>
                  <p>Environnement: Production</p>
                  <p>Base de données: PostgreSQL</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={fetchSettings}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} className={saving ? 'animate-pulse' : ''} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
        </div>
    </AdminLayoutWithSidebar>
  );
}