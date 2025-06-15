'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, Star, Lightbulb, TrendingUp, MessageCircle, Zap, PenTool, Target, Megaphone, Video, Mail, BarChart3, Palette, MessageSquare, Brain } from 'lucide-react';
import PageBentoLayout from '@/components/PageBentoLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ai-mentor/ChatInterface';
import { AI_MENTORS, MENTOR_SUGGESTIONS } from '@/data/ai-mentors';
import { AIMentor } from '@/types/ai-mentor';
import { useSession } from 'next-auth/react';

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
    'Zap': Zap,
    'Brain': Brain
  };
  
  const IconComponent = iconMap[iconName] || MessageSquare;
  return <IconComponent className="w-6 h-6 text-white" />;
};

interface MentorPageProps {
  params: {
    mentorId: string;
  };
}

export default function MentorPage({ params }: MentorPageProps) {
  const { data: session } = useSession();
  const mentorData = AI_MENTORS.find(m => m.id === params.mentorId);
  const mentor = mentorData ? {
    ...mentorData,
    suggestedPrompts: MENTOR_SUGGESTIONS[mentorData.id] || []
  } : null;
  
  if (!mentor) {
    notFound();
  }

  // Vérifier l'accès premium
  const user = session?.user as any;
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Connexion Requise
          </h2>
          <p className="text-gray-400 mb-6">
            Vous devez être connecté pour accéder aux mentors IA.
          </p>
          <Link href="/auth/signin">
            <Button className="bg-red-600 hover:bg-red-700">
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user?.premium && user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Accès Premium Requis
          </h2>
          <p className="text-gray-400 mb-6">
            Les mentors IA sont une fonctionnalité premium. Mettez à niveau votre compte pour accéder à cette fonctionnalité.
          </p>
          <Link href="/premium">
            <Button className="bg-red-600 hover:bg-red-700">
              Découvrir Premium
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Statistiques simulées pour la démo
  const stats = [
    {
      label: 'Conversations actives',
      value: '1,234',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      label: 'Utilisateurs satisfaits',
      value: '98%',
      icon: <Star className="w-5 h-5" />,
      color: 'text-yellow-400'
    },
    {
      label: 'Temps de réponse moyen',
      value: mentor.estimatedResponseTime,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      label: 'Expertise',
      value: mentor.expertise.length.toString(),
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'text-purple-400'
    }
  ];

  // Autres mentors suggérés
  const otherMentors = AI_MENTORS.filter(m => m.id !== mentor.id).slice(0, 3);

  return (
    <PageBentoLayout
      title={`Chat avec ${mentor.name}`}
      description={mentor.description}
      stats={stats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interface de chat principale */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800 h-full">
            <ChatInterface 
              mentorId={mentor.id}
              mentor={mentor}
              initialMessages={[]}
            />
          </Card>
        </div>

        {/* Sidebar avec informations du mentor */}
        <div className="space-y-6">
          {/* Informations du mentor */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Link 
                  href="/ai-mentor"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xl">
                  {getIcon(mentor.icon)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{mentor.name}</h2>
                  {mentor.popular && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-gray-400 mb-4">{mentor.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Domaines d'expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="text-gray-300 border-gray-600"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{mentor.conversationCount.toLocaleString()} conversations</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Répond en {mentor.estimatedResponseTime}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Conseils d'utilisation */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Conseils d'utilisation
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Soyez précis dans vos questions</li>
                <li>• Donnez du contexte sur votre situation</li>
                <li>• N'hésitez pas à demander des exemples</li>
                <li>• Utilisez les suggestions pour commencer</li>
              </ul>
            </div>
          </Card>

          {/* Autres mentors */}
          {otherMentors.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  Autres mentors
                </h3>
                <div className="space-y-3">
                  {otherMentors.map((otherMentor) => (
                    <Link 
                      key={otherMentor.id}
                      href={`/ai-mentor/${otherMentor.id}`}
                      className="block p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm">
                          {getIcon(otherMentor.icon)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">
                            {otherMentor.name}
                          </h4>
                          <p className="text-xs text-gray-400 truncate">
                            {otherMentor.expertise.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageBentoLayout>
  );
}