"use client";
import { useState } from "react";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import { ArrowUp, X } from "lucide-react";

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
  // votes: { [id]: true/false }
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

  return (
    <LayoutWithSidebar>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Tableau des demandes de produits</h1>
            <p className="text-gray-400 text-base">Votez ou suggérez de nouveaux produits à ajouter à la DropSkills Library !</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors shadow-md"
          >
            Suggérer une idée
          </button>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-all ${activeTab === i ? "bg-white text-[#111] shadow border-gray-200" : "bg-[#18181b] text-gray-400 border-transparent hover:bg-[#232323]"}`}
            >
              {tab.label} <span className="ml-1 text-xs text-gray-500">({demandes.filter((d) => d.status === tab.value).length})</span>
            </button>
          ))}
        </div>
        {/* List */}
        <div className="flex flex-col gap-4">
          {filteredDemandes.length === 0 && (
            <div className="text-center text-gray-500 py-12">Aucune suggestion pour cette catégorie.</div>
          )}
          {filteredDemandes.map((demande) => (
            <div key={demande.id} className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-4 border border-gray-100">
              <button
                onClick={() => handleVote(demande.id)}
                className={`flex flex-col items-center px-3 py-2 rounded-lg border ${votes[demande.id] ? "bg-[#ff0033] text-white border-[#ff0033]" : "bg-gray-50 text-[#111] border-gray-200 hover:bg-gray-200"} transition-all mr-2`}
              >
                <ArrowUp className="w-5 h-5 mb-1" />
                <span className="font-bold text-lg">{demande.votes}</span>
              </button>
              <div>
                <h3 className="font-bold text-lg text-[#111] mb-1">{demande.title}</h3>
                <p className="text-gray-600 text-sm">{demande.description}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#18181b] rounded-2xl p-6 w-full max-w-md mx-2 relative animate-fadeIn shadow-xl">
              <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-[#ff0033]"><X size={22} /></button>
              <h2 className="text-xl font-bold text-white mb-4">Suggérer une nouvelle idée de produit</h2>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Titre</label>
                  <input name="title" value={form.title} onChange={handleFormChange} className="w-full bg-[#232323] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0033]" required />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full bg-[#232323] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0033] min-h-[80px]" required />
                </div>
                {formError && <div className="bg-red-500/10 border border-red-500 text-red-500 p-2 rounded">{formError}</div>}
                {formSuccess && <div className="bg-green-500/10 border border-green-500 text-green-500 p-2 rounded">{formSuccess}</div>}
                <button type="submit" className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors">Envoyer</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  );
} 