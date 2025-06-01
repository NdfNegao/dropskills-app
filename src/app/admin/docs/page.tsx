'use client';

import { useState } from 'react';
import { HelpCircle, Book, Code, Users, Database, Shield, Settings, ExternalLink, Search } from 'lucide-react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export default function AdminDocsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Prise en main',
      description: 'Guide de démarrage pour les nouveaux administrateurs',
      icon: <Book className="h-6 w-6" />,
      articles: [
        {
          id: 'admin-overview',
          title: 'Vue d\'ensemble du panneau admin',
          description: 'Introduction aux fonctionnalités principales',
          readTime: '5 min',
          difficulty: 'beginner',
          tags: ['introduction', 'navigation']
        },
        {
          id: 'first-steps',
          title: 'Premiers pas',
          description: 'Configuration initiale et premières actions',
          readTime: '10 min',
          difficulty: 'beginner',
          tags: ['configuration', 'setup']
        },
        {
          id: 'dashboard-guide',
          title: 'Comprendre le tableau de bord',
          description: 'Analyse des métriques et statistiques',
          readTime: '8 min',
          difficulty: 'beginner',
          tags: ['dashboard', 'analytics']
        }
      ]
    },
    {
      id: 'user-management',
      title: 'Gestion des utilisateurs',
      description: 'Administration des comptes et permissions',
      icon: <Users className="h-6 w-6" />,
      articles: [
        {
          id: 'user-roles',
          title: 'Rôles et permissions',
          description: 'Comprendre le système de rôles',
          readTime: '12 min',
          difficulty: 'intermediate',
          tags: ['permissions', 'roles', 'security']
        },
        {
          id: 'user-moderation',
          title: 'Modération des utilisateurs',
          description: 'Suspendre, bannir et gérer les comptes',
          readTime: '15 min',
          difficulty: 'intermediate',
          tags: ['moderation', 'suspension']
        },
        {
          id: 'bulk-operations',
          title: 'Opérations en masse',
          description: 'Gérer plusieurs utilisateurs simultanément',
          readTime: '10 min',
          difficulty: 'advanced',
          tags: ['bulk', 'automation']
        }
      ]
    },
    {
      id: 'content-management',
      title: 'Gestion du contenu',
      description: 'Produits, formations et outils IA',
      icon: <Code className="h-6 w-6" />,
      articles: [
        {
          id: 'product-creation',
          title: 'Créer un nouveau produit',
          description: 'Guide complet de création de produit',
          readTime: '20 min',
          difficulty: 'intermediate',
          tags: ['products', 'creation']
        },
        {
          id: 'ai-tools-management',
          title: 'Gestion des outils IA',
          description: 'Ajouter et configurer les outils IA',
          readTime: '18 min',
          difficulty: 'advanced',
          tags: ['ai-tools', 'configuration']
        },
        {
          id: 'content-moderation',
          title: 'Modération du contenu',
          description: 'Valider et modérer le contenu utilisateur',
          readTime: '12 min',
          difficulty: 'intermediate',
          tags: ['moderation', 'content']
        }
      ]
    },
    {
      id: 'system-admin',
      title: 'Administration système',
      description: 'Configuration avancée et maintenance',
      icon: <Settings className="h-6 w-6" />,
      articles: [
        {
          id: 'system-settings',
          title: 'Paramètres système',
          description: 'Configuration générale de l\'application',
          readTime: '15 min',
          difficulty: 'advanced',
          tags: ['settings', 'configuration']
        },
        {
          id: 'backup-restore',
          title: 'Sauvegarde et restauration',
          description: 'Procédures de sauvegarde et récupération',
          readTime: '25 min',
          difficulty: 'advanced',
          tags: ['backup', 'restore', 'maintenance']
        },
        {
          id: 'performance-monitoring',
          title: 'Monitoring des performances',
          description: 'Surveiller et optimiser les performances',
          readTime: '20 min',
          difficulty: 'advanced',
          tags: ['monitoring', 'performance']
        }
      ]
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Protection et sécurisation de la plateforme',
      icon: <Shield className="h-6 w-6" />,
      articles: [
        {
          id: 'security-best-practices',
          title: 'Bonnes pratiques de sécurité',
          description: 'Recommandations pour sécuriser la plateforme',
          readTime: '18 min',
          difficulty: 'intermediate',
          tags: ['security', 'best-practices']
        },
        {
          id: 'incident-response',
          title: 'Réponse aux incidents',
          description: 'Procédures en cas d\'incident de sécurité',
          readTime: '22 min',
          difficulty: 'advanced',
          tags: ['security', 'incident', 'response']
        },
        {
          id: 'audit-logs',
          title: 'Logs d\'audit',
          description: 'Comprendre et analyser les logs de sécurité',
          readTime: '16 min',
          difficulty: 'intermediate',
          tags: ['audit', 'logs', 'monitoring']
        }
      ]
    },
    {
      id: 'database',
      title: 'Base de données',
      description: 'Gestion et maintenance de la base de données',
      icon: <Database className="h-6 w-6" />,
      articles: [
        {
          id: 'database-maintenance',
          title: 'Maintenance de la base de données',
          description: 'Optimisation et nettoyage régulier',
          readTime: '30 min',
          difficulty: 'advanced',
          tags: ['database', 'maintenance', 'optimization']
        },
        {
          id: 'data-migration',
          title: 'Migration de données',
          description: 'Procédures de migration et mise à jour',
          readTime: '35 min',
          difficulty: 'advanced',
          tags: ['migration', 'database', 'update']
        },
        {
          id: 'query-optimization',
          title: 'Optimisation des requêtes',
          description: 'Améliorer les performances des requêtes',
          readTime: '25 min',
          difficulty: 'advanced',
          tags: ['optimization', 'queries', 'performance']
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Débutant';
      case 'intermediate':
        return 'Intermédiaire';
      case 'advanced':
        return 'Avancé';
      default:
        return difficulty;
    }
  };

  const filteredSections = docSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(section => section.articles.length > 0 || searchTerm === '');

  const statsData = [
    {
      title: "Articles",
      value: docSections.reduce((total, section) => total + section.articles.length, 0).toString(),
      icon: <Book size={24} />
    },
    {
      title: "Sections",
      value: docSections.length.toString(),
      icon: <HelpCircle size={24} />
    },
    {
      title: "Temps de lecture",
      value: "~4h",
      icon: <Book size={24} />
    },
    {
      title: "Dernière MAJ",
      value: "2j ago",
      icon: <Book size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<HelpCircle size={24} />}
      title="Documentation"
      subtitle="Guide d'administration et ressources"
      stats={statsData}
    >
        <div className="space-y-6">
          {/* Barre de recherche */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Rechercher dans la documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-background text-foreground"
              />
          </div>
        </div>

        {/* Liens rapides */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liens rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="#"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">API Documentation</div>
                <div className="text-sm text-gray-600">Documentation technique de l'API</div>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Guide de déploiement</div>
                <div className="text-sm text-gray-600">Instructions de mise en production</div>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">Changelog</div>
                <div className="text-sm text-gray-600">Historique des mises à jour</div>
              </div>
            </a>
          </div>
        </div>

        {/* Sections de documentation */}
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-blue-600">{section.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                <p className="text-gray-600">{section.description}</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.articles.map((article) => (
                    <div
                      key={article.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedSection(article.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{article.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                          {getDifficultyLabel(article.difficulty)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{article.readTime}</span>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{article.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {searchTerm && filteredSections.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600">
              Aucun article ne correspond à votre recherche "{searchTerm}". Essayez avec d'autres mots-clés.
            </p>
          </div>
        )}

        {/* Section d'aide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Besoin d'aide supplémentaire ?</h3>
              <p className="text-blue-800 mb-4">
                Si vous ne trouvez pas la réponse à votre question dans cette documentation, 
                n'hésitez pas à nous contacter directement.
              </p>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Contacter le support
                </button>
                <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  Suggérer une amélioration
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
    </AdminLayoutWithSidebar>
  );
}