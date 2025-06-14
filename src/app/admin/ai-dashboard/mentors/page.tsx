'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { 
  Brain, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Users,
  MessageSquare,
  Clock,
  Star,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  CheckCircle,
  PenTool,
  Target,
  TrendingUp,
  Megaphone,
  Video,
  Mail,
  Lightbulb,
  BarChart3,
  Palette,
  Zap
} from 'lucide-react';

// Icon mapping function
const getIcon = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    'PenTool': PenTool,
    'Target': Target,
    'TrendingUp': TrendingUp,
    'Megaphone': Megaphone,
    'Video': Video,
    'Mail': Mail,
    'Lightbulb': Lightbulb,
    'BarChart3': BarChart3,
    'Users': Users,
    'Palette': Palette,
    'MessageSquare': MessageSquare,
    'Zap': Zap
  };
  
  const IconComponent = iconMap[iconName] || MessageSquare;
  return <IconComponent className="w-8 h-8 text-gray-600" />;
}
import type { AIMentor } from '@/types/ai-mentor';

interface MentorFormData {
  name: string;
  description: string;
  expertise: string[];
  icon: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  link: string;
  isPopular: boolean;
  estimatedResponseTime: string;
  conversationCount: number;
  suggestedPrompts: string[];
  systemPrompt: string;
  isActive: boolean;
}

const defaultFormData: MentorFormData = {
  name: '',
  description: '',
  expertise: [],
  icon: '🤖',
  theme: {
    primary: '#3B82F6',
    secondary: '#EFF6FF',
    accent: '#1D4ED8'
  },
  link: '',
  isPopular: false,
  estimatedResponseTime: '~2 min',
  conversationCount: 0,
  suggestedPrompts: [],
  systemPrompt: '',
  isActive: true
};

export default function MentorsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mentors, setMentors] = useState<AIMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMentor, setEditingMentor] = useState<AIMentor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MentorFormData>(defaultFormData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Vérification des permissions
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.email) {
      router.push('/');
      return;
    }
    
    if (session.user.email !== 'cyril.iriebi@gmail.com') {
      router.push('/dashboard');
      return;
    }

    loadMentors();
  }, [session, status, router]);

  const loadMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai-mentors');
      
      if (response.ok) {
        const data = await response.json();
        setMentors(data.mentors || []);
      } else {
        throw new Error('Erreur lors du chargement des mentors');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mentor: AIMentor) => {
    setEditingMentor(mentor);
    setFormData({
      name: mentor.name,
      description: mentor.description,
      expertise: mentor.expertise,
      icon: mentor.icon,
      theme: mentor.theme,
      link: mentor.link,
      isPopular: mentor.isPopular,
      estimatedResponseTime: mentor.estimatedResponseTime,
      conversationCount: mentor.conversationCount,
      suggestedPrompts: mentor.suggestedPrompts,
      systemPrompt: mentor.systemPrompt,
      isActive: mentor.isActive !== false
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingMentor(null);
    setFormData(defaultFormData);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const url = editingMentor 
        ? `/api/admin/ai-mentors/${editingMentor.id}`
        : '/api/admin/ai-mentors';
      
      const method = editingMentor ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSuccess(editingMentor ? 'Mentor mis à jour avec succès' : 'Mentor créé avec succès');
        setShowForm(false);
        loadMentors();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (mentorId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce mentor ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/ai-mentors/${mentorId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSuccess('Mentor supprimé avec succès');
        loadMentors();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de supprimer le mentor');
    }
  };

  const handleToggleActive = async (mentor: AIMentor) => {
    try {
      const response = await fetch(`/api/admin/ai-mentors/${mentor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...mentor,
          isActive: !mentor.isActive
        })
      });
      
      if (response.ok) {
        loadMentors();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const addExpertise = () => {
    setFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, '']
    }));
  };

  const removeExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  const updateExpertise = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.map((item, i) => i === index ? value : item)
    }));
  };

  const addPrompt = () => {
    setFormData(prev => ({
      ...prev,
      suggestedPrompts: [...prev.suggestedPrompts, '']
    }));
  };

  const removePrompt = (index: number) => {
    setFormData(prev => ({
      ...prev,
      suggestedPrompts: prev.suggestedPrompts.filter((_, i) => i !== index)
    }));
  };

  const updatePrompt = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      suggestedPrompts: prev.suggestedPrompts.map((item, i) => i === index ? value : item)
    }));
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<Brain className="w-5 h-5" />}
        title="Gestion des Mentors IA"
        subtitle="Chargement..."
        stats={[]}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Chargement des mentors...</span>
        </div>
      </AdminLayoutWithSidebar>
    );
  }

  const stats = [
    {
      title: "Total Mentors",
      value: mentors.length.toString(),
      icon: <Brain className="w-5 h-5" />
    },
    {
      title: "Mentors Actifs",
      value: mentors.filter(m => m.isActive !== false).length.toString(),
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      title: "Mentors Populaires",
      value: mentors.filter(m => m.isPopular).length.toString(),
      icon: <Star className="w-5 h-5" />
    },
    {
      title: "Total Conversations",
      value: mentors.reduce((sum, m) => sum + m.conversationCount, 0).toString(),
      icon: <MessageSquare className="w-5 h-5" />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<Brain className="w-5 h-5" />}
      title="Gestion des Mentors IA"
      subtitle="Gérez les mentors IA disponibles sur la plateforme"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Messages d'état */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-green-700">{success}</span>
            <button 
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Liste des Mentors</h2>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau Mentor
          </button>
        </div>

        {/* Liste des mentors */}
        <div className="grid gap-4">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getIcon(mentor.icon)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                      {mentor.isPopular && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      {mentor.isActive !== false ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{mentor.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentor.expertise.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {mentor.estimatedResponseTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {mentor.conversationCount} conversations
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(mentor)}
                    className={`p-2 rounded-lg ${
                      mentor.isActive !== false
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={mentor.isActive !== false ? 'Désactiver' : 'Activer'}
                  >
                    {mentor.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(mentor)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(mentor.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire de création/édition */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {editingMentor ? 'Modifier le Mentor' : 'Nouveau Mentor'}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Mentor
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Expert Marketing"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icône (Emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="🤖"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description du mentor et de ses compétences..."
                  />
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domaines d'expertise
                  </label>
                  <div className="space-y-2">
                    {formData.expertise.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateExpertise(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Marketing Digital"
                        />
                        <button
                          onClick={() => removeExpertise(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addExpertise}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une expertise
                    </button>
                  </div>
                </div>

                {/* Prompts suggérés */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompts suggérés
                  </label>
                  <div className="space-y-2">
                    {formData.suggestedPrompts.map((prompt, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={prompt}
                          onChange={(e) => updatePrompt(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Comment créer une stratégie marketing efficace ?"
                        />
                        <button
                          onClick={() => removePrompt(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addPrompt}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un prompt
                    </button>
                  </div>
                </div>

                {/* Prompt système */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt système
                  </label>
                  <textarea
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Instructions pour l'IA sur le comportement et le style de réponse..."
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temps de réponse estimé
                    </label>
                    <input
                      type="text"
                      value={formData.estimatedResponseTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedResponseTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="~2 min"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lien externe (optionnel)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                      className="mr-2"
                    />
                    Mentor populaire
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    Actif
                  </label>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWithSidebar>
  );
}