'use client';

import { useState } from 'react';
import { Settings, Save, Database, Mail, Shield, Globe, Webhook, Key, Bell, Palette } from 'lucide-react';

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'DropSkills',
    siteUrl: 'https://dropskills.com',
    description: 'Plateforme de vente de produits digitaux et d\'outils IA',
    contactEmail: 'contact@dropskills.com',
    timezone: 'Europe/Paris',
    twoFactorAuth: false,
    rateLimitEnabled: true,
    maxAttempts: 5,
    blockDuration: 15,
    smtpServer: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    useTLS: true,
    apiKey: 'sk_live_••••••••••••••••••••••••••••••••',
    rateLimitPerHour: 1000,
    apiVersion: 'v1'
  });

  const handleSave = () => {
    // Ici on sauvegarderait les paramètres
    console.log('Sauvegarde des paramètres:', settings);
    alert('Paramètres sauvegardés avec succès !');
  };

  const tabs = [
    { id: 'general', icon: Globe, label: 'Général' },
    { id: 'database', icon: Database, label: 'Base de données' },
    { id: 'email', icon: Mail, label: 'Email' },
    { id: 'security', icon: Shield, label: 'Sécurité' },
    { id: 'webhooks', icon: Webhook, label: 'Webhooks' },
    { id: 'api', icon: Key, label: 'API' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'appearance', icon: Palette, label: 'Apparence' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Paramètres Système</h1>
        <button 
          onClick={handleSave}
          className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu de navigation */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323] h-fit">
          <h3 className="text-white font-semibold mb-4">Catégories</h3>
          <nav className="space-y-2">
            {tabs.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-[#232323]'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Paramètres généraux */}
          {activeTab === 'general' && (
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-5 h-5 text-[#00D2FF]" />
                <h3 className="text-xl font-semibold text-white">Paramètres Généraux</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Nom du site</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">URL du site</label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description du site</label>
                  <textarea
                    rows={3}
                    value={settings.description}
                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email de contact</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Fuseau horaire</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
                    >
                      <option>Europe/Paris</option>
                      <option>UTC</option>
                      <option>America/New_York</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paramètres de sécurité */}
          {activeTab === 'security' && (
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-[#00D2FF]" />
                <h3 className="text-xl font-semibold text-white">Sécurité</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Authentification à deux facteurs</p>
                    <p className="text-gray-400 text-sm">Exiger 2FA pour tous les administrateurs</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D2FF]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Limitation de taux</p>
                    <p className="text-gray-400 text-sm">Limiter les tentatives de connexion</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.rateLimitEnabled}
                      onChange={(e) => setSettings({ ...settings, rateLimitEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D2FF]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Tentatives max par IP</label>
                    <input
                      type="number"
                      value={settings.maxAttempts}
                      onChange={(e) => setSettings({ ...settings, maxAttempts: Number(e.target.value) })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Durée de blocage (minutes)</label>
                    <input
                      type="number"
                      value={settings.blockDuration}
                      onChange={(e) => setSettings({ ...settings, blockDuration: Number(e.target.value) })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paramètres email */}
          {activeTab === 'email' && (
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-5 h-5 text-[#00D2FF]" />
                <h3 className="text-xl font-semibold text-white">Configuration Email</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Serveur SMTP</label>
                    <input
                      type="text"
                      value={settings.smtpServer}
                      onChange={(e) => setSettings({ ...settings, smtpServer: e.target.value })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Port</label>
                    <input
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Nom d'utilisateur</label>
                    <input
                      type="email"
                      value={settings.smtpUsername}
                      onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Mot de passe</label>
                    <input
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Utiliser TLS/SSL</p>
                    <p className="text-gray-400 text-sm">Chiffrement des emails</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.useTLS}
                      onChange={(e) => setSettings({ ...settings, useTLS: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D2FF]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Paramètres API */}
          {activeTab === 'api' && (
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              <div className="flex items-center gap-3 mb-6">
                <Key className="w-5 h-5 text-[#00D2FF]" />
                <h3 className="text-xl font-semibold text-white">Configuration API</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Clé API principale</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                      className="flex-1 bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                      readOnly
                    />
                    <button className="bg-[#18181b] text-white px-4 py-2 rounded-lg border border-[#232323] hover:bg-[#232323] transition-colors">
                      Régénérer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Limite de requêtes/heure</label>
                    <input
                      type="number"
                      value={settings.rateLimitPerHour}
                      onChange={(e) => setSettings({ ...settings, rateLimitPerHour: Number(e.target.value) })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Version API</label>
                    <select
                      value={settings.apiVersion}
                      onChange={(e) => setSettings({ ...settings, apiVersion: e.target.value })}
                      className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none"
                    >
                      <option>v1</option>
                      <option>v2 (beta)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 