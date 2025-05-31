'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  CheckCircle, 
  Crown, 
  Sparkles, 
  ArrowRight,
  Mail,
  Download,
  Play
} from 'lucide-react';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan');

  useEffect(() => {
    // Simulation de mise à jour du statut utilisateur
    // En production, ceci serait géré par le webhook de paiement
    console.log('Paiement confirmé pour le plan:', planId);
  }, [planId]);

  const nextSteps = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email de confirmation",
      description: "Vérifiez votre boîte mail pour les détails de votre abonnement",
      action: "Vérifier"
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Accéder aux outils IA",
      description: "Commencez à utiliser tous les outils premium immédiatement",
      action: "Explorer",
      link: "/outils"
    },
    {
      icon: <Play className="w-5 h-5" />,
      title: "Tutoriels de démarrage",
      description: "Apprenez à maximiser votre productivité avec nos guides",
      action: "Apprendre",
      link: "/universite"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto text-center py-12">
      {/* Icône de succès */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ff0033] rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Message de succès */}
      <h1 className="text-4xl font-bold text-white mb-4">
        🎉 Paiement confirmé !
      </h1>
      
      <p className="text-xl text-gray-300 mb-2">
        Bienvenue dans la famille Premium Dropskills
      </p>
      
      <p className="text-gray-400 mb-8">
        Votre abonnement est maintenant actif et vous avez accès à tous les outils IA premium.
      </p>

      {/* Badge Premium */}
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-6 py-3 rounded-full font-semibold mb-12">
        <Crown className="w-5 h-5" />
        Statut Premium Activé
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Prochaines étapes */}
      <div className="bg-[#111111] border border-[#232323] rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Prochaines étapes</h2>
        
        <div className="grid gap-6">
          {nextSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg">
              <div className="w-12 h-12 bg-[#ff0033]/10 rounded-lg flex items-center justify-center text-[#ff0033]">
                {step.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
              {step.link ? (
                <button
                  onClick={() => router.push(step.link)}
                  className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#cc0029] transition-colors flex items-center gap-2"
                >
                  {step.action}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-[#ff0033] font-medium">{step.action}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Informations importantes */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
        <h3 className="text-blue-400 font-semibold mb-2">Informations importantes</h3>
        <ul className="text-blue-300 text-sm space-y-1 text-left">
          <li>• Votre facture sera envoyée par email dans les prochaines minutes</li>
          <li>• L'accès premium est activé immédiatement</li>
          <li>• Vous pouvez annuler votre abonnement à tout moment depuis vos paramètres</li>
          <li>• Notre support prioritaire est disponible 24h/24</li>
        </ul>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => router.push('/outils')}
          className="bg-gradient-to-r from-[#ff0033] to-[#cc0029] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#cc0029] hover:to-[#990022] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Commencer à créer
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => router.push('/compte')}
          className="bg-[#232323] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#333333] transition-colors"
        >
          Gérer mon compte
        </button>
      </div>

      {/* Support */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 text-sm mb-2">
          Besoin d'aide ? Notre équipe est là pour vous accompagner.
        </p>
        <a 
          href="mailto:support@dropskills.com" 
          className="text-[#ff0033] hover:underline font-medium"
        >
          Contacter le support premium
        </a>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <LayoutWithSidebar>
      <Suspense fallback={
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0033] mx-auto"></div>
          <p className="text-gray-400 mt-4">Chargement...</p>
        </div>
      }>
        <CheckoutSuccessContent />
      </Suspense>
    </LayoutWithSidebar>
  );
} 