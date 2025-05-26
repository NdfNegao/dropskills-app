import { Metadata } from 'next';
import { Settings, Save, Database, Mail, Shield, Globe, Webhook, Key, Bell, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Paramètres | Admin DropSkills',
  description: 'Configuration système et paramètres généraux',
};

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Paramètres Système</h1>
        <button className="bg-[#00D2FF] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00B8E6] transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" />
          Sauvegarder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu de navigation */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323] h-fit">
          <h3 className="text-white font-semibold mb-4">Catégories</h3>
          <nav className="space-y-2">
            {[
              { icon: Globe, label: 'Général', active: true },
              { icon: Database, label: 'Base de données' },
              { icon: Mail, label: 'Email' },
              { icon: Shield, label: 'Sécurité' },
              { icon: Webhook, label: 'Webhooks' },
              { icon: Key, label: 'API' },
              { icon: Bell, label: 'Notifications' },
              { icon: Palette, label: 'Apparence' }
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  item.active 
                    ? 'bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-[#232323]'
                }`}
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
                    defaultValue="DropSkills"
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">URL du site</label>
                  <input
                    type="url"
                    defaultValue="https://dropskills.com"
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Description du site</label>
                <textarea
                  rows={3}
                  defaultValue="Plateforme de vente de produits digitaux et d'outils IA"
                  className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email de contact</label>
                  <input
                    type="email"
                    defaultValue="contact@dropskills.com"
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Fuseau horaire</label>
                  <select className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
                    <option>Europe/Paris</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres de sécurité */}
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
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D2FF]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Limitation de taux</p>
                  <p className="text-gray-400 text-sm">Limiter les tentatives de connexion</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D2FF]"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Tentatives max par IP</label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Durée de blocage (minutes)</label>
                  <input
                    type="number"
                    defaultValue="15"
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres email */}
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
                    placeholder="smtp.gmail.com"
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Port</label>
                  <input
                    type="number"
                    defaultValue="587"
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Nom d'utilisateur</label>
                  <input
                    type="email"
                    placeholder="noreply@dropskills.com"
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
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
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D2FF]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Paramètres API */}
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
                    defaultValue="sk_live_••••••••••••••••••••••••••••••••"
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
                    defaultValue="1000"
                    className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Version API</label>
                  <select className="w-full bg-[#18181b] text-white rounded-lg px-4 py-2 border border-[#232323] focus:outline-none">
                    <option>v1</option>
                    <option>v2 (beta)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 