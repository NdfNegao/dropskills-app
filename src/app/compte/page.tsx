'use client';

import React, { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Lock, Shield, Bell, CreditCard, Download, Trash2, Save, Eye, EyeOff } from 'lucide-react';

export default function ComptePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as any;

  const tabs = [
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Sécurité', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'billing', label: 'Facturation', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'data', label: 'Mes Données', icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <LayoutWithSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
          <h1 className="text-3xl font-bold text-white mb-2">
            Mon Compte
          </h1>
          <p className="text-gray-400">
            Gérez vos informations personnelles et préférences
          </p>
        </div>

        {/* Message de feedback */}
        {message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400 text-sm">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation des onglets */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] rounded-xl p-4 border border-[#232323]">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#ff0033] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="lg:col-span-3">
            <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
              {activeTab === 'profile' && <ProfileTab user={user} setMessage={setMessage} />}
              {activeTab === 'security' && <SecurityTab setMessage={setMessage} />}
              {activeTab === 'notifications' && <NotificationsTab setMessage={setMessage} />}
              {activeTab === 'billing' && <BillingTab user={user} />}
              {activeTab === 'data' && <DataTab user={user} />}
            </div>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

function ProfileTab({ user, setMessage }: { user: any; setMessage: (msg: string) => void }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la mise à jour du profil
    setMessage('Profil mis à jour avec succès !');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Informations du Profil</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
          />
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <h3 className="font-medium text-white mb-2">Statut du Compte</h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              user?.role === 'PREMIUM' ? 'bg-yellow-500/10 text-yellow-400' :
              user?.role === 'SUPER_ADMIN' ? 'bg-red-500/10 text-red-400' :
              'bg-gray-500/10 text-gray-400'
            }`}>
              {user?.role === 'PREMIUM' ? '👑 Premium' : 
               user?.role === 'SUPER_ADMIN' ? '🔧 Admin' : 
               '👤 Standard'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Sauvegarder les modifications
        </button>
      </form>
    </div>
  );
}

function SecurityTab({ setMessage }: { setMessage: (msg: string) => void }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    // TODO: Implémenter le changement de mot de passe
    setMessage('Mot de passe modifié avec succès !');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Sécurité</h2>
      
      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mot de passe actuel
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
              placeholder="Votre mot de passe actuel"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
              placeholder="Nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
            placeholder="Confirmer le nouveau mot de passe"
          />
        </div>

        <button
          type="submit"
          className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Modifier le mot de passe
        </button>
      </form>
    </div>
  );
}

function NotificationsTab({ setMessage }: { setMessage: (msg: string) => void }) {
  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    newFeatures: true,
    securityAlerts: true,
    weeklyDigest: false
  });

  const handleSave = () => {
    // TODO: Sauvegarder les préférences
    setMessage('Préférences de notification sauvegardées !');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
      
      <div className="space-y-4">
        {Object.entries({
          emailMarketing: 'Emails marketing et promotions',
          newFeatures: 'Nouvelles fonctionnalités',
          securityAlerts: 'Alertes de sécurité',
          weeklyDigest: 'Résumé hebdomadaire'
        }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
            <span className="text-white">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[key as keyof typeof notifications]}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff0033]"></div>
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Sauvegarder les préférences
      </button>
    </div>
  );
}

function BillingTab({ user }: { user: any }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Facturation</h2>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="font-medium text-white mb-4">Plan Actuel</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">
                {user?.role === 'PREMIUM' ? 'Plan Premium' : 'Plan Gratuit'}
              </p>
              <p className="text-gray-400 text-sm">
                {user?.role === 'PREMIUM' ? 'Accès à tous les outils IA' : 'Accès limité aux outils'}
              </p>
            </div>
            {user?.role !== 'PREMIUM' && (
              <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Upgrader
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="font-medium text-white mb-4">Historique des Factures</h3>
          <p className="text-gray-400">Aucune facture disponible pour le moment.</p>
        </div>
      </div>
    </div>
  );
}

function DataTab({ user }: { user: any }) {
  const handleExportData = () => {
    // TODO: Implémenter l'export des données
    console.log('Export des données utilisateur');
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      // TODO: Implémenter la suppression du compte
      console.log('Suppression du compte');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Mes Données</h2>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="font-medium text-white mb-4">Exporter mes données</h3>
          <p className="text-gray-400 mb-4">
            Téléchargez une copie de toutes vos données personnelles.
          </p>
          <button
            onClick={handleExportData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter mes données
          </button>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h3 className="font-medium text-red-400 mb-4">Zone de Danger</h3>
          <p className="text-gray-400 mb-4">
            La suppression de votre compte est permanente et ne peut pas être annulée.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
} 