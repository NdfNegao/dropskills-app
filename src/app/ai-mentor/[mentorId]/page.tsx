'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, Star, Lightbulb, TrendingUp, MessageCircle, Zap, PenTool, Target, Megaphone, Video, Mail, BarChart3, Palette, MessageSquare, Brain } from 'lucide-react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
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
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header avec titre et navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                {getIcon(mentor.icon)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Chat avec {mentor.name}</h1>
                <p className="text-muted-foreground">{mentor.description}</p>
              </div>
            </div>
            
            <Link 
              href="/ai-mentor"
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 text-sm font-medium group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Retour aux mentors</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-1 ${stat.color || 'text-blue-400'}`}>
                {stat.icon}
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interface de chat principale */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border h-full">
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
            <Card className="bg-card border-border">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xl">
                    {getIcon(mentor.icon)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{mentor.name}</h2>
                    {mentor.popular && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Populaire
                      </Badge>
                    )}
                  </div>
                </div>
              
                <p className="text-muted-foreground mb-4">{mentor.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Domaines d'expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className="text-muted-foreground border-border"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{mentor.conversationCount.toLocaleString()} conversations</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Répond en {mentor.estimatedResponseTime}</span>
                  </div>
                </div>
            </div>
          </Card>

            {/* Conseils d'utilisation */}
            <Card className="bg-card border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Conseils d'utilisation
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Soyez précis dans vos questions</li>
                  <li>• Donnez du contexte sur votre situation</li>
                  <li>• N'hésitez pas à demander des exemples</li>
                  <li>• Utilisez les suggestions pour commencer</li>
                </ul>
              </div>
            </Card>

            {/* Autres mentors */}
            {otherMentors.length > 0 && (
              <Card className="bg-card border-border">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    Autres mentors
                  </h3>
                  <div className="space-y-3">
                    {otherMentors.map((otherMentor) => (
                      <Link 
                        key={otherMentor.id}
                        href={`/ai-mentor/${otherMentor.id}`}
                        className="block p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-sm">
                            {getIcon(otherMentor.icon)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-foreground">
                              {otherMentor.name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
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
      </div>
    </LayoutWithSidebar>
  );
}