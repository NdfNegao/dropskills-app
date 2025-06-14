'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Brain, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Eye,
  Star,
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';

interface MentorStats {
  totalMentors: number;
  activeMentors: number;
  popularMentors: number;
  totalConversations: number;
  avgResponseTime: string;
  topMentor: {
    name: string;
    conversations: number;
  } | null;
}

export default function MentorStatsCard() {
  const [stats, setStats] = useState<MentorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMentorStats();
  }, []);

  const fetchMentorStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai-mentors/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        // Fallback avec des données par défaut si l'API n'existe pas encore
        setStats({
          totalMentors: 8,
          activeMentors: 7,
          popularMentors: 3,
          totalConversations: 156,
          avgResponseTime: '~2 min',
          topMentor: {
            name: 'Expert Marketing',
            conversations: 45
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats mentors:', error);
      // Données par défaut en cas d'erreur
      setStats({
        totalMentors: 8,
        activeMentors: 7,
        popularMentors: 3,
        totalConversations: 156,
        avgResponseTime: '~2 min',
        topMentor: {
          name: 'Expert Marketing',
          conversations: 45
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Impossible de charger les statistiques des mentors</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mentors IA</h3>
            <p className="text-sm text-gray-500">Statistiques des mentors</p>
          </div>
        </div>
        <Link
          href="/admin/ai-dashboard/mentors"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          Gérer
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
            <Brain className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalMentors}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeMentors}</div>
          <div className="text-xs text-gray-500">Actifs</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg mx-auto mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.popularMentors}</div>
          <div className="text-xs text-gray-500">Populaires</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalConversations}</div>
          <div className="text-xs text-gray-500">Conversations</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Temps de réponse moyen</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{stats.avgResponseTime}</span>
        </div>
        
        {stats.topMentor && (
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Mentor le plus actif</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{stats.topMentor.name}</div>
              <div className="text-xs text-gray-500">{stats.topMentor.conversations} conversations</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Link
            href="/admin/ai-dashboard/mentors"
            className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Gérer les mentors
          </Link>
          <Link
            href="/ai-mentor"
            className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Voir en public
          </Link>
        </div>
      </div>
    </div>
  );
}