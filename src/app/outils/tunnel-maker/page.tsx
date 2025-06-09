'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { TunnelWizard } from '@/components/TunnelWizard';
import { TunnelFormData, TunnelAnalysis } from '@/types/tunnel';
import { Copy, RefreshCw, CheckCircle, Target, TrendingUp, Mail, BarChart3, Zap, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

function TunnelMakerContent() {
  const [tunnelResult, setTunnelResult] = useState<TunnelAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(true);
// Removed unused state variable currentFormData

  const handleTunnelComplete = async (formData: TunnelFormData) => {
// Remove this line since currentFormData state and setter were removed
    setIsLoading(true);
    setShowWizard(false);
    
    // Simulation d'une génération IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Résultat simulé basé sur les données du formulaire
    const mockResult: TunnelAnalysis = {
      schemaTunnel: {
        etapes: [
          "Page de capture",
          "Email de bienvenue",
          "Séquence de nurturing",
          "Page de vente",
          "Suivi post-achat"
        ],
        description: `Tunnel optimisé pour ${formData.objectifTunnel} avec une audience ${formData.maturiteAudience}`,
        dureeEstimee: "7-14 jours"
      },
      etapesDetaillees: [
        {
          nom: "Page de capture",
          objectif: "Collecter les coordonnées des prospects qualifiés",
          messageCle: `Découvrez comment ${formData.offreProduitService} peut transformer votre business`,
          callToAction: "Télécharger le guide gratuit",
          objectionALever: "Pourquoi donner mon email ?",
          conseilsCopywriting: [
            "Utilisez un titre accrocheur avec bénéfice clair",
            "Ajoutez des preuves sociales (témoignages, logos)",
            "Minimisez le formulaire (email + prénom suffisent)"
          ],
          automatisationSuggestions: [
            "Redirection automatique vers page de remerciement",
            "Envoi immédiat de l'email de bienvenue",
            "Tag automatique dans votre CRM"
          ]
        },
        {
          nom: "Email de bienvenue",
          objectif: "Établir la relation et livrer la valeur promise",
          messageCle: "Bienvenue ! Voici votre guide + bonus exclusif",
          callToAction: "Lire le guide maintenant",
          objectionALever: "Est-ce que ça va vraiment m'aider ?",
          conseilsCopywriting: [
            "Remerciez chaleureusement",
            "Livrez immédiatement la valeur promise",
            "Teasez le contenu à venir"
          ],
          automatisationSuggestions: [
            "Envoi automatique 5 minutes après inscription",
            "Tracking d'ouverture et de clic",
            "Segmentation selon l'engagement"
          ]
        },
        {
          nom: "Séquence de nurturing",
          objectif: "Éduquer, créer la confiance et préparer à l'achat",
          messageCle: "Conseils exclusifs + témoignages clients",
          callToAction: "Découvrir l'offre complète",
          objectionALever: "Ai-je vraiment besoin de cette solution ?",
          conseilsCopywriting: [
            "Partagez des conseils actionnables",
            "Incluez des témoignages authentiques",
            "Adressez les objections principales"
          ],
          automatisationSuggestions: [
            "Séquence de 5-7 emails sur 10 jours",
            "Scoring comportemental",
            "Segmentation par intérêt"
          ]
        },
        {
          nom: "Page de vente",
          objectif: "Convertir les prospects en clients",
          messageCle: `${formData.offreProduitService} : La solution complète pour atteindre vos objectifs`,
          callToAction: "Commander maintenant",
          objectionALever: "Est-ce que ça vaut le prix ?",
          conseilsCopywriting: [
            "Structure AIDA (Attention, Intérêt, Désir, Action)",
            "Preuves sociales nombreuses",
            "Garantie satisfait ou remboursé"
          ],
          automatisationSuggestions: [
            "Tracking du comportement sur la page",
            "Pop-up de sortie avec offre spéciale",
            "Remarketing pour les visiteurs non-convertis"
          ]
        }
      ],
      conseilsGeneraux: {
        copywriting: [
          "Focalisez sur les bénéfices, pas les caractéristiques",
          "Utilisez un langage simple et direct",
          "Créez de l'urgence sans être agressif",
          "Testez différentes versions de vos messages"
        ],
        automatisation: [
          "Configurez le tracking sur toutes les étapes",
          "Mettez en place des alertes pour les actions importantes",
          "Automatisez le suivi des prospects non-convertis",
          "Intégrez votre CRM pour un suivi optimal"
        ],
        optimisation: [
          "Analysez les métriques chaque semaine",
          "Testez A/B vos pages principales",
          "Optimisez pour mobile en priorité",
          "Réduisez les frictions à chaque étape"
        ]
      },
      sequenceEmail: {
        description: "Séquence de 7 emails sur 14 jours pour maximiser les conversions",
        emails: [
          {
            jour: 0,
            sujet: "🎉 Bienvenue ! Votre guide est prêt",
            objectif: "Livrer la valeur et établir la relation",
            contenuCle: "Guide + bonus + présentation personnelle"
          },
          {
            jour: 2,
            sujet: "Le secret que 90% des entrepreneurs ignorent",
            objectif: "Éduquer et créer de la valeur",
            contenuCle: "Conseil exclusif + cas d'étude"
          },
          {
            jour: 4,
            sujet: "Comment [Client] a multiplié ses résultats par 3",
            objectif: "Prouver l'efficacité avec un témoignage",
            contenuCle: "Témoignage détaillé + résultats chiffrés"
          },
          {
            jour: 7,
            sujet: "Prêt(e) à passer au niveau supérieur ?",
            objectif: "Présenter l'offre principale",
            contenuCle: "Présentation de l'offre + bénéfices"
          },
          {
            jour: 10,
            sujet: "Les 3 erreurs qui coûtent cher (et comment les éviter)",
            objectif: "Lever les objections",
            contenuCle: "Erreurs communes + solutions"
          },
          {
            jour: 12,
            sujet: "Dernières heures pour profiter de cette offre",
            objectif: "Créer l'urgence",
            contenuCle: "Rappel de l'offre + urgence + garantie"
          },
          {
            jour: 14,
            sujet: "On se dit au revoir ?",
            objectif: "Dernière chance",
            contenuCle: "Email de rupture + dernière opportunité"
          }
        ]
      },
      metriques: {
        tauxConversionEstime: formData.maturiteAudience.includes('chaude') ? 15 : 8,
        complexite: formData.longueurTunnel.includes('Long') ? 8 : 5,
        potentielROI: parseInt(formData.budgetCible.replace(/[^0-9]/g, '')) > 5000 ? 9 : 6
      },
      outilsRecommandes: [
        "ConvertKit / Mailchimp",
        "Leadpages / Unbounce",
        "Google Analytics",
        "Hotjar / Crazy Egg",
        "Calendly",
        "Stripe / PayPal",
        "Zapier",
        "Facebook Pixel"
      ]
    };
    
    setTunnelResult(mockResult);
    setIsLoading(false);
  };

  const handleRestart = () => {
    setShowWizard(true);
    setTunnelResult(null);
// Remove this line since currentFormData state was removed
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (showWizard) {
    return (
      <TunnelWizard 
        onComplete={handleTunnelComplete}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Target className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Tunnel de Vente Généré</h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Votre tunnel de vente personnalisé est prêt ! Découvrez chaque étape optimisée pour maximiser vos conversions.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Génération de votre tunnel en cours...</p>
        </div>
      ) : tunnelResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Schéma du tunnel */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Schéma du Tunnel</h2>
            </div>
            <p className="text-gray-400 mb-4">{tunnelResult.schemaTunnel.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tunnelResult.schemaTunnel.etapes.map((etape, index) => (
                <div key={index} className="flex items-center">
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm border border-blue-500/30">
                    {index + 1}. {etape}
                  </span>
                  {index < tunnelResult.schemaTunnel.etapes.length - 1 && (
                    <span className="mx-2 text-gray-600">→</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">Durée estimée: {tunnelResult.schemaTunnel.dureeEstimee}</p>
          </div>

          {/* Étapes détaillées */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Étapes Détaillées</h2>
            </div>
            <div className="space-y-6">
              {tunnelResult.etapesDetaillees.map((etape, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{etape.nom}</h3>
                  <p className="text-gray-400 mb-3">{etape.objectif}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Message clé:</h4>
                      <p className="text-sm text-gray-400 mb-3">{etape.messageCle}</p>
                      
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Call-to-Action:</h4>
                      <p className="text-sm text-blue-400 mb-3">{etape.callToAction}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Objection à lever:</h4>
                      <p className="text-sm text-gray-400 mb-3">{etape.objectionALever}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Conseils Copywriting:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {etape.conseilsCopywriting.map((conseil, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            {conseil}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Automatisation:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {etape.automatisationSuggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Séquence d'emails */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Séquence d'Emails</h2>
            </div>
            <p className="text-gray-400 mb-4">{tunnelResult.sequenceEmail.description}</p>
            <div className="space-y-3">
              {tunnelResult.sequenceEmail.emails.map((email, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{email.sujet}</h3>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">
                      Jour {email.jour}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{email.objectif}</p>
                  <p className="text-sm text-gray-500">{email.contenuCle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conseils généraux */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-semibold text-white">Conseils Généraux</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-white mb-3">Copywriting</h3>
                <ul className="space-y-2">
                  {tunnelResult.conseilsGeneraux.copywriting.map((conseil, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      {conseil}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-3">Automatisation</h3>
                <ul className="space-y-2">
                  {tunnelResult.conseilsGeneraux.automatisation.map((conseil, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                      {conseil}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-3">Optimisation</h3>
                <ul className="space-y-2">
                  {tunnelResult.conseilsGeneraux.optimisation.map((conseil, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                      {conseil}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Métriques et outils */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Métriques Estimées</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Taux de conversion:</span>
                  <span className="text-green-400 font-medium">{tunnelResult.metriques.tauxConversionEstime}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Complexité:</span>
                  <span className="text-yellow-400 font-medium">{tunnelResult.metriques.complexite}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Potentiel ROI:</span>
                  <span className="text-blue-400 font-medium">{tunnelResult.metriques.potentielROI}/10</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Outils Recommandés</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tunnelResult.outilsRecommandes.map((outil, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm border border-blue-500/30">
                    {outil}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => copyToClipboard(JSON.stringify(tunnelResult, null, 2))}
              className="flex-1 bg-[#1a1a1a] text-white py-3 px-6 rounded-lg hover:bg-[#232323] transition-colors flex items-center justify-center gap-2 border border-gray-700"
            >
              <Copy className="w-4 h-4" />
              Copier le Tunnel
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Nouveau Tunnel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function TunnelMakerPage() {
  const stats = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Tunnels créés",
      value: "3,247",
      color: "text-blue-400",
      description: "Tunnels générés"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Conversion",
      value: "23.4%",
      color: "text-green-400",
      description: "Taux moyen"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Leads générés",
      value: "89K+",
      color: "text-purple-400",
      description: "Prospects qualifiés"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "CA généré",
      value: "€1.8M",
      color: "text-orange-400",
      description: "Chiffre d'affaires"
    }
  ];

  return (
    <ToolLayout toolId="tunnel-maker">
      <PremiumGuard feature="Tunnel Maker IA">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-1 ${stat.color}`}>
                {stat.icon}
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
        <TunnelMakerContent />
      </PremiumGuard>
    </ToolLayout>
  );
}