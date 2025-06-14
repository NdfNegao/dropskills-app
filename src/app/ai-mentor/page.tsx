'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, MessageSquare, Zap } from 'lucide-react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import PageBentoLayout from '@/components/PageBentoLayout';
import MentorGrid from '@/components/ai-mentor/MentorGrid';
import { Card, CardContent } from '@/components/ui/card';
import { AI_MENTORS } from '@/data/ai-mentors';
import { useAuth } from '@/hooks/useAuth';
import PremiumGuard from '@/components/auth/PremiumGuard';

const stats = [
  {
    icon: <Brain className="w-5 h-5 text-purple-400" />,
    label: 'Mentors IA',
    value: AI_MENTORS.length,
    description: 'Experts spécialisés'
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
    label: 'Conversations',
    value: '24/7',
    description: 'Disponibilité totale'
  },
  {
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    label: 'Réponse',
    value: '< 30s',
    description: 'Temps moyen'
  },
  {
    icon: <Sparkles className="w-5 h-5 text-green-400" />,
    label: 'Domaines',
    value: new Set(AI_MENTORS.flatMap(mentor => mentor.expertise)).size,
    description: 'Spécialités couvertes'
  }
];

export default function AIMentorPage() {
  const { canAccessPremium } = useAuth();

  return (
    <LayoutWithSidebar>
      <PremiumGuard>
        <PageBentoLayout
          icon={<Brain className="w-6 h-6 text-white" />}
          title="AI Mentor"
          subtitle="Votre équipe de mentors IA spécialisés, disponibles 24/7 pour vous accompagner"
          stats={stats}
          color="from-purple-500 to-indigo-600"
        >
          <div className="space-y-8">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        Votre équipe de mentors IA personnalisés
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        Chaque mentor est spécialisé dans un domaine précis et alimenté par les meilleures pratiques de Dropskills. 
                        Posez vos questions, obtenez des conseils personnalisés et accélérez votre croissance business.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Réponses instantanées et personnalisées</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>Expertise basée sur les formations Dropskills</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-600">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <span>Conversations sauvegardées et exportables</span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600">
                          <div className="w-2 h-2 bg-orange-500 rounded-full" />
                          <span>Intégration avec vos outils Dropskills</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Grille des mentors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MentorGrid mentors={AI_MENTORS} />
            </motion.div>

            {/* Call to action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Prêt à accélérer votre croissance ?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Choisissez le mentor qui correspond à vos besoins et commencez une conversation qui pourrait transformer votre business.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    💡 <strong>Astuce :</strong> Vous pouvez avoir plusieurs conversations en parallèle avec différents mentors pour une approche complète.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </PageBentoLayout>
      </PremiumGuard>
    </LayoutWithSidebar>
  );
}