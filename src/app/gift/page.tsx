"use client";

import { useState } from "react";
import { Gift, Users, Share2, Copy, Check, Mail, Zap } from "lucide-react";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import PageBentoLayout from "@/components/PageBentoLayout";

function GiftPageContent() {
  const [referralLink] = useState("https://dropskills.com/ref/USER123");
  const [isCopied, setIsCopied] = useState(false);
  const [emails, setEmails] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    
    // TODO: Implémenter l'appel API
    setTimeout(() => {
      setInviteSuccess(true);
      setIsInviting(false);
      setEmails("");
      setTimeout(() => setInviteSuccess(false), 3000);
    }, 1500);
  };

  const rewards = [
    {
      referrals: 1,
      reward: "1 mois gratuit",
      description: "Accès complet à tous les outils",
      unlocked: true,
    },
    {
      referrals: 3,
      reward: "Formation exclusive",
      description: "Masterclass IA pour entrepreneurs",
      unlocked: false,
    },
    {
      referrals: 5,
      reward: "Coaching personnalisé",
      description: "1h de coaching avec un expert",
      unlocked: false,
    },
    {
      referrals: 10,
      reward: "Accès VIP à vie",
      description: "Tous les outils + futures mises à jour",
      unlocked: false,
    },
  ];

  const stats = {
    totalReferrals: 0,
    pendingReferrals: 0,
    nextReward: 1,
  };

  const pageStats = [
    {
      icon: <Users className="w-4 h-4" />,
      label: "Parrainages réussis",
      value: stats.totalReferrals,
      color: "text-purple-500"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: "En attente",
      value: stats.pendingReferrals,
      color: "text-yellow-500"
    },
    {
      icon: <Gift className="w-4 h-4" />,
      label: "Prochain cadeau dans",
      value: `${stats.nextReward} parrainage${stats.nextReward > 1 ? 's' : ''}`,
      color: "text-green-500"
    },
    {
      icon: <Share2 className="w-4 h-4" />,
      label: "Lien partagé",
      value: "Actif",
      color: "text-blue-500"
    }
  ];

  return (
    <PageBentoLayout
      icon={<Gift className="w-6 h-6 text-white" />}
      title="Programme de parrainage"
      subtitle="Invitez vos amis et gagnez des récompenses exclusives pour chaque inscription"
      stats={pageStats}
    >
      <div className="space-y-8">

        {/* Referral link */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Votre lien de parrainage</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-muted rounded-lg px-4 py-3 text-muted-foreground font-mono text-sm">
              {referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier le lien
                </>
              )}
            </button>
          </div>

          {/* Share buttons */}
          <div className="mt-6">
            <p className="text-muted-foreground mb-3">Partager sur :</p>
            <div className="flex gap-3">
              <button className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg transition-colors">
                Twitter
              </button>
              <button className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg transition-colors">
                LinkedIn
              </button>
              <button className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg transition-colors">
                Facebook
              </button>
              <button className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg transition-colors">
                WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Email invite */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Inviter par email</h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Emails de vos amis (séparés par des virgules)
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                placeholder="ami1@email.com, ami2@email.com..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isInviting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isInviting ? (
                "Envoi en cours..."
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Envoyer les invitations
                </>
              )}
            </button>
            {inviteSuccess && (
              <p className="text-green-500 text-sm">Invitations envoyées avec succès !</p>
            )}
          </form>
        </div>

        {/* Rewards */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Récompenses à débloquer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className={`bg-card rounded-xl p-6 border ${
                  reward.unlocked ? "border-primary" : "border-border"
                } relative overflow-hidden`}
              >
                {!reward.unlocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <Gift className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">{reward.referrals} parrainages</p>
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{reward.referrals}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{reward.reward}</h3>
                  <p className="text-muted-foreground text-sm">{reward.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageBentoLayout>
  );
}

export default function GiftPage() {
  return (
    <LayoutWithSidebar>
      <GiftPageContent />
    </LayoutWithSidebar>
  );
}