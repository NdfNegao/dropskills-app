'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MentorCard, { MentorData } from './MentorCard';

interface MentorGridProps {
  mentors: MentorData[];
  className?: string;
}

const FILTER_CATEGORIES = [
  { id: 'all', label: 'Tous les mentors', icon: Users },
  { id: 'copywriting', label: 'Copywriting', icon: Sparkles },
  { id: 'marketing', label: 'Marketing', icon: Sparkles },
  { id: 'business', label: 'Business', icon: Sparkles },
  { id: 'content', label: 'Contenu', icon: Sparkles },
  { id: 'email', label: 'Email Marketing', icon: Sparkles },
  { id: 'video', label: 'Vidéo', icon: Sparkles },
  { id: 'analytics', label: 'Analytics', icon: Sparkles },
  { id: 'branding', label: 'Branding', icon: Sparkles },
  { id: 'growth', label: 'Growth Hacking', icon: Sparkles },
  { id: 'innovation', label: 'Innovation', icon: Sparkles },
  { id: 'community', label: 'Community', icon: Sparkles },
  { id: 'communication', label: 'Communication', icon: Sparkles },
];

export default function MentorGrid({ mentors, className }: MentorGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrage des mentors
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           mentor.expertise.some(skill => 
                             skill.toLowerCase().includes(selectedCategory.toLowerCase())
                           );
    
    return matchesSearch && matchesCategory;
  });

  // Statistiques
  const stats = [
    {
      icon: <Users className="w-5 h-5 text-blue-400" />,
      label: 'Mentors disponibles',
      value: mentors.length,
      description: 'Experts IA spécialisés'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      label: 'Conversations actives',
      value: mentors.reduce((acc, mentor) => acc + (mentor.conversationCount || 0), 0).toLocaleString(),
      description: 'Échanges en cours'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      label: 'Domaines couverts',
      value: new Set(mentors.flatMap(mentor => mentor.expertise)).size,
      description: 'Spécialités expertes'
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {stat.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Choisissez votre mentor IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un mentor ou une expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
            
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-wrap gap-2"
              >
                {FILTER_CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="gap-2"
                    >
                      <IconComponent className="w-3 h-3" />
                      {category.label}
                    </Button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Résultats de recherche */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="text-sm text-muted-foreground">
              {filteredMentors.length} mentor{filteredMentors.length > 1 ? 's' : ''} trouvé{filteredMentors.length > 1 ? 's' : ''}
              {searchTerm && ` pour "${searchTerm}"`}
              {selectedCategory !== 'all' && ` dans la catégorie "${FILTER_CATEGORIES.find(c => c.id === selectedCategory)?.label}"`}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grille des mentors */}
      {filteredMentors.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MentorCard mentor={mentor} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Aucun mentor trouvé
            </h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche ou de filtrage.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}