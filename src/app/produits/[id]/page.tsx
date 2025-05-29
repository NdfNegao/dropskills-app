'use client';

import { useParams } from 'next/navigation';
import ProductPageTemplate from '@/components/ProductPageTemplate';
import { PRODUCTS } from '@/data/products';
import { 
  FileText, 
  Zap, 
  Target, 
  Mail, 
  Sparkles,
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  Volume2,
  Clock,
  Layout,
  Calendar,
  BarChart,
  MessageSquare,
  FolderOpen,
  BookOpen,
  PenTool,
  CheckSquare,
  Layers,
  ExternalLink,
  Printer,
  Bot,
  Play,
  Download,
  Calculator,
  Presentation,
  Brain
} from 'lucide-react';

// Fonction pour convertir les noms d'icônes en composants
function getIconComponent(iconName: string) {
  const iconMap: { [key: string]: React.ReactNode } = {
    FileText: <FileText className="w-5 h-5" />,
    Target: <Target className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    Brain: <Brain className="w-5 h-5" />,
    TrendingUp: <TrendingUp className="w-5 h-5" />,
    CheckCircle: <CheckCircle className="w-5 h-5" />,
    Volume2: <Volume2 className="w-5 h-5" />,
    Clock: <Clock className="w-5 h-5" />,
    Mail: <Mail className="w-5 h-5" />,
    Sparkles: <Sparkles className="w-5 h-5" />,
    Shield: <Shield className="w-5 h-5" />,
    Layout: <Layout className="w-5 h-5" />,
    Calendar: <Calendar className="w-5 h-5" />,
    BarChart: <BarChart className="w-5 h-5" />,
    MessageSquare: <MessageSquare className="w-5 h-5" />,
    FolderOpen: <FolderOpen className="w-5 h-5" />,
    BookOpen: <BookOpen className="w-5 h-5" />,
    PenTool: <PenTool className="w-5 h-5" />,
    CheckSquare: <CheckSquare className="w-5 h-5" />,
    Layers: <Layers className="w-5 h-5" />,
    ExternalLink: <ExternalLink className="w-5 h-5" />,
    Printer: <Printer className="w-5 h-5" />,
    Bot: <Bot className="w-5 h-5" />,
    Play: <Play className="w-5 h-5" />,
    Download: <Download className="w-5 h-5" />,
    Calculator: <Calculator className="w-5 h-5" />,
    Presentation: <Presentation className="w-5 h-5" />
  };
  
  return iconMap[iconName] || <FileText className="w-5 h-5" />;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const product = PRODUCTS.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
          <p className="text-gray-400 mb-6">Le produit que vous recherchez n'existe pas.</p>
          <a 
            href="/catalogue"
            className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Retour au catalogue
          </a>
        </div>
      </div>
    );
  }

  // Convertir le produit au format attendu par le template
  const templateProduct = {
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category || 'Non catégorisé',
    tags: product.tags,
    stats: {
      pages: product.pages,
      words: product.words,
      size: product.size || 'N/A',
      fileType: product.fileType || 'N/A'
    },
    features: product.features?.map(feature => ({
      icon: getIconComponent(feature.icon),
      title: feature.title,
      description: feature.description
    })) || [],
    permissions: product.permissions || product.rights || [],
    previewImages: product.previewImages || product.images || [product.image],
    downloadUrl: product.downloadUrl || product.fileUrl,
    isPremium: product.isPremium || false,
    rating: product.rating,
    downloads: product.downloads,
    instructor: product.instructor,
    duration: product.duration
  };

  return (
    <ProductPageTemplate 
      product={templateProduct}
      backUrl="/catalogue"
      backLabel="Retour au catalogue"
    />
  );
} 