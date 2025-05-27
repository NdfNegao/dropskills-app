'use client';

import { useState, useMemo } from 'react';
import { Download, RefreshCw, ArrowLeft, Calendar, Filter, Eye, Copy, CheckCircle, Image as ImageIcon, FileText, Video, Hash, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ContentAnalysis, ContentPost } from '@/app/outils/content-system/page';

interface ContentCalendarResultProps {
  analysis: ContentAnalysis;
  onBackToWizard: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const JOURS_SEMAINE = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export function ContentCalendarResult({ analysis, onBackToWizard, onRegenerate, isRegenerating }: ContentCalendarResultProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [selectedExample, setSelectedExample] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filtrer les posts
  const filteredPosts = useMemo(() => {
    return analysis.calendrierEditorial.filter(post => {
      const platformMatch = selectedPlatform === 'all' || post.plateforme === selectedPlatform;
      const formatMatch = selectedFormat === 'all' || post.format === selectedFormat;
      return platformMatch && formatMatch;
    });
  }, [analysis.calendrierEditorial, selectedPlatform, selectedFormat]);

  // Obtenir les plateformes et formats uniques
  const platforms = useMemo(() => {
    const uniquePlatforms = new Set(analysis.calendrierEditorial.map(post => post.plateforme));
    return Array.from(uniquePlatforms);
  }, [analysis.calendrierEditorial]);

  const formats = useMemo(() => {
    const uniqueFormats = new Set(analysis.calendrierEditorial.map(post => post.format));
    return Array.from(uniqueFormats);
  }, [analysis.calendrierEditorial]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      alert('Erreur lors de la copie');
    }
  };

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let csvContent = 'Date,Semaine,Type,Titre,Format,Plateforme,Objectif,CTA,Hashtags,Brief IA Image\n';
      
      analysis.calendrierEditorial.forEach(post => {
        const row = [
          post.date,
          post.semaine,
          post.typeContenu,
          `"${post.sujetTitre.replace(/"/g, '""')}"`,
          post.format,
          post.plateforme,
          `"${post.objectif.replace(/"/g, '""')}"`,
          `"${post.callToAction.replace(/"/g, '""')}"`,
          `"${(post.hashtags || []).join(', ')}"`,
          `"${(post.briefIAImage || '').replace(/"/g, '""')}"`
        ].join(',');
        
        csvContent += row + '\n';
      });
      
