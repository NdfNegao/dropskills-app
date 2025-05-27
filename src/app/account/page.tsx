"use client";

import { useState } from "react";
import { User, Mail, Lock, CreditCard, Bell, Shield, Save, Check, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AccountPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // États du formulaire
  const [profile, setProfile] = useState({
    firstName: session?.user?.firstName || "",
    lastName: session?.user?.lastName || "",
    email: session?.user?.email || "",
    phone: "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    emailUpdates: true,
    emailNewTools: true,
    smsNotifications: false,
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // TODO: Implémenter l'appel API
    setTimeout(() => {
      setSaveSuccess(true);
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "subscription", label: "Abonnement", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                placeholder="votre@email.com"
                disabled
              />
              <p className="text-gray-400 text-sm mt-1">L'email ne peut pas être modifié</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors h-32 resize-none"
                placeholder="Parlez-nous de vous..."
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  "Enregistrement..."
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-500">
                  <Check className="w-4 h-4" />
                  <span>Modifications enregistrées</span>
                </div>
              )}
            </div>
          </form>
        );

      case "subscription":
        return (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">Plan actuel</h3>
                  <p className="text-gray-400">Vous êtes sur le plan gratuit</p>
                </div>
                <span className="bg-gray-500/10 text-gray-400 px-3 py-1 rounded-full text-sm">
                  Gratuit
                </span>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300">Accès à 3 outils IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-300">10 générations par mois</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Support standard</span>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Passer au plan Pro
              </button>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
              <h3 className="text-xl font-semibold text-white mb-4">Historique de facturation</h3>
              <p className="text-gray-400">Aucune facture pour le moment</p>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#333] cursor-pointer hover:border-[#00D2FF]/50 transition-colors">
                <div>
                  <p className="text-white font-medium">Emails marketing</p>
                  <p className="text-gray-400 text-sm">Recevez nos offres et promotions</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailMarketing}
                  onChange={(e) => setNotifications({ ...notifications, emailMarketing: e.target.checked })}
                  className="w-5 h-5 text-[#00D2FF] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#00D2FF]"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#333] cursor-pointer hover:border-[#00D2FF]/50 transition-colors">
                <div>
                  <p className="text-white font-medium">Mises à jour produit</p>
                  <p className="text-gray-400 text-sm">Soyez informé des nouvelles fonctionnalités</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailUpdates}
                  onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                  className="w-5 h-5 text-[#00D2FF] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#00D2FF]"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#333] cursor-pointer hover:border-[#00D2FF]/50 transition-colors">
                <div>
                  <p className="text-white font-medium">Nouveaux outils IA</p>
                  <p className="text-gray-400 text-sm">Découvrez nos derniers outils en avant-première</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailNewTools}
                  onChange={(e) => setNotifications({ ...notifications, emailNewTools: e.target.checked })}
                  className="w-5 h-5 text-[#00D2FF] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#00D2FF]"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#333] cursor-pointer hover:border-[#00D2FF]/50 transition-colors">
                <div>
                  <p className="text-white font-medium">Notifications SMS</p>
                  <p className="text-gray-400 text-sm">Recevez des alertes importantes par SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.smsNotifications}
                  onChange={(e) => setNotifications({ ...notifications, smsNotifications: e.target.checked })}
                  className="w-5 h-5 text-[#00D2FF] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#00D2FF]"
                />
              </label>
            </div>

            <button className="bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Enregistrer les préférences
            </button>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
              <h3 className="text-xl font-semibold text-white mb-4">Changer le mot de passe</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className="w-full bg-[#111111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full bg-[#111111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full bg-[#111111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Mettre à jour le mot de passe
                </button>
              </form>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333]">
              <h3 className="text-xl font-semibold text-white mb-4">Authentification à deux facteurs</h3>
              <p className="text-gray-400 mb-4">
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </p>
              <button className="bg-[#232323] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#333] transition-colors">
                Activer la 2FA
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mon compte</h1>
          <p className="text-gray-400 mt-2">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#1a1a1a] text-white border border-[#00D2FF]"
                      : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-[#111111] rounded-xl p-8 border border-[#232323]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 