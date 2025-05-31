"use client";

import { useState, useRef, useEffect } from "react";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import { ArrowUp, Plus, X, Lightbulb, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

const IDEAS = [
  {
    id: "1",
    title: "Maîtriser n8n (Automatisation No-Code)",
    description: "Apprenez à automatiser vos workflows et connecter vos outils sans coder.",
    status: "pending",
    votes_count: 42,
  },
  {
    id: "2",
    title: "L'art de partir viral sur TikTok",
    description: "Stratégies concrètes pour exploser votre visibilité sur TikTok en 2024.",
    status: "in_progress",
    votes_count: 31,
  },
  {
    id: "3",
    title: "Créer un tunnel de vente qui convertit",
    description: "Toutes les étapes pour construire un tunnel de vente efficace.",
    status: "completed",
    votes_count: 54,
  },
  {
    id: "4",
    title: "Gérer une équipe à distance comme un pro",
    description: "Outils et méthodes pour manager des freelances ou VAs.",
    status: "pending",
    votes_count: 27,
  },
  {
    id: "5",
    title: "Lancer sa première formation en ligne",
    description: "De l'idée à la vente, toutes les étapes pour réussir.",
    status: "rejected",
    votes_count: 12,
  },
  {
    id: "6",
    title: "Prompt Engineering pour Entrepreneurs",
    description: "Maîtrisez l'art de rédiger des prompts efficaces pour ChatGPT et Midjourney.",
    status: "pending",
    votes_count: 38,
  },
  {
    id: "7",
    title: "Créer un SaaS IA sans coder",
    description: "De l'idée à la mise en ligne d'un SaaS propulsé par l'IA, sans une ligne de code.",
    status: "pending",
    votes_count: 29,
  },
  {
    id: "8",
    title: "Automatiser sa prospection LinkedIn",
    description: "Scripts, outils et stratégies pour générer des leads en automatique.",
    status: "in_progress",
    votes_count: 33,
  },
  {
    id: "9",
    title: "Créer un podcast à succès en 30 jours",
    description: "De l'enregistrement à la monétisation, toutes les étapes clés.",
    status: "pending",
    votes_count: 21,
  },
  {
    id: "10",
    title: "Monétiser son audience Instagram",
    description: "Stratégies avancées pour transformer ses abonnés en clients.",
    status: "completed",
    votes_count: 44,
  },
  {
    id: "11",
    title: "Lancer un business d'affiliation IA",
    description: "Comment générer des revenus passifs avec l'affiliation et l'IA.",
    status: "pending",
    votes_count: 19,
  },
  {
    id: "12",
    title: "Créer un lead magnet irrésistible",
    description: "Techniques pour capter des emails qualifiés avec des ressources gratuites.",
    status: "pending",
    votes_count: 25,
  },
  {
    id: "13",
    title: "Growth Hacking pour solopreneurs",
    description: "Tactiques de croissance rapide à petit budget.",
    status: "in_progress",
    votes_count: 36,
  },
  {
    id: "14",
    title: "Créer une newsletter qui cartonne",
    description: "Secrets pour fidéliser et monétiser sa liste email.",
    status: "pending",
    votes_count: 22,
  },
  {
    id: "15",
    title: "Lancer un bootcamp en ligne",
    description: "Organiser et vendre une formation intensive sur 4 semaines.",
    status: "pending",
    votes_count: 18,
  },
  {
    id: "16",
    title: "Automatiser sa gestion client avec Notion",
    description: "Templates et workflows pour suivre ses clients et projets.",
    status: "completed",
    votes_count: 41,
  },
  {
    id: "17",
    title: "Créer un site de vente de templates IA",
    description: "Monétiser ses propres prompts et templates auprès d'autres entrepreneurs.",
    status: "pending",
    votes_count: 17,
  },
  {
    id: "18",
    title: "Lancer un membership premium",
    description: "Créer une communauté payante autour de son expertise.",
    status: "pending",
    votes_count: 23,
  },
  {
    id: "19",
    title: "Vendre des formations sur Udemy/Skillshare",
    description: "Optimiser ses cours pour toucher un maximum d'élèves.",
    status: "pending",
    votes_count: 20,
  },
  {
    id: "20",
    title: "Créer un chatbot support client IA",
    description: "Mettre en place un assistant IA pour répondre aux clients 24/7.",
    status: "in_progress",
    votes_count: 28,
  },
  {
    id: "21",
    title: "Automatiser sa facturation et relance",
    description: "Outils et scripts pour ne plus perdre de temps sur l'administratif.",
    status: "pending",
    votes_count: 15,
  },
  {
    id: "22",
    title: "Créer un funnel evergreen avec l'IA",
    description: "Automatiser la génération de leads et de ventes en continu.",
    status: "pending",
    votes_count: 24,
  },
  {
    id: "23",
    title: "Lancer un service de consulting IA",
    description: "Packager et vendre son expertise IA à des PME.",
    status: "pending",
    votes_count: 16,
  },
  {
    id: "24",
    title: "Créer une app mobile sans coder",
    description: "Utiliser les outils no-code pour lancer son app en 1 semaine.",
    status: "pending",
    votes_count: 21,
  },
  {
    id: "25",
    title: "Optimiser son SEO avec l'IA",
    description: "Stratégies et outils pour booster son référencement grâce à l'IA.",
    status: "pending",
    votes_count: 26,
  },
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Idée",
  in_progress: "En cours",
  completed: "Terminé",
  rejected: "Rejeté",
};

const STATUS_ICONS: Record<string, any> = {
  pending: Lightbulb,
  in_progress: Clock,
  completed: CheckCircle,
  rejected: XCircle,
};

export default function DemandesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'vote' | 'submit' | null>(null);
  const [showToast, setShowToast] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Statistiques calculées
  const stats = {
    total: IDEAS.length,
    pending: IDEAS.filter(i => i.status === 'pending').length,
    inProgress: IDEAS.filter(i => i.status === 'in_progress').length,
    completed: IDEAS.filter(i => i.status === 'completed').length,
    rejected: IDEAS.filter(i => i.status === 'rejected').length,
    totalVotes: IDEAS.reduce((sum, i) => sum + i.votes_count, 0),
  };

  const filteredIdeas = IDEAS;

  const openModal = (type: 'vote' | 'submit') => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
          setModalOpen(false);
    setModalType(null);
    setShowToast(true);
  };

  // Accessibilité : fermeture modale par Échap
  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen]);

  // Focus automatique sur la modale
  useEffect(() => {
    if (modalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalOpen]);

  // Toast auto-disparition
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  return (
    <LayoutWithSidebar>
      <div className="max-w-3xl mx-auto py-8 px-2 md:px-0">
        {/* Bandeau Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatBox icon={<Lightbulb className="w-5 h-5" />} label="Idées" value={stats.pending} color="text-blue-400" />
          <StatBox icon={<Clock className="w-5 h-5" />} label="En cours" value={stats.inProgress} color="text-yellow-400" />
          <StatBox icon={<CheckCircle className="w-5 h-5" />} label="Terminées" value={stats.completed} color="text-green-400" />
          <StatBox icon={<XCircle className="w-5 h-5" />} label="Rejetées" value={stats.rejected} color="text-red-400" />
          <StatBox icon={<TrendingUp className="w-5 h-5" />} label="Votes" value={stats.totalVotes} color="text-pink-400" />
            </div>
            
        {/* Titre et sous-titre */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Product Request Board</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Votez ou proposez de nouvelles idées de formations à ajouter à la Dropskills Library. Les suggestions les plus populaires seront priorisées par notre équipe.
          </p>
            </div>
            
        {/* CTA aide */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#ff0033]/10 to-[#232323] border border-[#232323] rounded-xl p-4">
          <div className="text-sm text-gray-300">
            <span className="font-semibold text-[#ff0033]">Vous avez une idée ?</span> Proposez-la ou votez pour vos favoris. Plus une idée a de votes, plus elle a de chances d'être développée !
          </div>
            <button
            className="flex items-center gap-2 bg-[#ff0033] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#e6002a] transition shadow-md focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
            onClick={() => openModal('submit')}
            >
              <Plus className="w-5 h-5" />
            Soumettre une idée
            </button>
        </div>

        {/* Liste des idées */}
        <div className="space-y-4">
          {filteredIdeas.length === 0 && (
            <div className="text-gray-400 text-center py-12">Aucune idée à afficher.</div>
          )}
          {filteredIdeas.map((idea) => {
            const Icon = STATUS_ICONS[idea.status];
            return (
              <div
                key={idea.id}
                className="bg-[#111] border border-[#232323] rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded-full p-2 ${
                    idea.status === "completed"
                      ? "bg-green-700/20 text-green-400"
                      : idea.status === "in_progress"
                      ? "bg-yellow-700/20 text-yellow-400"
                      : idea.status === "rejected"
                      ? "bg-red-700/20 text-red-400"
                      : "bg-blue-700/20 text-blue-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">{idea.title}</h2>
                    <p className="text-gray-400 text-sm mb-2">{idea.description}</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mr-2 ${
                        idea.status === "completed"
                          ? "bg-green-700/20 text-green-400"
                          : idea.status === "in_progress"
                          ? "bg-yellow-700/20 text-yellow-400"
                          : idea.status === "rejected"
                          ? "bg-red-700/20 text-red-400"
                          : "bg-blue-700/20 text-blue-400"
                      }`}
                    >
                      {STATUS_LABELS[idea.status]}
                      </span>
                  </div>
                    </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    className="flex flex-col items-center text-gray-300 hover:text-[#ff0033] transition focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
                    onClick={() => openModal('vote')}
                  >
                    <ArrowUp className="w-6 h-6" />
                    <span className="font-bold text-lg">{idea.votes_count}</span>
                    <span className="text-xs">votes</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Premium */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative outline-none"
              tabIndex={-1}
              ref={modalRef}
            >
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                onClick={closeModal}
                aria-label="Fermer la fenêtre"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <span className="inline-block bg-[#ff0033] text-white px-3 py-1 rounded-full font-semibold text-xs">
                    ⭐ Fonctionnalité Premium
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900">
                  Passez à l'offre Premium pour {modalType === 'vote' ? 'voter' : 'soumettre une idée'} !
                </h2>
                <p className="text-gray-600 mb-4">
                  Profitez de tous les avantages Dropskills Premium&nbsp;:
                </p>
                <ul className="text-left text-gray-700 mb-6 space-y-2">
                  <li>✅ Votez pour vos idées préférées</li>
                  <li>✅ Accédez à 1 000+ ressources exclusives</li>
                  <li>✅ 20+ nouvelles formations chaque mois</li>
                  <li>✅ Accès à la Dropskills Academy et toolkit</li>
                </ul>
                <button className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold text-lg mb-2 hover:bg-[#e6002a] transition">
                  Voir les offres Premium
                </button>
                <button 
                  className="w-full py-2 rounded-lg text-gray-500 hover:text-gray-700 text-sm"
                  onClick={closeModal}
                >
                  Peut-être plus tard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast de confirmation */}
        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#232323] text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
            Fonctionnalité Premium réservée aux abonnés. 🚀
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center bg-[#111] border border-[#232323] rounded-xl py-4 shadow-sm">
      <div className={`mb-1 ${color}`}>{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 font-medium">{label}</div>
    </div>
  );
} 