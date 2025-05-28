"use client";
import { useState } from "react";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import { 
  ArrowUp, 
  X, 
  Plus, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Clock,
  XCircle,
  Lightbulb
} from "lucide-react";

const TABS = [
  { label: "Idées", value: "idee" },
  { label: "Prévu", value: "prevu" },
  { label: "Terminé", value: "termine" },
  { label: "Rejeté", value: "rejete" },
];

const DEMANDES_INIT = [
  {
    id: "1",
    title: "Ultimate Survival Prepper",
    description:
      "Pack complet avec contenus détaillés, checklists et guides sur la survie, la préparation aux urgences, le stockage alimentaire, l'auto-défense, et plus encore.",
    votes: 19,
    status: "idee",
  },
  {
    id: "2",
    title: "Bonnes pratiques de sécurité pour le business en ligne",
    description:
      "Gardez votre activité et vos données en sécurité sur internet. Options gratuites et payantes pour la cybersécurité – soyez prudent, soyez protégé.",
    votes: 31,
    status: "prevu",
  },
  {
    id: "3",
    title: "Clés pour humaniser vos textes marketing IA",
    description:
      "Des astuces pour rendre vos textes IA plus humains, plus rapides à produire, tout en gardant votre identité de marque !",
    votes: 39,
    status: "idee",
  },
  {
    id: "4",
    title: "Restez motivé pour garder la forme et la santé",
    description:
      "Un workbook motivationnel pour celles et ceux qui peinent à garder de bonnes habitudes pour rester en forme et en bonne santé.",
    votes: 29,
    status: "termine",
  },
  {
    id: "5",
    title: "Leadership sécurité : construire une culture de responsabilité",
    description:
      "Guide pratique pour les leaders afin d'instaurer une culture sécurité forte par l'exemple, la communication et l'engagement quotidien.",
    votes: 24,
    status: "rejete",
  },
  {
    id: "6",
    title: "Travailler avec des assistants virtuels (VA)",
    description:
      "Comment collaborer efficacement avec un VA à distance. SOPs, KPIs, suivi des tâches et reporting.",
    votes: 28,
    status: "idee",
  },
];

