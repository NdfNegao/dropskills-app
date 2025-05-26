'use client';
import Sidebar from '../../components/Sidebar';
import { MessageSquarePlus, ThumbsUp, X } from 'lucide-react';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function DemandesPage() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [votes, setVotes] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('votes') || '{}');
    }
    return {};
  });

  const demandes = [
    {
      id: 'web3',
      title: 'Formation Complète Web3 et NFTs',
      description: 'Une formation détaillée sur la blockchain, les NFTs et leur utilisation dans le business.',
      votes: 234,
      status: 'En cours',
      category: 'Blockchain'
    },
    {
      id: 'insta',
      title: 'Guide Instagram Shopping 2025',
      description: 'Un guide complet pour vendre efficacement sur Instagram avec les dernières fonctionnalités.',
      votes: 189,
      status: 'Proposé',
      category: 'Social Media'
    },
    {
      id: 'canva',
      title: 'Pack Templates Canva Pro',
      description: 'Collection de templates Canva premium pour le marketing digital.',
      votes: 156,
      status: 'Proposé',
      category: 'Design'
    },
  ];

  // Gestion du vote unique par utilisateur (localStorage demo)
  const handleVote = (id: string) => {
    if (!session) return;
    if (votes[id]) return;
    const newVotes = { ...votes, [id]: true };
    setVotes(newVotes);
    if (typeof window !== 'undefined') {
      localStorage.setItem('votes', JSON.stringify(newVotes));
    }
  };

  // Gestion du formulaire
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!form.title || !form.description || !form.category) {
      setFormError('Tous les champs sont obligatoires.');
      return;
    }
    setFormSuccess('Merci pour votre suggestion ! (simulation)');
    setForm({ title: '', description: '', category: '' });
    setTimeout(() => setModalOpen(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Bannière promotionnelle */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="ml-64 p-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Demandes de Produits</h1>
            <p className="text-gray-400">Proposez vos idées de produits ou votez pour les suggestions existantes.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="bg-[#ff0033] text-white px-6 py-3 rounded-lg hover:bg-[#cc0029] transition-colors flex items-center w-full md:w-auto justify-center">
            <MessageSquarePlus className="mr-2" size={20} />
            Nouvelle Demande
          </button>
        </div>

        {/* Modal de soumission */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#181818] rounded-2xl p-6 w-full max-w-md mx-2 relative animate-fadeIn">
              <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white"><X size={22} /></button>
              <h2 className="text-xl font-bold text-white mb-4">Proposer une idée de produit</h2>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Titre</label>
                  <input name="title" value={form.title} onChange={handleFormChange} className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0033]" required />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0033] min-h-[80px]" required />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Catégorie</label>
                  <input name="category" value={form.category} onChange={handleFormChange} className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0033]" required />
                </div>
                {formError && <div className="bg-red-500/10 border border-red-500 text-red-500 p-2 rounded">{formError}</div>}
                {formSuccess && <div className="bg-green-500/10 border border-green-500 text-green-500 p-2 rounded">{formSuccess}</div>}
                <button type="submit" className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors">Envoyer</button>
              </form>
            </div>
          </div>
        )}

        {/* Liste des demandes */}
        <div className="space-y-4">
          {demandes.map((demande) => (
            <div key={demande.id} className="bg-[#111111] rounded-xl p-6 hover:bg-[#1a1a1a] transition-all duration-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-semibold text-xl">{demande.title}</h3>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      demande.status === 'En cours' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {demande.status}
                    </span>
                    <span className="text-gray-400 text-sm">{demande.category}</span>
                  </div>
                  <p className="text-gray-400 mb-4">{demande.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <button
                    className={`flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto justify-center ${!session ? 'border border-[#ff0033]' : ''}`}
                    disabled={!session || votes[demande.id]}
                    onClick={() => {
                      if (!session) signIn();
                      else handleVote(demande.id);
                    }}
                  >
                    <ThumbsUp size={16} />
                    <span>{demande.votes + (votes[demande.id] ? 1 : 0)}</span>
                  </button>
                  {!session && <span className="text-xs text-[#ff0033]">Connectez-vous pour voter</span>}
                  {session && votes[demande.id] && <span className="text-xs text-green-400">Merci pour votre vote !</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 