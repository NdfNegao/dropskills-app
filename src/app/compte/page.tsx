'use client';

import React, { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Lock, Shield, Bell, CreditCard, Download, Trash2, Save, Eye, EyeOff, AlertTriangle, ExternalLink, Palette } from 'lucide-react';
import PageBentoLayout from '@/components/PageBentoLayout';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ComptePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
    { id: 'preferences', label: 'Préférences', icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <LayoutWithSidebar>
      <PageBentoLayout
        icon={<User className="w-6 h-6 text-white" />} 
        title="Compte"
        subtitle="Gérez vos informations personnelles et préférences"
      >
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
              {activeTab === 'profile' && <ProfileTab user={user} showMessage={showMessage} update={update} />}
              {activeTab === 'security' && <SecurityTab user={user} showMessage={showMessage} />}
              {activeTab === 'notifications' && <NotificationsTab user={user} showMessage={showMessage} />}
              {activeTab === 'billing' && <BillingTab user={user} />}
              {activeTab === 'data' && <DataTab user={user} showMessage={showMessage} />}
              {activeTab === 'preferences' && <PreferencesTab />}
            </div>
          </div>
        </div>
      </PageBentoLayout>
    </LayoutWithSidebar>
  );
}

function ProfileTab({ user, showMessage, update }: { 
  user: any; 
  showMessage: (msg: string, type?: 'success' | 'error') => void;
  update: any;
}) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      const updatedUser = await response.json();
      
      // Mettre à jour la session
      await update({
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });

      showMessage('Profil mis à jour avec succès !', 'success');
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setIsLoading(false);
    }
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
              required
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
              required
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
            disabled
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
            title="L'email ne peut pas être modifié"
          />
          <p className="text-xs text-gray-500 mt-1">L'adresse email ne peut pas être modifiée</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-4">
          <h3 className="font-medium text-white mb-2">Statut du Compte</h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              user?.email === 'cyril.iriebi@gmail.com' ? 'bg-red-500/10 text-red-400' :
              'bg-gray-500/10 text-gray-400'
            }`}>
              {user?.email === 'cyril.iriebi@gmail.com' ? '🔧 Admin' : '👤 Standard'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#ff0033] hover:bg-[#cc0029] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </button>
      </form>
    </div>
  );
}

function SecurityTab({ user, showMessage }: { 
  user: any; 
  showMessage: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur utilise Google Auth
  const isGoogleAuth = user?.accounts?.some((account: any) => account.provider === 'google') || 
                      user?.provider === 'google' ||
                      !user?.hasPassword;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('Les nouveaux mots de passe ne correspondent pas', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showMessage('Le mot de passe doit contenir au moins 8 caractères', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors du changement de mot de passe');
      }

      showMessage('Mot de passe modifié avec succès !', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      showMessage(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showMessage('Le mot de passe doit contenir au moins 8 caractères', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du mot de passe');
      }

      showMessage('Mot de passe créé avec succès !', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      showMessage(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Sécurité</h2>
      
      <form onSubmit={isGoogleAuth ? handleSetPassword : handlePasswordChange} className="space-y-6">
        {!isGoogleAuth && (
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
                required
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
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {isGoogleAuth ? 'Nouveau mot de passe' : 'Nouveau mot de passe'}
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0033] transition-colors"
              placeholder="Minimum 8 caractères"
              required
              minLength={8}
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
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#ff0033] hover:bg-[#cc0029] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          {isLoading ? 'Traitement...' : (isGoogleAuth ? 'Créer un mot de passe' : 'Modifier le mot de passe')}
        </button>
      </form>
    </div>
  );
}

function NotificationsTab({ user, showMessage }: { 
  user: any; 
  showMessage: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    newFeatures: true,
    securityAlerts: true,
    weeklyDigest: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Charger les préférences existantes
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/user/notifications');
        if (response.ok) {
          const prefs = await response.json();
          setNotifications(prefs);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
      } finally {
        setHasLoaded(true);
      }
    };

    loadPreferences();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notifications),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      showMessage('Préférences de notification sauvegardées !', 'success');
    } catch (error) {
      showMessage('Erreur lors de la sauvegarde des préférences', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ff0033]"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
      
      <div className="space-y-4">
        {Object.entries({
          emailMarketing: 'Emails marketing et promotions',
          newFeatures: 'Nouvelles fonctionnalités',
          securityAlerts: 'Alertes de sécurité (recommandé)',
          weeklyDigest: 'Résumé hebdomadaire d\'activité'
        }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
            <div>
              <span className="text-white">{label}</span>
              {key === 'securityAlerts' && (
                <p className="text-xs text-gray-400 mt-1">
                  Notifications importantes pour la sécurité de votre compte
                </p>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[key as keyof typeof notifications]}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                className="sr-only peer"
                disabled={key === 'securityAlerts'} // Les alertes de sécurité sont obligatoires
              />
              <div className={`w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff0033] ${
                key === 'securityAlerts' ? 'opacity-75 cursor-not-allowed' : ''
              }`}></div>
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="mt-6 bg-[#ff0033] hover:bg-[#cc0029] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
      </button>
    </div>
  );
}

function BillingTab({ user }: { user: any }) {
  const handleUpgrade = () => {
    window.open('/premium', '_blank');
  };

  const handleManageBilling = () => {
    // Rediriger vers le portail de facturation (Stripe/Systeme.io)
    window.open('https://systeme.io/billing', '_blank');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Facturation</h2>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="font-medium text-white mb-4">Plan Actuel</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">
                {(user?.role === 'PREMIUM' || user?.role === 'ADMIN') ? 'Plan Premium' : 'Plan Gratuit'}
              </p>
              <p className="text-gray-400 text-sm">
                {(user?.role === 'PREMIUM' || user?.role === 'ADMIN')
                  ? 'Accès illimité à tous les outils IA premium' 
                  : 'Accès limité aux outils gratuits uniquement'
                }
              </p>
              {(user?.role === 'PREMIUM' || user?.role === 'ADMIN') && (
                <p className="text-green-400 text-xs mt-1">
                  ✓ {user?.role === 'ADMIN' ? 'Accès administrateur' : 'Facturation gérée via Systeme.io'}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {(user?.role !== 'PREMIUM' && user?.role !== 'ADMIN') ? (
                <button 
                  onClick={handleUpgrade}
                  className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Upgrader
                </button>
              ) : (
                <button 
                  onClick={handleManageBilling}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Gérer l'abonnement
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="font-medium text-white mb-4">Avantages Premium</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">ICP Maker IA</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">USP Maker IA</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">Générateur d'Offre IA</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">Tunnel Maker IA</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">CopyMoneyMail IA</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">Lead Magnet Creator</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">Content System 90J</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">Agent Veille IA</span>
              </div>
            </div>
          </div>
        </div>

        {(user?.role === 'PREMIUM' || user?.role === 'ADMIN') && (
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="font-medium text-white mb-4">Support Premium</h3>
            <p className="text-gray-400 mb-4">
              En tant qu'utilisateur Premium, vous bénéficiez d'un support prioritaire.
            </p>
            <button 
              onClick={() => window.open('mailto:contact@dropskills.fr?subject=Support Premium', '_blank')}
              className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Contacter le Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DataTab({ user, showMessage }: { 
  user: any; 
  showMessage: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);

    try {
      const response = await fetch('/api/user/export');
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'export des données');
      }

      const userData = await response.json();

      // Créer et télécharger le fichier JSON
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dropskills-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showMessage('Données exportées avec succès !', 'success');
    } catch (error) {
      showMessage('Erreur lors de l\'export des données', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = 'SUPPRIMER';
    const userInput = prompt(
      `⚠️ ATTENTION: Cette action est irréversible !\n\n` +
      `Toutes vos données seront définitivement supprimées :\n` +
      `• Profil utilisateur\n` +
      `• Historique d'utilisation des outils\n` +
      `• Préférences et paramètres\n` +
      `• Données sauvegardées\n\n` +
      `Tapez "${confirmText}" pour confirmer la suppression :`
    );

    if (userInput !== confirmText) {
      if (userInput !== null) {
        showMessage('Suppression annulée - texte de confirmation incorrect', 'error');
      }
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du compte');
      }

      // Déconnecter l'utilisateur et rediriger
      showMessage('Compte supprimé avec succès. Redirection...', 'success');
      
      setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, 2000);

    } catch (error) {
      showMessage('Erreur lors de la suppression du compte', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Mes Données</h2>
      
      <div className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="font-medium text-white mb-4">Exporter mes données</h3>
          <p className="text-gray-400 mb-4">
            Téléchargez une copie complète de toutes vos données personnelles au format JSON. 
            Cela inclut votre profil, vos préférences, et l'historique d'utilisation des outils.
          </p>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Export en cours...' : 'Exporter mes données'}
          </button>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-400 mb-2">Zone de Danger</h3>
              <p className="text-gray-400 mb-4">
                La suppression de votre compte est permanente et ne peut pas être annulée. 
                Toutes vos données seront définitivement supprimées de nos serveurs.
              </p>
            </div>
          </div>
          
          <div className="bg-red-500/5 rounded-lg p-4 mb-4">
            <h4 className="text-red-300 font-medium mb-2">Données qui seront supprimées :</h4>
            <ul className="text-red-200 text-sm space-y-1">
              <li>• Profil utilisateur et informations personnelles</li>
              <li>• Historique d'utilisation des outils IA</li>
              <li>• Préférences et paramètres personnalisés</li>
              <li>• Données sauvegardées et projets</li>
              <li>• Abonnement Premium (si applicable)</li>
            </ul>
          </div>

          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Suppression...' : 'Supprimer mon compte'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreferencesTab() {
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Europe/Paris'
  });

  const handleSave = async () => {
    // TODO: Implémenter la sauvegarde des préférences
    console.log('Sauvegarde des préférences:', preferences);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Préférences</h2>
      
      {/* Thème */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Apparence
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mode Clair */}
          <button
            onClick={() => setTheme('light')}
            className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
              theme === 'light'
                ? 'border-primary bg-white/10 shadow-lg shadow-primary/20'
                : 'border-border bg-card hover:border-border hover:bg-background'
            }`}
            aria-label="Activer le thème clair"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${
                theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Sun className="w-5 h-5" />
              </div>
              <span className={`font-semibold ${
                theme === 'light' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Mode Clair
              </span>
              {theme === 'light' && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-[#ff0033] rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <p className={`text-sm text-left ${
              theme === 'light' ? 'text-gray-300' : 'text-gray-400'
            }`}>
              Interface claire et moderne, optimisée pour la lecture en journée
            </p>
            {/* Aperçu visuel */}
            <div className="mt-3 flex gap-1">
              <div className="w-3 h-3 bg-white rounded border border-gray-300"></div>
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <div className="w-3 h-3 bg-[#ff0033] rounded"></div>
            </div>
          </button>

          {/* Mode Sombre */}
          <button
            onClick={() => setTheme('dark')}
            className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
              theme === 'dark'
                ? 'border-primary bg-white/10 shadow-lg shadow-primary/20'
                : 'border-border bg-card hover:border-border hover:bg-background'
            }`}
            aria-label="Activer le thème sombre"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Moon className="w-5 h-5" />
              </div>
              <span className={`font-semibold ${
                theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Mode Sombre
              </span>
              {theme === 'dark' && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-[#ff0033] rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <p className={`text-sm text-left ${
              theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'
            }`}>
              Interface sombre et élégante, confortable pour les yeux en soirée
            </p>
            {/* Aperçu visuel */}
            <div className="mt-3 flex gap-1">
              <div className="w-3 h-3 bg-[#0a0a0a] rounded border border-gray-600"></div>
              <div className="w-3 h-3 bg-[#1a1a1a] rounded"></div>
              <div className="w-3 h-3 bg-[#ff0033] rounded"></div>
            </div>
          </button>
        </div>
        
        {/* Note d'accessibilité */}
        <div className="mt-4 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 mt-0.5 text-[#ff0033]">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium mb-1">Accessibilité</p>
              <p className="text-xs text-gray-400">
                Les deux thèmes respectent les standards WCAG AA pour un contraste optimal et une meilleure lisibilité.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Langue */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Langue
        </label>
        <select
          value={preferences.language}
          onChange={(e) => setPreferences({...preferences, language: e.target.value})}
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-card-foreground focus:outline-none focus:border-primary"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Fuseau horaire */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Fuseau horaire
        </label>
        <select
          value={preferences.timezone}
          onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-card-foreground focus:outline-none focus:border-primary"
        >
          <option value="Europe/Paris">Paris (UTC+1)</option>
          <option value="Europe/London">Londres (UTC+0)</option>
          <option value="America/New_York">New York (UTC-5)</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
      >
        <Save className="w-4 h-4" />
        Sauvegarder
      </button>
    </div>
  );
}