      const element = document.createElement('a');
      const file = new Blob([csvContent], { type: 'text/csv' });
      element.href = URL.createObjectURL(file);
      element.download = 'calendrier-editorial-90-jours.csv';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement');
    } finally {
      setIsDownloading(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'image':
      case 'carousel':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
      case 'reel':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return 'bg-blue-100 text-blue-800';
      case 'instagram':
        return 'bg-pink-100 text-pink-800';
      case 'tiktok':
        return 'bg-gray-900 text-white';
      case 'twitter/x':
        return 'bg-gray-100 text-gray-800';
      case 'facebook':
        return 'bg-blue-100 text-blue-900';
      case 'youtube':
        return 'bg-red-100 text-red-800';
      case 'newsletter':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonctions calendrier
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPostsForDate = (date: string) => {
    return filteredPosts.filter(post => post.date === date);
  };

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Jours vides au début
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-100"></div>);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const posts = getPostsForDate(date);
      
      days.push(
        <div key={day} className="p-2 border border-gray-200 min-h-[100px] hover:bg-gray-50">
          <div className="font-medium text-sm text-gray-700 mb-1">{day}</div>
          <div className="space-y-1">
            {posts.slice(0, 3).map((post, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPost(post)}
                className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getPlatformColor(post.plateforme)}`}
              >
                <div className="flex items-center gap-1">
                  {getFormatIcon(post.format)}
                  <span className="truncate">{post.sujetTitre}</span>
                </div>
              </div>
            ))}
            {posts.length > 3 && (
              <div className="text-xs text-gray-500">+{posts.length - 3} autres</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* Navigation mois */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold">
            {MOIS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {JOURS_SEMAINE.map(jour => (
            <div key={jour} className="text-center text-sm font-medium text-gray-600 p-2">
              {jour}
            </div>
          ))}
        </div>

        {/* Calendrier */}
        <div className="grid grid-cols-7 gap-0">
          {days}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const postsByWeek = filteredPosts.reduce((acc, post) => {
      if (!acc[post.semaine]) {
        acc[post.semaine] = [];
      }
      acc[post.semaine].push(post);
      return acc;
    }, {} as Record<number, ContentPost[]>);

    return (
      <div className="space-y-6">
        {Object.entries(postsByWeek).map(([semaine, posts]) => (
          <div key={semaine} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Semaine {semaine}</h3>
            <div className="space-y-2">
              {posts.map((post, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(post.plateforme)}`}>
                          {post.plateforme}
                        </span>
                        <span className="text-xs text-gray-500">{post.date}</span>
                        <div className="flex items-center gap-1 text-gray-600">
                          {getFormatIcon(post.format)}
                          <span className="text-xs">{post.format}</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900">{post.sujetTitre}</h4>
                      <p className="text-sm text-gray-600 mt-1">{post.objectif}</p>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📅 Votre Calendrier Éditorial est prêt !
            </h1>
            <p className="text-gray-600">
              {analysis.calendrierInfo.titre} - {analysis.calendrierInfo.nombrePosts} posts sur 90 jours
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onBackToWizard}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isRegenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Régénération...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Régénérer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {analysis.metriques.postsParSemaine}
            </div>
            <p className="text-sm text-gray-600 mt-1">Posts/semaine</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analysis.metriques.diversiteFormats}
            </div>
            <p className="text-sm text-gray-600 mt-1">Formats différents</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analysis.metriques.tauxEngagementEstime}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Engagement estimé</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analysis.metriques.porteeEstimee}
            </div>
            <p className="text-sm text-gray-600 mt-1">Portée estimée</p>
          </div>
        </div>
      </div>

      {/* Filtres et contrôles */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtres:</span>
            </div>
            
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Toutes les plateformes</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tous les formats</option>
              {formats.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Calendrier
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Vue calendrier ou liste */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
      </div>

      {/* Exemples de posts générés */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📝 Exemples de Posts Générés
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.exemplesPostsGeneres.map((exemple, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedExample(exemple)}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(exemple.plateforme)}`}>
                    {exemple.plateforme}
                  </span>
                  <span className="text-sm text-gray-500">{exemple.format}</span>
                </div>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{exemple.titre}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{exemple.contenu}</p>
              
              {exemple.instructionsVisuels && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <ImageIcon className="w-3 h-3 inline mr-1" />
                    Brief visuel disponible
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conseils de recyclage */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ♻️ Conseils de Recyclage de Contenu
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Cross-Platform</h3>
            <ul className="space-y-2">
              {analysis.conseilsRecyclage.crossPlatform.map((conseil, idx) => (
                <li key={idx} className="text-blue-800 text-sm flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">Adaptation</h3>
            <ul className="space-y-2">
              {analysis.conseilsRecyclage.adaptation.map((conseil, idx) => (
                <li key={idx} className="text-green-800 text-sm flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-3">Repurposing</h3>
            <ul className="space-y-2">
              {analysis.conseilsRecyclage.repurposing.map((conseil, idx) => (
                <li key={idx} className="text-purple-800 text-sm flex items-start">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {conseil}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Prêt à lancer votre stratégie de contenu ?
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadCSV}
            disabled={isDownloading}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Téléchargement...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Exporter en CSV</span>
              </>
            )}
          </button>
          
          <button
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ImageIcon className="w-5 h-5" />
            <span>Générer les visuels IA</span>
          </button>
          
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isRegenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Régénération...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Régénérer le calendrier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal détail post */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Détails du Post</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(selectedPost.plateforme)}`}>
                  {selectedPost.plateforme}
                </span>
                <span className="text-sm text-gray-500">{selectedPost.date}</span>
                <span className="text-sm text-gray-500">{selectedPost.format}</span>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedPost.sujetTitre}</h4>
                <p className="text-gray-600">{selectedPost.objectif}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Call-to-Action:</p>
                <p className="text-gray-900">{selectedPost.callToAction}</p>
              </div>
              
              {selectedPost.briefIAImage && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-700 mb-1">Brief IA Image:</p>
                  <p className="text-blue-900">{selectedPost.briefIAImage}</p>
                </div>
              )}
              
              {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPost.hashtags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => {
                  const content = `${selectedPost.sujetTitre}\n\n${selectedPost.callToAction}\n\n${selectedPost.hashtags?.map(tag => `#${tag}`).join(' ') || ''}`;
                  handleCopy(content, 'Post');
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {copiedText === 'Post' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier le contenu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal exemple post */}
      {selectedExample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Exemple de Post</h3>
              <button
                onClick={() => setSelectedExample(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(selectedExample.plateforme)}`}>
                  {selectedExample.plateforme}
                </span>
                <span className="text-sm text-gray-500">{selectedExample.format}</span>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedExample.titre}</h4>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-gray-800 text-sm">{selectedExample.contenu}</pre>
              </div>
              
              {selectedExample.instructionsVisuels && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-700 mb-2">Instructions pour les visuels:</p>
                  <p className="text-blue-900 text-sm">{selectedExample.instructionsVisuels}</p>
                </div>
              )}
              
              <button
                onClick={() => handleCopy(selectedExample.contenu, 'Exemple')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {copiedText === 'Exemple' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier le contenu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 