export default function DemandesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [demandes, setDemandes] = useState(DEMANDES_INIT);
  const [votes, setVotes] = useState<{ [id: string]: boolean }>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("votes") || "{}");
    }
    return {};
  });

  // Vote ou dé-vote
  const handleVote = (id: string) => {
    const newVotes = { ...votes };
    let newDemandes = [...demandes];
    const idx = newDemandes.findIndex((d) => d.id === id);
    if (votes[id]) {
      // Dé-vote
      delete newVotes[id];
      newDemandes[idx].votes = Math.max(0, newDemandes[idx].votes - 1);
    } else {
      // Vote
      newVotes[id] = true;
      newDemandes[idx].votes = newDemandes[idx].votes + 1;
    }
    setVotes(newVotes);
    setDemandes(newDemandes);
    if (typeof window !== "undefined") {
      localStorage.setItem("votes", JSON.stringify(newVotes));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!form.title || !form.description) {
      setFormError("Tous les champs sont obligatoires.");
      return;
    }
    // Ajout côté front, status par défaut "idee"
    setDemandes([
      ...demandes,
      {
        id: (demandes.length + 1).toString(),
        title: form.title,
        description: form.description,
        votes: 0,
        status: "idee",
      },
    ]);
    setFormSuccess("Merci pour votre suggestion ! (simulation)");
    setForm({ title: "", description: "" });
    setTimeout(() => setModalOpen(false), 1200);
  };

  // Filtrage dynamique selon l'onglet
  const filteredDemandes = demandes.filter((d) => d.status === TABS[activeTab].value);

  const stats = {
    totalDemandes: demandes.length,
    enCours: demandes.filter(d => d.status === 'prevu').length,
    terminees: demandes.filter(d => d.status === 'termine').length,
    totalVotes: demandes.reduce((sum, d) => sum + d.votes, 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idee': return <Lightbulb className="w-4 h-4" />;
      case 'prevu': return <Clock className="w-4 h-4" />;
      case 'termine': return <CheckCircle className="w-4 h-4" />;
      case 'rejete': return <XCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idee': return 'text-blue-400';
      case 'prevu': return 'text-yellow-400';
      case 'termine': return 'text-green-400';
      case 'rejete': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Demandes de Produits</h1>
              <p className="text-gray-400">Votez ou suggérez de nouveaux produits à ajouter à la DropSkills Library</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalDemandes}</div>
              <div className="text-xs text-gray-400">demandes soumises</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">En cours</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.enCours}</div>
              <div className="text-xs text-gray-400">en développement</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Terminées</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.terminees}</div>
              <div className="text-xs text-gray-400">produits livrés</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Votes</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalVotes}</div>
              <div className="text-xs text-gray-400">votes communauté</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors shadow-md flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Suggérer une idée
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-all flex items-center gap-2 ${
                  activeTab === i 
                    ? "bg-[#ff0033] text-white border-[#ff0033] shadow-md" 
                    : "bg-[#1a1a1a] text-gray-400 border-[#333] hover:bg-[#232323] hover:text-white"
                }`}
              >
                <span className={getStatusColor(tab.value)}>
                  {getStatusIcon(tab.value)}
                </span>
                {tab.label}
                <span className="ml-1 text-xs bg-black/20 px-2 py-1 rounded-full">
                  {demandes.filter((d) => d.status === tab.value).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-4">
          {filteredDemandes.length === 0 && (
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aucune suggestion</h3>
              <p className="text-gray-400">Aucune suggestion pour cette catégorie pour le moment.</p>
            </div>
          )}
          
          {filteredDemandes.map((demande) => (
            <div key={demande.id} className="bg-[#111111] border border-[#232323] rounded-xl p-6 hover:border-[#333] transition-colors">
              <div className="flex items-start gap-4">
                {/* Vote Button */}
                <button
                  onClick={() => handleVote(demande.id)}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg border transition-all ${
                    votes[demande.id] 
                      ? "bg-[#ff0033] text-white border-[#ff0033] shadow-md" 
                      : "bg-[#1a1a1a] text-gray-300 border-[#333] hover:bg-[#232323] hover:border-[#ff0033]"
                  }`}
                >
                  <ArrowUp className="w-5 h-5 mb-1" />
                  <span className="font-bold text-lg">{demande.votes}</span>
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">{demande.title}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demande.status)} bg-current/10`}>
                      {getStatusIcon(demande.status)}
                      <span className="capitalize">{TABS.find(t => t.value === demande.status)?.label}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{demande.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 w-full max-w-md mx-4 relative shadow-2xl">
              <button 
                onClick={() => setModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-[#ff0033] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Suggérer une nouvelle idée</h2>
                <p className="text-gray-400 text-sm">Partagez votre idée de produit avec la communauté</p>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Titre du produit</label>
                  <input 
                    name="title" 
                    value={form.title} 
                    onChange={handleFormChange} 
                    className="w-full bg-[#1a1a1a] border border-[#333] text-white p-3 rounded-lg focus:outline-none focus:border-[#ff0033] transition-colors" 
                    placeholder="Ex: Pack Business Complet"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Description détaillée</label>
                  <textarea 
                    name="description" 
                    value={form.description} 
                    onChange={handleFormChange} 
                    className="w-full bg-[#1a1a1a] border border-[#333] text-white p-3 rounded-lg focus:outline-none focus:border-[#ff0033] transition-colors min-h-[100px] resize-none" 
                    placeholder="Décrivez votre idée en détail..."
                    required 
                  />
                </div>
                
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
                    {formError}
                  </div>
                )}
                
                {formSuccess && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg text-sm">
                    {formSuccess}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Envoyer la suggestion
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  );
} 