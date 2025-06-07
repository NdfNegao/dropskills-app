"use client";

import { useState } from "react";
import { Gift, Users, Share2, Copy, Check, Mail, Zap } from "lucide-react";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-500 px-4 py-2 rounded-full mb-4">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-medium">Programme de parrainage</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invitez vos amis et gagnez des
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"> récompenses</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Pour chaque ami qui s'inscrit avec votre lien, vous débloquez des cadeaux exclusifs.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Parrainages réussis</span>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalReferrals}</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">En attente</span>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.pendingReferrals}</p>
          </div>
          <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Prochain cadeau dans</span>
              <Gift className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.nextReward} parrainage{stats.nextReward > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Referral link */}
        <div className="bg-[#111111] rounded-xl p-8 border border-[#232323] mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Votre lien de parrainage</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-[#1a1a1a] rounded-lg px-4 py-3 text-gray-300 font-mono text-sm">
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
            <p className="text-gray-400 mb-3">Partager sur :</p>
            <div className="flex gap-3">
              <button className="bg-[#1a1a1a] hover:bg-[#232323] text-white px-4 py-2 rounded-lg transition-colors">
                Twitter
              </button>
              <button className="bg-[#1a1a1a] hover:bg-[#232323] text-white px-4 py-2 rounded-lg transition-colors">
                LinkedIn
              </button>
              <button className="bg-[#1a1a1a] hover:bg-[#232323] text-white px-4 py-2 rounded-lg transition-colors">
                Facebook
              </button>
              <button className="bg-[#1a1a1a] hover:bg-[#232323] text-white px-4 py-2 rounded-lg transition-colors">
                WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Email invite */}
        <div className="bg-[#111111] rounded-xl p-8 border border-[#232323] mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Inviter par email</h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Emails de vos amis (séparés par des virgules)
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors h-24 resize-none"
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
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Récompenses à débloquer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className={`bg-[#111111] rounded-xl p-6 border ${
                  reward.unlocked ? "border-purple-500" : "border-[#232323]"
                } relative overflow-hidden`}
              >
                {!reward.unlocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <Gift className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">{reward.referrals} parrainages</p>
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-500 mb-2">{reward.referrals}</div>
                  <h3 className="text-lg font-semibold text-white mb-1">{reward.reward}</h3>
                  <p className="text-gray-400 text-sm">{reward.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GiftPage() {
  return (
    <LayoutWithSidebar>
      <GiftPageContent />
    </LayoutWithSidebar>
  );
}