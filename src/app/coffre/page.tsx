'use client';

import { useState } from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { 
  Shield, 
  Plus, 
  Search, 
  Filter,
  Download,
  Share2,
  Trash2,
  Edit,
  Eye,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Star,
  Clock,
  FolderPlus,
  Folder,
  Grid3X3,
  List,
  SortAsc,
  MoreVertical
} from 'lucide-react';

interface CoffreItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'generated';
  size: string;
  createdAt: string;
  modifiedAt: string;
  folder: string;
  isFavorite: boolean;
  isShared: boolean;
  thumbnail?: string;
  description?: string;
  tags: string[];
  source?: string; // Pour les contenus générés par IA
}

const MOCK_ITEMS: CoffreItem[] = [
  {
    id: '1',
    name: 'Offre E-commerce Premium.pdf',
    type: 'generated',
    size: '2.4 MB',
    createdAt: '2024-01-15',
    modifiedAt: '2024-01-15',
    folder: 'Offres IA',
    isFavorite: true,
    isShared: false,
    description: 'Offre commerciale générée pour boutique e-commerce',
    tags: ['e-commerce', 'offre', 'IA'],
    source: 'Générateur d\'Offre IA'
  },
  {
    id: '2',
    name: 'Titres YouTube - Tech.txt',
    type: 'generated',
    size: '15 KB',
    createdAt: '2024-01-14',
    modifiedAt: '2024-01-14',
    folder: 'Titres IA',
    isFavorite: false,
    isShared: true,
    description: '10 titres optimisés pour chaîne tech YouTube',
    tags: ['youtube', 'tech', 'titres'],
    source: 'Générateur de Titres IA'
  },
  {
    id: '3',
    name: 'Plan Contenu Janvier 2024.xlsx',
    type: 'generated',
    size: '890 KB',
    createdAt: '2024-01-13',
    modifiedAt: '2024-01-13',
    folder: 'Planification',
    isFavorite: true,
    isShared: false,
    description: 'Calendrier éditorial 4 semaines multi-plateformes',
    tags: ['contenu', 'planification', 'calendrier'],
    source: 'Content System IA'
  },
  {
    id: '4',
    name: 'Logo Dropskills V2.png',
    type: 'image',
    size: '456 KB',
    createdAt: '2024-01-12',
    modifiedAt: '2024-01-12',
    folder: 'Assets',
    isFavorite: false,
    isShared: false,
    description: 'Nouveau logo vectoriel haute résolution',
    tags: ['logo', 'branding', 'design']
  },
  {
    id: '5',
    name: 'Tutoriel Outils IA.mp4',
    type: 'video',
    size: '125 MB',
    createdAt: '2024-01-10',
    modifiedAt: '2024-01-10',
    folder: 'Tutoriels',
    isFavorite: true,
    isShared: true,
    description: 'Guide complet d\'utilisation des outils IA',
    tags: ['tutoriel', 'IA', 'formation']
  },
  {
    id: '6',
    name: 'Backup Données Client.zip',
    type: 'archive',
    size: '45 MB',
    createdAt: '2024-01-08',
    modifiedAt: '2024-01-08',
    folder: 'Sauvegardes',
    isFavorite: false,
    isShared: false,
    description: 'Sauvegarde complète base de données clients',
    tags: ['backup', 'données', 'sécurité']
  }
];

const FOLDERS = ['Tous', 'Offres IA', 'Titres IA', 'Planification', 'Assets', 'Tutoriels', 'Sauvegardes'];
const FILE_TYPES = ['Tous', 'generated', 'document', 'image', 'video', 'audio', 'archive'];

