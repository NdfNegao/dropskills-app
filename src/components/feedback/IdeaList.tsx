'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThumbsUp, ThumbsDown, MessageSquare, Filter, ArrowUpDown } from 'lucide-react';

type Idea = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'declined';
  user_id: string;
  votes_count: number;
  created_at: string;
  user: {
    email: string;
  };
};

type IdeaVote = {
  id: string;
  idea_id: string;
  user_id: string;
  value: number;
  created_at: string;
};

export default function IdeaList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('votes');
  const supabase = createClientComponentClient();

  const fetchIdeas = async () => {
    try {
      let query = supabase
        .from('ideas')
        .select(`
          *,
          user:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Sort ideas
      const sortedIdeas = [...data].sort((a, b) => {
        if (sort === 'votes') {
          return b.votes_count - a.votes_count;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setIdeas(sortedIdeas);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (ideaId: string, value: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('handle_idea_vote', {
        p_idea_id: ideaId,
        p_vote_value: value
      });

      if (error) throw error;

      // Refresh ideas after vote
      fetchIdeas();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'declined':
        return 'Refusé';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="declined">Refusé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votes">Votes</SelectItem>
              <SelectItem value="recent">Plus récent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{idea.title}</h3>
                  <p className="text-gray-600 mt-1">{idea.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(idea.status)}`}>
                  {getStatusLabel(idea.status)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(idea.id, 1)}
                    className="flex items-center space-x-1"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{idea.votes_count}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(idea.id, -1)}
                    className="flex items-center space-x-1"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Proposé par {idea.user?.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 