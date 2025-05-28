'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Crown, 
  Settings, 
  CreditCard,
  Download,
  Shield,
  Bell,
  Activity,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit,
  Check,
  X,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function ComptePage() {
  const { user, canAccessPremium } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
    bio: 'Entrepreneur passionné par le digital et l\'innovation.',
    website: 'https://johndoe.com',
    company: 'Dropskills Entrepreneur'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginNotifications: true
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
    { id: 'subscription', label: 'Abonnement', icon: <Crown className="w-4 h-4" /> },
    { id: 'security', label: 'Sécurité', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'activity', label: 'Activité', icon: <Activity className="w-4 h-4" /> },
    { id: 'billing', label: 'Facturation', icon: <CreditCard className="w-4 h-4" /> }
  ];

  const handleSaveProfile = () => {
    // Simulation de sauvegarde
    setIsEditing(false);
    alert('Profil mis à jour avec succès !');
  };

  const handlePasswordChange = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    // Simulation de changement de mot de passe
    alert('Mot de passe modifié avec succès !');
    setSecurityData({
      ...securityData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const stats = {
    accountAge: '8 mois',
    totalGenerations: 1247,
    favoriteTools: 5,
    storageUsed: '156 MB'
  };

  const recentActivity = [
    { action: 'Génération d\'offre', tool: 'Générateur d\'Offre IA', date: '2024-01-15 14:30' },
    { action: 'Téléchargement', tool: 'Plan de contenu', date: '2024-01-15 10:15' },
    { action: 'Connexion', tool: 'Application web', date: '2024-01-15 09:00' },
    { action: 'Génération de titres', tool: 'Générateur de Titres IA', date: '2024-01-14 16:45' },
    { action: 'Mise à jour profil', tool: 'Paramètres compte', date: '2024-01-14 11:20' }
  ];

  const invoices = [
    { id: 'INV-2024-001', date: '2024-01-01', amount: '397€', status: 'Payée', plan: 'Premium Annuel' },
    { id: 'INV-2023-012', date: '2023-12-01', amount: '47€', status: 'Payée', plan: 'Premium Mensuel' },
    { id: 'INV-2023-011', date: '2023-11-01', amount: '47€', status: 'Payée', plan: 'Premium Mensuel' }
  ];

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mon Compte</h1>
              <p className="text-gray-400">Gérez vos informations et préférences</p>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Membre depuis</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.accountAge}</div>
              <div className="text-xs text-gray-400">compte actif</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Générations</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalGenerations.toLocaleString()}</div>
              <div className="text-xs text-gray-400">créations IA</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Favoris</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.favoriteTools}</div>
              <div className="text-xs text-gray-400">outils préférés</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Stockage</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.storageUsed}</div>
              <div className="text-xs text-gray-400">sur 1 GB</div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-[#ff0033] bg-[#ff0033]/5'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-8">
          {activeTab === 'profile' && (
            <ProfileTab 
              profileData={profileData}
              setProfileData={setProfileData}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSave={handleSaveProfile}
            />
          )}

          {activeTab === 'subscription' && (
            <SubscriptionTab canAccessPremium={canAccessPremium} />
          )}

          {activeTab === 'security' && (
            <SecurityTab 
              securityData={securityData}
              setSecurityData={setSecurityData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onPasswordChange={handlePasswordChange}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab />
          )}

          {activeTab === 'activity' && (
            <ActivityTab recentActivity={recentActivity} />
          )}

          {activeTab === 'billing' && (
            <BillingTab invoices={invoices} />
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

// Composants pour chaque onglet
function ProfileTab({ profileData, setProfileData, isEditing, setIsEditing, onSave }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Informations du profil</h2>
        <button
          onClick={() => isEditing ? onSave() : setIsEditing(true)}
          className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#cc0029] transition-colors flex items-center gap-2"
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          {isEditing ? 'Sauvegarder' : 'Modifier'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
            disabled={!isEditing}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
            disabled={!isEditing}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            disabled={!isEditing}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            disabled={!isEditing}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] disabled:opacity-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Adresse</label>
          <input
            type="text"
            value={profileData.address}
            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
            disabled={!isEditing}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] disabled:opacity-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            disabled={!isEditing}
            rows={3}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}

function SubscriptionTab({ canAccessPremium }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Abonnement</h2>
      
      {canAccessPremium ? (
        <div className="bg-gradient-to-r from-[#ff0033]/10 to-[#cc0029]/10 border border-[#ff0033]/30 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-[#ff0033]" />
            <div>
              <h3 className="text-xl font-semibold text-white">Premium Actif</h3>
              <p className="text-gray-300">Accès complet à tous les outils IA</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <div className="text-sm text-gray-400">Plan actuel</div>
              <div className="text-white font-semibold">Premium Annuel</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <div className="text-sm text-gray-400">Prochaine facturation</div>
              <div className="text-white font-semibold">15 janvier 2025</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <div className="text-sm text-gray-400">Montant</div>
              <div className="text-white font-semibold">397€/an</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#cc0029] transition-colors">
              Gérer l'abonnement
            </button>
            <button className="bg-[#1a1a1a] text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-[#333] transition-colors">
              Télécharger la facture
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Plan Gratuit</h3>
          <p className="text-gray-400 mb-4">Passez au premium pour débloquer tous les outils IA</p>
          <button className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors">
            Passer au Premium
          </button>
        </div>
      )}
    </div>
  );
}

function SecurityTab({ securityData, setSecurityData, showPassword, setShowPassword, onPasswordChange }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Sécurité</h2>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Changer le mot de passe</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe actuel</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                  className="w-full bg-[#111111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nouveau mot de passe</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                className="w-full bg-[#111111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer le nouveau mot de passe</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                className="w-full bg-[#111111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              />
            </div>
            
            <button
              onClick={onPasswordChange}
              className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#cc0029] transition-colors"
            >
              Mettre à jour le mot de passe
            </button>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Authentification à deux facteurs</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Sécurisez votre compte avec l'authentification à deux facteurs</p>
              <p className="text-sm text-gray-400">Statut: {securityData.twoFactorEnabled ? 'Activée' : 'Désactivée'}</p>
            </div>
            <button className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#cc0029] transition-colors">
              {securityData.twoFactorEnabled ? 'Désactiver' : 'Activer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    emailSecurity: true,
    emailUpdates: false,
    pushGeneration: true,
    pushSecurity: true,
    weeklyReport: true
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notifications par email</h3>
          <div className="space-y-4">
            {[
              { key: 'emailSecurity', label: 'Alertes de sécurité', description: 'Connexions suspectes, changements de mot de passe' },
              { key: 'emailUpdates', label: 'Mises à jour produit', description: 'Nouveaux outils, fonctionnalités et améliorations' },
              { key: 'emailMarketing', label: 'Conseils et astuces', description: 'Conseils pour optimiser votre utilisation des outils' },
              { key: 'weeklyReport', label: 'Rapport hebdomadaire', description: 'Résumé de votre activité et statistiques' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-sm text-gray-400">{item.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff0033]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ recentActivity }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Activité récente</h2>
      
      <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#333]">
          <h3 className="text-lg font-semibold text-white">Dernières actions</h3>
        </div>
        
        <div className="divide-y divide-[#333]">
          {recentActivity.map((activity: any, index: number) => (
            <div key={index} className="p-4 hover:bg-[#222] transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-400">{activity.tool}</div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(activity.date).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BillingTab({ invoices }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Facturation</h2>
      
      <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#333]">
          <h3 className="text-lg font-semibold text-white">Historique des factures</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111111]">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Facture</th>
                <th className="text-left p-4 text-gray-300 font-medium">Date</th>
                <th className="text-left p-4 text-gray-300 font-medium">Plan</th>
                <th className="text-left p-4 text-gray-300 font-medium">Montant</th>
                <th className="text-left p-4 text-gray-300 font-medium">Statut</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {invoices.map((invoice: any) => (
                <tr key={invoice.id} className="hover:bg-[#222] transition-colors">
                  <td className="p-4 text-white font-medium">{invoice.id}</td>
                  <td className="p-4 text-gray-300">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-300">{invoice.plan}</td>
                  <td className="p-4 text-white font-semibold">{invoice.amount}</td>
                  <td className="p-4">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-[#ff0033] hover:text-[#cc0029] transition-colors flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 