export default function CoffrePage() {
  const [items, setItems] = useState<CoffreItem[]>(MOCK_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('Tous');
  const [selectedType, setSelectedType] = useState('Tous');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = selectedFolder === 'Tous' || item.folder === selectedFolder;
    const matchesType = selectedType === 'Tous' || item.type === selectedType;
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;
    
    return matchesSearch && matchesFolder && matchesType && matchesFavorites;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return parseFloat(a.size) - parseFloat(b.size);
      case 'date':
      default:
        return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
    }
  });

  const toggleFavorite = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const deleteItem = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
      case 'generated':
        return <FileText className="w-6 h-6" />;
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'audio':
        return <Music className="w-6 h-6" />;
      case 'archive':
        return <Archive className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'generated':
        return 'from-purple-500 to-purple-600';
      case 'document':
        return 'from-blue-500 to-blue-600';
      case 'image':
        return 'from-green-500 to-green-600';
      case 'video':
        return 'from-red-500 to-red-600';
      case 'audio':
        return 'from-yellow-500 to-yellow-600';
      case 'archive':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const stats = {
    totalItems: items.length,
    totalSize: items.reduce((sum, item) => sum + parseFloat(item.size), 0).toFixed(1),
    generatedItems: items.filter(item => item.type === 'generated').length,
    favoriteItems: items.filter(item => item.isFavorite).length
  };

  return (
    <LayoutWithSidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff0033] to-[#cc0029] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mon Coffre-Fort</h1>
              <p className="text-gray-400">Stockez et organisez vos créations en toute sécurité</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Fichiers</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalItems}</div>
              <div className="text-xs text-gray-400">éléments stockés</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <Archive className="w-4 h-4" />
                <span className="text-sm font-medium">Espace</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalSize} MB</div>
              <div className="text-xs text-gray-400">utilisés sur 1 GB</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">IA Générés</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.generatedItems}</div>
              <div className="text-xs text-gray-400">créations IA</div>
            </div>
            
            <div className="bg-[#111111] border border-[#232323] rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Favoris</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.favoriteItems}</div>
              <div className="text-xs text-gray-400">éléments favoris</div>
            </div>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="bg-[#111111] border border-[#232323] rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher dans le coffre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ff0033]"
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              >
                {FOLDERS.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              >
                {FILE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type === 'Tous' ? 'Tous types' : 
                     type === 'generated' ? 'IA Générés' :
                     type === 'document' ? 'Documents' :
                     type === 'image' ? 'Images' :
                     type === 'video' ? 'Vidéos' :
                     type === 'audio' ? 'Audio' :
                     type === 'archive' ? 'Archives' : type}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff0033]"
              >
                <option value="date">Date</option>
                <option value="name">Nom</option>
                <option value="size">Taille</option>
              </select>

              <label className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                  className="w-4 h-4 text-[#ff0033] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#ff0033]"
                />
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Favoris</span>
              </label>

              {/* Mode d'affichage */}
              <div className="flex bg-[#1a1a1a] border border-[#333] rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-[#ff0033] text-white' : 'text-gray-400'} rounded-l-lg transition-colors`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-[#ff0033] text-white' : 'text-gray-400'} rounded-r-lg transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Bouton d'ajout */}
              <button className="bg-[#ff0033] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#cc0029] transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Mes fichiers ({filteredItems.length})
            </h2>
          </div>

          {filteredItems.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                  <FileCard key={item.id} item={item} onToggleFavorite={toggleFavorite} onDelete={deleteItem} getFileIcon={getFileIcon} getTypeColor={getTypeColor} />
                ))}
              </div>
            ) : (
              <div className="bg-[#111111] border border-[#232323] rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#232323] text-sm font-medium text-gray-400">
                  <div className="col-span-5">Nom</div>
                  <div className="col-span-2">Taille</div>
                  <div className="col-span-2">Modifié</div>
                  <div className="col-span-2">Dossier</div>
                  <div className="col-span-1">Actions</div>
                </div>
                {filteredItems.map(item => (
                  <FileRow key={item.id} item={item} onToggleFavorite={toggleFavorite} onDelete={deleteItem} getFileIcon={getFileIcon} />
                ))}
              </div>
            )
          ) : (
            <div className="bg-[#111111] border border-[#232323] rounded-xl p-12 text-center">
              <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Aucun fichier trouvé</p>
              <p className="text-gray-500 text-sm">
                Essayez de modifier vos filtres ou ajoutez de nouveaux fichiers
              </p>
            </div>
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

interface FileCardProps {
  item: CoffreItem;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  getFileIcon: (type: string) => React.ReactNode;
  getTypeColor: (type: string) => string;
}

function FileCard({ item, onToggleFavorite, onDelete, getFileIcon, getTypeColor }: FileCardProps) {
  return (
    <div className="bg-[#111111] border border-[#232323] rounded-xl overflow-hidden hover:border-[#ff0033]/30 transition-colors">
      {/* Header */}
      <div className={`relative h-32 bg-gradient-to-br ${getTypeColor(item.type)} flex items-center justify-center`}>
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white">
          {getFileIcon(item.type)}
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.type === 'generated' && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              IA
            </span>
          )}
          {item.isShared && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Partagé
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            onClick={() => onToggleFavorite(item.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              item.isFavorite ? 'bg-yellow-500 text-white' : 'bg-black/20 text-white/60 hover:bg-black/40'
            }`}
          >
            <Star className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Nom et taille */}
        <div className="mb-3">
          <h3 className="text-white font-medium mb-1 truncate" title={item.name}>
            {item.name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{item.size}</span>
            <span>{new Date(item.modifiedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
        )}

        {/* Source IA */}
        {item.source && (
          <div className="mb-3">
            <span className="text-purple-400 text-xs bg-purple-400/10 px-2 py-1 rounded">
              {item.source}
            </span>
          </div>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-[#1a1a1a] text-gray-300 px-2 py-1 rounded text-xs">
                  #{tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-gray-500 text-xs px-2 py-1">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-[#ff0033] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-1">
            <Eye className="w-3 h-3" />
            Voir
          </button>
          <button className="bg-[#1a1a1a] text-gray-300 p-2 rounded-lg hover:bg-[#333] transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="bg-[#1a1a1a] text-gray-300 p-2 rounded-lg hover:bg-[#333] transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="bg-[#1a1a1a] text-red-400 p-2 rounded-lg hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface FileRowProps {
  item: CoffreItem;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  getFileIcon: (type: string) => React.ReactNode;
}

function FileRow({ item, onToggleFavorite, onDelete, getFileIcon }: FileRowProps) {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#232323] last:border-0 hover:bg-[#1a1a1a] transition-colors">
      <div className="col-span-5 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#333] rounded flex items-center justify-center text-gray-400">
          {getFileIcon(item.type)}
        </div>
        <div>
          <div className="text-white font-medium truncate">{item.name}</div>
          {item.source && (
            <div className="text-purple-400 text-xs">{item.source}</div>
          )}
        </div>
      </div>
      <div className="col-span-2 flex items-center text-gray-300">{item.size}</div>
      <div className="col-span-2 flex items-center text-gray-300">
        {new Date(item.modifiedAt).toLocaleDateString()}
      </div>
      <div className="col-span-2 flex items-center text-gray-300">{item.folder}</div>
      <div className="col-span-1 flex items-center gap-1">
        <button
          onClick={() => onToggleFavorite(item.id)}
          className={`p-1 rounded transition-colors ${
            item.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
          }`}
        >
          <Star className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-400 hover:text-white transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 