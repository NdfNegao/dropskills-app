"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  { label: "Idées", value: "pending" },
  { label: "En cours", value: "in_progress" },
  { label: "Terminé", value: "completed" },
  { label: "Rejeté", value: "rejected" },
];

interface ProductRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  votes_count: number;
  user_id: string;
  user_email: string;
  admin_notes?: string;
  priority: 'low' | 'medium' | 'high';
  estimated_completion?: string;
  created_at: string;
  updated_at: string;
}

interface UserVote {
  [requestId: string]: boolean;
}

export default function DemandesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote>({});
  const [isLoading, setIsLoading] = useState(true);

  // Charger les demandes
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await fetch('/api/product-requests');
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des demandes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  // Charger les votes de l'utilisateur
  useEffect(() => {
    const loadUserVotes = async () => {
      if (!session?.user?.email) return;

      const votes: UserVote = {};
      for (const request of requests) {
        try {
          const response = await fetch(`/api/product-requests/${request.id}/vote`);
          if (response.ok) {
            const data = await response.json();
            votes[request.id] = data.hasVoted;
          }
        } catch (error) {
          console.error('Erreur lors du chargement des votes:', error);
        }
      }
      setUserVotes(votes);
    };

    if (requests.length > 0) {
      loadUserVotes();
    }
  }, [requests, session]);

  // Vote ou dé-vote
  const handleVote = async (requestId: string) => {
    if (!session?.user?.email) {
      router.push('/auth/signin');
      return;
    }

    try {
      const response = await fetch(`/api/product-requests/${requestId}/vote`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        
        // Mettre à jour l'état local
        setUserVotes(prev => ({
          ...prev,
          [requestId]: result.action === 'added'
        }));

        // Mettre à jour le compteur de votes
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { 
                  ...req, 
                  votes_count: result.action === 'added' 
                    ? req.votes_count + 1 
                    : Math.max(0, req.votes_count - 1)
                }
              : req
          )
        );
      } else {
        const error = await response.json();
        console.error('Erreur lors du vote:', error.error);
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    if (!session?.user?.email) {
      router.push('/auth/signin');
      return;
    }

    if (!form.title || !form.description) {
      setFormError("Tous les champs sont obligatoires.");
      setIsSubmitting(false);
      return;
    }

    if (form.title.length < 10 || form.title.length > 255) {
      setFormError("Le titre doit contenir entre 10 et 255 caractères.");
      setIsSubmitting(false);
      return;
    }

    if (form.description.length < 20 || form.description.length > 2000) {
      setFormError("La description doit contenir entre 20 et 2000 caractères.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/product-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const result = await response.json();
        setRequests(prev => [result.request, ...prev]);
        setFormSuccess("Merci pour votre suggestion ! Elle a été soumise avec succès.");
        setForm({ title: "", description: "" });
        setTimeout(() => {
          setModalOpen(false);
          setFormSuccess("");
        }, 2000);
      } else {
        const error = await response.json();
        setFormError(error.error || "Erreur lors de la soumission");
      }
    } catch (error) {
      setFormError("Erreur lors de la soumission de votre demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrage dynamique selon l'onglet
  const filteredRequests = requests.filter((d) => d.status === TABS[activeTab].value);

  const stats = {
    totalDemandes: requests.length,
    enCours: requests.filter(d => d.status === 'in_progress').length,
    terminees: requests.filter(d => d.status === 'completed').length,
    totalVotes: requests.reduce((sum, d) => sum + d.votes_count, 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Lightbulb className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-400';
      case 'in_progress': return 'text-yellow-400';
      case 'completed': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <LayoutWithSidebar>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033]"></div>
          <span className="ml-2 text-gray-300">Chargement des demandes...</span>
        </div>
      </LayoutWithSidebar>
    );
  }

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
              onClick={() => {
                if (!session?.user?.email) {
                  router.push('/auth/signin');
                  return;
                }
                setModalOpen(true);
              }}
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
                  {requests.filter((d) => d.status === tab.value).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-4">
          {filteredRequests.length === 0 && (
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aucune suggestion</h3>
              <p className="text-gray-400">Aucune suggestion pour cette catégorie pour le moment.</p>
            </div>
          )}
          
          {filteredRequests.map((demande) => (
            <div key={demande.id} className="bg-[#111111] border border-[#232323] rounded-xl p-6 hover:border-[#333] transition-colors">
              <div className="flex items-start gap-4">
                {/* Vote Button */}
                <button
                  onClick={() => handleVote(demande.id)}
                  disabled={!session?.user?.email}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg border transition-all ${
                    userVotes[demande.id] 
                      ? "bg-[#ff0033] text-white border-[#ff0033] shadow-md" 
                      : "bg-[#1a1a1a] text-gray-300 border-[#333] hover:bg-[#232323] hover:border-[#ff0033]"
                  } ${!session?.user?.email ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ArrowUp className="w-5 h-5 mb-1" />
                  <span className="font-bold text-lg">{demande.votes_count}</span>
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
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{demande.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Créée le {formatDate(demande.created_at)}</span>
                    {demande.estimated_completion && (
                      <span className="text-blue-400">
                        Livraison estimée: {formatDate(demande.estimated_completion)}
                      </span>
                    )}
                  </div>

                  {demande.admin_notes && (
                    <div className="mt-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#333]">
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-yellow-400">Note de l'équipe:</span> {demande.admin_notes}
                      </p>
                    </div>
                  )}
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
                    minLength={10}
                    maxLength={255}
                  />
                  <p className="text-xs text-gray-500 mt-1">{form.title.length}/255 caractères</p>
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
                    minLength={20}
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">{form.description.length}/2000 caractères</p>
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
                  disabled={isSubmitting}
                  className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Envoyer la suggestion
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  );
} 