'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle,
  AlertCircle,
  Book,
  Video,
  Users,
  Search
} from 'lucide-react';

export default function SupportPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { id: 'general', label: 'Question générale', icon: MessageCircle },
    { id: 'technical', label: 'Problème technique', icon: AlertCircle },
    { id: 'billing', label: 'Facturation', icon: CheckCircle },
    { id: 'course', label: 'Formations', icon: Book },
    { id: 'tools', label: 'Outils IA', icon: Video },
    { id: 'community', label: 'Communauté', icon: Users }
  ];

  const faqItems = [
    {
      question: "Comment accéder aux formations premium ?",
      answer: "Vous devez avoir un compte Premium actif. Rendez-vous dans la section Université pour voir toutes les formations disponibles."
    },
    {
      question: "Les outils IA sont-ils inclus dans l'abonnement ?",
      answer: "Oui, tous les outils IA sont inclus dans l'abonnement Premium. Vous avez accès illimité à tous les générateurs."
    },
    {
      question: "Comment puis-je télécharger mes ressources ?",
      answer: "Vos ressources sont disponibles dans votre Coffre personnel. Cliquez sur l'icône de téléchargement pour sauvegarder localement."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement depuis votre espace compte. L'accès reste actif jusqu'à la fin de la période payée."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    setMessage('');
    setSubject('');
  };

  if (isSubmitted) {
    return (
      <LayoutWithSidebar>
        <div className="min-h-screen bg-[#0a0a0a] p-6">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Message envoyé !</h1>
            <p className="text-gray-400 mb-8">
              Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors"
            >
              Envoyer un autre message
            </button>
          </div>
        </div>
      </LayoutWithSidebar>
    );
  }

  return (
    <LayoutWithSidebar>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Support</h1>
                <p className="text-gray-400">Notre équipe est là pour vous aider</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact rapide */}
            <div className="lg:col-span-1">
              <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Contact Rapide</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-[#ff0033]" />
                    <span>support@dropskills.com</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-[#ff0033]" />
                    <span>Lun-Ven 9h-18h</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <MessageCircle className="w-5 h-5 text-[#ff0033]" />
                    <span>Réponse sous 24h</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Questions Fréquentes</h3>
                
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <details key={index} className="group">
                      <summary className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm text-gray-400 pl-4">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Envoyer un Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Catégorie
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                            selectedCategory === category.id
                              ? 'border-[#ff0033] bg-[#ff0033]/10 text-[#ff0033]'
                              : 'border-[#333] text-gray-400 hover:border-[#555]'
                          }`}
                        >
                          <category.icon className="w-4 h-4" />
                          <span className="text-sm">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                      required
                    />
                  </div>

                  {/* Sujet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
                      placeholder="Décrivez brièvement votre demande"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033] resize-none"
                      placeholder="Décrivez votre problème ou votre question en détail..."
                      required
                    />
                  </div>

                  {/* Bouton d'envoi */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#ff0033] to-red-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 