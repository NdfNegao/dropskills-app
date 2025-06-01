'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Mail, Globe, Palette, Bell, Database, Shield } from 'lucide-react';
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
      title: "Paramètres",
      value: "12",
      icon: <Settings size={24} />
    },
    {
      title: "Dernière MAJ",
      value: "2h ago",
      icon: <RefreshCw size={24} />
    },
    {
      title: "Mode",
      value: settings?.maintenanceMode ? "Maintenance" : "Production",
      icon: <Globe size={24} />
    },
    {
      title: "Notifications",
      value: settings?.emailNotifications ? "Activées" : "Désactivées",
      icon: <Bell size={24} />
    }
  ];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Settings size={24} />}
        title="Configuration"
        subtitle="Paramètres généraux de l'application"
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
      icon={<Settings size={24} />}
      title="Configuration"
      subtitle="Paramètres généraux de l'application"
      stats={statsData}
      actions={
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20} className={saving ? 'animate-pulse' : ''} />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      }
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
          {settings && (
            <>
              {/* Onglet Général */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du site
                        </label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) => handleSettingChange('siteName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Langue
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleSettingChange('language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description du site
                      </label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Fonctionnalités</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Mode maintenance</label>
                          <p className="text-sm text-gray-500">Désactiver temporairement l'accès au site</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Inscription ouverte</label>
                          <p className="text-sm text-gray-500">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange('registrationEnabled', !settings.registrationEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.registrationEnabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Analytics</label>
                          <p className="text-sm text-gray-500">Collecter des données d'utilisation anonymes</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange('analyticsEnabled', !settings.analyticsEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.analyticsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Email */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Email</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email de support
                        </label>
                        <input
                          type="email"
                          value={settings.supportEmail}
                          onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Notifications par email</label>
                        <p className="text-sm text-gray-500">Envoyer des notifications par email aux administrateurs</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Apparence */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thème</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSettingChange('theme', theme)}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            settings.theme === theme
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-900 capitalize">{theme}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {theme === 'light' && 'Thème clair'}
                            {theme === 'dark' && 'Thème sombre'}
                            {theme === 'auto' && 'Automatique'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Sécurité */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sessions</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeout de session (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                        className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Durée avant déconnexion automatique des utilisateurs inactifs
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Système */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Limites système</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taille maximale des fichiers (MB)
                      </label>
                      <input
                        type="number"
                        value={settings.maxFileSize}
                        onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                        className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Taille maximale autorisée pour les uploads de fichiers
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Actions système</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <RefreshCw className="h-6 w-6 text-blue-600 mb-2" />
                        <div className="font-medium text-gray-900">Vider le cache</div>
                        <div className="text-sm text-gray-600">Nettoyer le cache de l'application</div>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <Database className="h-6 w-6 text-green-600 mb-2" />
                        <div className="font-medium text-gray-900">Optimiser la DB</div>
                        <div className="text-sm text-gray-600">Optimiser les performances de la base de données</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}