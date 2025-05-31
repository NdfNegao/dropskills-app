export type Product = {
  id: string;
  title: string;
  subtitle: string;
  format: 'ebook' | 'audio' | 'video' | 'template' | 'tool' | 'Book' | 'Video' | 'Audio' | 'Prompt Pack' | 'Template' | 'Notion Template' | 'Checklist' | 'Toolstack' | 'Workbook' | 'Guide' | 'Formation' | 'GPT' | 'Course';
  image: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  likes: number;
  fileUrl: string;
  tags: string[];
  pages?: number;
  words?: number;
  size?: string;
  fileType?: string;
  images?: string[];
  details?: string[];
  rights?: string[];
  isPremium?: boolean;
  downloads?: number;
  rating?: number;
  // Nouvelles propriétés pour le template
  category?: string;
  instructor?: string;
  duration?: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  permissions?: string[];
  previewImages?: string[];
  downloadUrl?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "youtube-accelerator",
    title: "The 6-Day YouTube Accelerator",
    subtitle: "Email course to master YouTube Ads & boost your business.",
    format: "Course",
    image: "/api/placeholder/400/225",
    description: "Ce cours email clé-en-main donne à vos clients un système simple et éprouvé pour lancer et développer des campagnes publicitaires YouTube performantes.",
    shortDescription: "Email course designed to help you provide expert guidance on YouTube ads while upselling your services.",
    longDescription: "This done-for-you email course gives your customers a proven, easy-to-follow system for launching and growing successful YouTube ad campaigns. It teaches them how to create compelling video ads, target the right audience, optimize for conversions, and scale their campaigns for maximum ROI. Perfect for coaches, consultants, and agencies looking to add value to their clients while generating additional revenue streams.",
    likes: 12,
    fileUrl: "/downloads/youtube-accelerator.zip",
    tags: ["Digital Marketing", "YouTube", "Ads", "Email Course"],
    pages: 26,
    words: 2699,
    size: "3.0 MB",
    fileType: "ZIP",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300", "/api/placeholder/400/300"],
    details: [
      "Template email complet prêt à utiliser",
      "Guide de configuration étape par étape",
      "Scripts de vente pour upselling",
      "Ressources graphiques incluses"
    ],
    rights: [
      "Utiliser les stratégies dans votre business",
      "Partager avec votre équipe ou clients",
      "Donner ou vendre le produit",
      "Le personnaliser à votre marque",
      "Ajuster et éditer le contenu",
      "Le transformer en d'autres formats",
      "L'ajouter à votre communauté",
      "Vous présenter comme l'auteur"
    ],
    isPremium: true,
    downloads: 1247,
    rating: 4.8,
    category: "Digital Marketing",
    instructor: "Sophie Martin",
    duration: "6 jours",
    features: [
      {
        icon: "FileText",
        title: "Email Templates",
        description: "6 emails prêts à envoyer avec séquence complète"
      },
      {
        icon: "Target",
        title: "Stratégies YouTube",
        description: "Techniques avancées pour optimiser vos campagnes"
      },
      {
        icon: "Zap",
        title: "Framework Complet",
        description: "Méthode step-by-step pour des résultats garantis"
      },
      {
        icon: "Users",
        title: "Audience Targeting",
        description: "Guide pour cibler la bonne audience YouTube"
      }
    ],
    permissions: [
      "Utiliser les stratégies dans votre business",
      "Partager avec votre équipe ou clients",
      "Le donner ou le vendre",
      "Le rebrandir à votre nom",
      "Ajuster et éditer le contenu",
      "Le transformer en autres formats",
      "L'ajouter à votre communauté",
      "Vous présenter comme l'auteur"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/youtube-accelerator.zip"
  },
  {
    id: "psychology-selling",
    title: "The Psychology of Selling",
    subtitle: "How the brain buys, and how you can sell more.",
    format: "ebook",
    image: "/api/placeholder/400/225",
    description: "Découvrez les secrets psychologiques qui influencent les décisions d'achat et boostez vos ventes.",
    shortDescription: "Un guide complet sur les techniques psychologiques de vente pour augmenter vos conversions.",
    longDescription: "Ce guide approfondi explore les mécanismes psychologiques qui gouvernent les décisions d'achat. Vous découvrirez comment utiliser les biais cognitifs, les déclencheurs émotionnels et les techniques de persuasion pour créer des expériences de vente irrésistibles. Parfait pour les entrepreneurs, vendeurs et marketeurs qui veulent comprendre la psychologie de leurs clients.",
    likes: 8,
    fileUrl: "/downloads/psychology-selling.pdf",
    tags: ["Sales", "Psychology", "Ebook"],
    pages: 45,
    words: 8500,
    size: "2.1 MB",
    fileType: "PDF",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300"],
    details: [
      "Guide PDF de 45 pages",
      "12 techniques psychologiques éprouvées",
      "Études de cas réels",
      "Checklist d'application pratique"
    ],
    rights: [
      "Utiliser les stratégies dans votre business",
      "Partager avec votre équipe ou clients",
      "Donner ou vendre le produit",
      "Le personnaliser à votre marque",
      "Ajuster et éditer le contenu",
      "Le transformer en d'autres formats"
    ],
    isPremium: false,
    downloads: 892,
    rating: 4.6,
    category: "Sales & Psychology",
    instructor: "Dr. Marc Dubois",
    duration: "2h lecture",
    features: [
      {
        icon: "Brain",
        title: "Psychologie Cognitive",
        description: "12 biais cognitifs pour influencer les décisions"
      },
      {
        icon: "Target",
        title: "Techniques de Persuasion",
        description: "Méthodes éprouvées pour convaincre efficacement"
      },
      {
        icon: "TrendingUp",
        title: "Études de Cas",
        description: "Exemples réels d'application des techniques"
      },
      {
        icon: "CheckCircle",
        title: "Checklist Pratique",
        description: "Guide d'application étape par étape"
      }
    ],
    permissions: [
      "Utiliser les stratégies dans votre business",
      "Partager avec votre équipe ou clients",
      "Donner ou vendre le produit",
      "Le personnaliser à votre marque",
      "Ajuster et éditer le contenu",
      "Le transformer en d'autres formats"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/psychology-selling.pdf"
  },
  {
    id: "audio-motivation",
    title: "Motivation Booster Audio",
    subtitle: "Un audio pour booster votre motivation chaque matin.",
    format: "audio",
    image: "/api/placeholder/400/225",
    description: "Un format audio inspirant pour démarrer la journée avec énergie et focus.",
    shortDescription: "Session audio de motivation matinale pour entrepreneurs et créateurs.",
    longDescription: "Cette session audio de 15 minutes est conçue pour vous donner l'énergie et la motivation nécessaires pour attaquer votre journée avec détermination. Basée sur des techniques de développement personnel éprouvées, elle vous aidera à maintenir un mindset positif et productif au quotidien.",
    likes: 5,
    fileUrl: "/downloads/audio-motivation.mp3",
    tags: ["Audio", "Motivation", "Bien-être"],
    pages: 1,
    words: 2200,
    size: "12.5 MB",
    fileType: "MP3",
    images: ["/api/placeholder/400/225"],
    details: [
      "Fichier audio MP3 haute qualité",
      "Durée : 15 minutes",
      "Script inclus",
      "Version courte de 5 minutes"
    ],
    rights: [
      "Utiliser pour votre développement personnel",
      "Partager avec votre équipe",
      "Intégrer dans vos formations",
      "Utiliser comme bonus client"
    ],
    isPremium: true,
    downloads: 634,
    rating: 4.9,
    category: "Développement Personnel",
    instructor: "Julie Rousseau",
    duration: "15 min",
    features: [
      {
        icon: "Volume2",
        title: "Audio Haute Qualité",
        description: "Enregistrement professionnel en MP3 320kbps"
      },
      {
        icon: "Clock",
        title: "Session Courte",
        description: "15 minutes pour un boost matinal efficace"
      },
      {
        icon: "FileText",
        title: "Script Inclus",
        description: "Transcription complète de l'audio"
      },
      {
        icon: "Zap",
        title: "Techniques Éprouvées",
        description: "Méthodes de motivation scientifiquement validées"
      }
    ],
    permissions: [
      "Utiliser pour votre développement personnel",
      "Partager avec votre équipe",
      "Intégrer dans vos formations",
      "Utiliser comme bonus client"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/audio-motivation.mp3"
  },
  {
    id: "email-marketing-mastery",
    title: "Email Marketing Mastery Course",
    subtitle: "Formation complète pour maîtriser l'email marketing.",
    format: "video",
    image: "/api/placeholder/400/225",
    description: "Formation complète pour maîtriser l'email marketing et créer des campagnes qui convertissent. Inclut templates, séquences et stratégies avancées.",
    shortDescription: "Formation vidéo complète avec templates et stratégies d'email marketing.",
    longDescription: "Cette formation vidéo de 3 heures vous enseigne tout ce qu'il faut savoir pour créer des campagnes d'email marketing performantes. Vous apprendrez à segmenter votre audience, créer des séquences automatisées, optimiser vos taux d'ouverture et de clic, et maximiser vos conversions. Inclut 50+ templates d'emails prêts à utiliser.",
    likes: 15,
    fileUrl: "/downloads/email-marketing-mastery.zip",
    tags: ["Email Marketing", "Conversion", "Templates", "Video"],
    pages: 45,
    words: 8500,
    size: "1.2 GB",
    fileType: "MP4 + PDF",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300", "/api/placeholder/400/300"],
    details: [
      "Formation vidéo de 3 heures",
      "50+ templates d'emails",
      "Guide PDF de 45 pages",
      "Bonus : Checklist de délivrabilité"
    ],
    rights: [
      "Utiliser tous les templates fournis",
      "Adapter le contenu à votre marque",
      "Revendre le cours complet",
      "Former votre équipe avec ce contenu",
      "Créer des formations dérivées",
      "Utiliser les stratégies commercialement"
    ],
    isPremium: true,
    downloads: 743,
    rating: 4.8,
    category: "Email Marketing",
    instructor: "Thomas Leroy",
    duration: "3h 00min",
    features: [
      {
        icon: "Mail",
        title: "Templates Email",
        description: "50+ templates d'emails haute conversion"
      },
      {
        icon: "TrendingUp",
        title: "Stratégies Avancées",
        description: "Techniques de segmentation et personnalisation"
      },
      {
        icon: "Sparkles",
        title: "Automation",
        description: "Séquences automatisées pour tous les scénarios"
      },
      {
        icon: "Shield",
        title: "Délivrabilité",
        description: "Techniques pour éviter les spams"
      }
    ],
    permissions: [
      "Utiliser tous les templates fournis",
      "Adapter le contenu à votre marque",
      "Revendre le cours complet",
      "Former votre équipe avec ce contenu",
      "Créer des formations dérivées",
      "Utiliser les stratégies commercialement"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/email-marketing-mastery.zip"
  },
  {
    id: "notion-productivity-template",
    title: "Notion Productivity Dashboard",
    subtitle: "Template Notion complet pour organiser votre productivité.",
    format: "Notion Template",
    image: "/api/placeholder/400/225",
    description: "Template Notion tout-en-un pour gérer vos projets, tâches, objectifs et habitudes. Interface moderne et fonctionnalités avancées.",
    shortDescription: "Dashboard Notion complet avec gestion de projets, tâches et objectifs.",
    longDescription: "Ce template Notion professionnel transforme votre espace de travail en un hub de productivité ultra-efficace. Inclut des bases de données interconnectées pour vos projets, tâches, objectifs, habitudes, notes et plus encore. Design moderne et workflow optimisé pour les entrepreneurs et créateurs.",
    likes: 23,
    fileUrl: "/downloads/notion-productivity-template.zip",
    tags: ["Notion", "Productivité", "Template", "Organisation"],
    pages: 12,
    words: 0,
    size: "5.2 MB",
    fileType: "Notion Template",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300", "/api/placeholder/400/300"],
    details: [
      "Template Notion complet",
      "12 pages interconnectées",
      "Bases de données avancées",
      "Guide d'installation inclus"
    ],
    rights: [
      "Utiliser le template pour votre usage personnel",
      "Modifier et personnaliser à volonté",
      "Partager avec votre équipe",
      "Créer des copies pour vos clients",
      "Revendre le template modifié",
      "Utiliser comme base pour d'autres templates"
    ],
    isPremium: true,
    downloads: 456,
    rating: 4.7,
    category: "Productivité",
    instructor: "Marie Dubois",
    duration: "Setup 30min",
    features: [
      {
        icon: "Layout",
        title: "Dashboard Central",
        description: "Vue d'ensemble de tous vos projets et tâches"
      },
      {
        icon: "Target",
        title: "Gestion d'Objectifs",
        description: "Suivi et planification de vos objectifs"
      },
      {
        icon: "Calendar",
        title: "Planning Intégré",
        description: "Calendrier et planification des tâches"
      },
      {
        icon: "BarChart",
        title: "Analytics",
        description: "Statistiques de productivité et progression"
      }
    ],
    permissions: [
      "Utiliser le template pour votre usage personnel",
      "Modifier et personnaliser à volonté",
      "Partager avec votre équipe",
      "Créer des copies pour vos clients",
      "Revendre le template modifié",
      "Utiliser comme base pour d'autres templates"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/notion-productivity-template.zip"
  },
  {
    id: "chatgpt-prompts-pack",
    title: "ChatGPT Prompts Pack Pro",
    subtitle: "200+ prompts ChatGPT pour entrepreneurs et marketeurs.",
    format: "Prompt Pack",
    image: "/api/placeholder/400/225",
    description: "Collection de 200+ prompts ChatGPT optimisés pour le business, marketing, copywriting et productivité. Organisés par catégories avec exemples d'utilisation.",
    shortDescription: "Pack de prompts ChatGPT professionnels pour booster votre productivité.",
    longDescription: "Cette collection exclusive contient plus de 200 prompts ChatGPT soigneusement conçus et testés pour les entrepreneurs, marketeurs et créateurs de contenu. Chaque prompt est optimisé pour obtenir des résultats précis et exploitables. Inclut des catégories pour le copywriting, la stratégie marketing, la création de contenu, l'analyse de données et bien plus.",
    likes: 31,
    fileUrl: "/downloads/chatgpt-prompts-pack.zip",
    tags: ["ChatGPT", "Prompts", "IA", "Marketing", "Productivité"],
    pages: 85,
    words: 12000,
    size: "8.5 MB",
    fileType: "PDF + Notion",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300", "/api/placeholder/400/300"],
    details: [
      "200+ prompts optimisés",
      "Guide PDF de 85 pages",
      "Template Notion inclus",
      "Exemples d'utilisation détaillés"
    ],
    rights: [
      "Utiliser tous les prompts commercialement",
      "Modifier et adapter les prompts",
      "Partager avec votre équipe",
      "Créer vos propres variations",
      "Intégrer dans vos formations",
      "Revendre le pack complet"
    ],
    isPremium: true,
    downloads: 1089,
    rating: 4.9,
    category: "Intelligence Artificielle",
    instructor: "Alex Chen",
    duration: "Accès immédiat",
    features: [
      {
        icon: "MessageSquare",
        title: "200+ Prompts",
        description: "Collection complète de prompts optimisés"
      },
      {
        icon: "FolderOpen",
        title: "Organisé par Catégories",
        description: "Marketing, copywriting, analyse, créativité..."
      },
      {
        icon: "BookOpen",
        title: "Guide Complet",
        description: "Instructions et exemples d'utilisation"
      },
      {
        icon: "Zap",
        title: "Résultats Immédiats",
        description: "Prompts testés pour des résultats optimaux"
      }
    ],
    permissions: [
      "Utiliser tous les prompts commercialement",
      "Modifier et adapter les prompts",
      "Partager avec votre équipe",
      "Créer vos propres variations",
      "Intégrer dans vos formations",
      "Revendre le pack complet"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/chatgpt-prompts-pack.zip"
  },
  {
    id: "social-media-workbook",
    title: "Social Media Strategy Workbook",
    subtitle: "Workbook interactif pour créer votre stratégie social media.",
    format: "Workbook",
    image: "/api/placeholder/400/225",
    description: "Workbook interactif de 60 pages pour développer une stratégie social media gagnante. Exercices pratiques, templates et frameworks inclus.",
    shortDescription: "Workbook pratique avec exercices pour maîtriser les réseaux sociaux.",
    longDescription: "Ce workbook interactif vous guide étape par étape dans la création d'une stratégie social media performante. Avec 60 pages d'exercices pratiques, de templates et de frameworks éprouvés, vous apprendrez à définir votre audience, créer du contenu engageant, planifier vos publications et mesurer vos résultats sur tous les réseaux sociaux.",
    likes: 18,
    fileUrl: "/downloads/social-media-workbook.pdf",
    tags: ["Social Media", "Stratégie", "Workbook", "Marketing"],
    pages: 60,
    words: 15000,
    size: "25.3 MB",
    fileType: "PDF Interactif",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300", "/api/placeholder/400/300"],
    details: [
      "Workbook PDF de 60 pages",
      "Exercices interactifs",
      "Templates de contenu",
      "Calendrier éditorial inclus"
    ],
    rights: [
      "Utiliser pour votre stratégie personnelle",
      "Adapter les templates à votre marque",
      "Partager avec vos clients",
      "Utiliser dans vos formations",
      "Créer des versions personnalisées",
      "Revendre le workbook complet"
    ],
    isPremium: false,
    downloads: 567,
    rating: 4.5,
    category: "Social Media",
    instructor: "Sarah Johnson",
    duration: "4-6h travail",
    features: [
      {
        icon: "PenTool",
        title: "Exercices Pratiques",
        description: "60 pages d'exercices pour construire votre stratégie"
      },
      {
        icon: "Calendar",
        title: "Calendrier Éditorial",
        description: "Template de planification de contenu"
      },
      {
        icon: "BarChart",
        title: "Métriques & KPIs",
        description: "Framework de mesure des performances"
      },
      {
        icon: "Users",
        title: "Persona Builder",
        description: "Outil pour définir votre audience cible"
      }
    ],
    permissions: [
      "Utiliser pour votre stratégie personnelle",
      "Adapter les templates à votre marque",
      "Partager avec vos clients",
      "Utiliser dans vos formations",
      "Créer des versions personnalisées",
      "Revendre le workbook complet"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/social-media-workbook.pdf"
  },
  {
    id: "startup-checklist",
    title: "Ultimate Startup Checklist",
    subtitle: "Checklist complète pour lancer votre startup avec succès.",
    format: "Checklist",
    image: "/api/placeholder/400/225",
    description: "Checklist exhaustive de 150+ points pour lancer votre startup. De l'idée au lancement, tous les aspects sont couverts avec des ressources et liens utiles.",
    shortDescription: "Checklist de 150+ points pour réussir le lancement de votre startup.",
    longDescription: "Cette checklist ultra-complète vous accompagne dans toutes les étapes de création de votre startup. 150+ points de contrôle organisés en phases : validation d'idée, étude de marché, développement produit, stratégie marketing, aspects légaux, financement et lancement. Chaque point inclut des ressources et outils recommandés.",
    likes: 27,
    fileUrl: "/downloads/startup-checklist.pdf",
    tags: ["Startup", "Entrepreneuriat", "Checklist", "Business"],
    pages: 35,
    words: 8500,
    size: "4.2 MB",
    fileType: "PDF",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300"],
    details: [
      "Checklist de 150+ points",
      "Guide PDF de 35 pages",
      "Ressources et outils recommandés",
      "Version imprimable incluse"
    ],
    rights: [
      "Utiliser pour vos projets personnels",
      "Partager avec votre équipe",
      "Adapter à votre secteur d'activité",
      "Utiliser dans vos accompagnements",
      "Créer des versions spécialisées",
      "Distribuer à vos clients"
    ],
    isPremium: false,
    downloads: 823,
    rating: 4.6,
    category: "Entrepreneuriat",
    instructor: "David Martinez",
    duration: "Guide permanent",
    features: [
      {
        icon: "CheckSquare",
        title: "150+ Points de Contrôle",
        description: "Checklist exhaustive pour chaque étape"
      },
      {
        icon: "Layers",
        title: "Organisé par Phases",
        description: "Structure claire du processus de création"
      },
      {
        icon: "ExternalLink",
        title: "Ressources Incluses",
        description: "Liens vers outils et ressources utiles"
      },
      {
        icon: "Printer",
        title: "Version Imprimable",
        description: "Format optimisé pour l'impression"
      }
    ],
    permissions: [
      "Utiliser pour vos projets personnels",
      "Partager avec votre équipe",
      "Adapter à votre secteur d'activité",
      "Utiliser dans vos accompagnements",
      "Créer des versions spécialisées",
      "Distribuer à vos clients"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/startup-checklist.pdf"
  },
  {
    id: "copywriting-gpt",
    title: "CopyMaster GPT",
    subtitle: "GPT personnalisé pour créer des copies qui convertissent.",
    format: "GPT",
    image: "/api/placeholder/400/225",
    description: "GPT spécialement entraîné pour le copywriting haute conversion. Créez des pages de vente, emails, ads et contenus persuasifs en quelques clics.",
    shortDescription: "GPT expert en copywriting pour tous vos besoins de contenu persuasif.",
    longDescription: "Ce GPT personnalisé a été entraîné sur des milliers d'exemples de copies haute conversion. Il maîtrise tous les frameworks de copywriting (AIDA, PAS, Before/After/Bridge, etc.) et peut créer des contenus persuasifs pour tous vos besoins : pages de vente, emails, publicités, posts réseaux sociaux, et plus encore. Inclut des prompts optimisés et des templates prêts à utiliser.",
    likes: 42,
    fileUrl: "/downloads/copywriting-gpt.zip",
    tags: ["GPT", "Copywriting", "IA", "Marketing", "Conversion"],
    pages: 0,
    words: 0,
    size: "Accès GPT",
    fileType: "GPT + Guide",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300", "/api/placeholder/400/300"],
    details: [
      "GPT personnalisé pour copywriting",
      "Guide d'utilisation de 25 pages",
      "50+ prompts optimisés",
      "Templates de tous formats"
    ],
    rights: [
      "Utiliser le GPT pour vos projets",
      "Créer du contenu commercial",
      "Partager les créations avec clients",
      "Utiliser dans vos services",
      "Former votre équipe à l'utilisation",
      "Intégrer dans vos processus"
    ],
    isPremium: true,
    downloads: 234,
    rating: 4.9,
    category: "Intelligence Artificielle",
    instructor: "Emma Rodriguez",
    duration: "Accès permanent",
    features: [
      {
        icon: "Bot",
        title: "GPT Spécialisé",
        description: "IA entraînée spécifiquement pour le copywriting"
      },
      {
        icon: "Zap",
        title: "Frameworks Intégrés",
        description: "AIDA, PAS, Before/After/Bridge et plus"
      },
      {
        icon: "FileText",
        title: "Tous Formats",
        description: "Pages de vente, emails, ads, posts sociaux"
      },
      {
        icon: "TrendingUp",
        title: "Haute Conversion",
        description: "Entraîné sur des copies qui convertissent"
      }
    ],
    permissions: [
      "Utiliser le GPT pour vos projets",
      "Créer du contenu commercial",
      "Partager les créations avec clients",
      "Utiliser dans vos services",
      "Former votre équipe à l'utilisation",
      "Intégrer dans vos processus"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/copywriting-gpt.zip"
  },
  {
    id: "business-plan-template",
    title: "Business Plan Template Pro",
    subtitle: "Template complet pour créer un business plan professionnel.",
    format: "Template",
    image: "/api/placeholder/400/225",
    description: "Template de business plan professionnel avec toutes les sections essentielles. Format Word et PowerPoint inclus avec exemples et instructions.",
    shortDescription: "Template professionnel pour créer un business plan complet et convaincant.",
    longDescription: "Ce template de business plan professionnel vous guide dans la création d'un document complet et convaincant. Inclut toutes les sections essentielles : résumé exécutif, analyse de marché, stratégie marketing, projections financières, et plus. Disponible en formats Word et PowerPoint avec des exemples concrets et des instructions détaillées pour chaque section.",
    likes: 19,
    fileUrl: "/downloads/business-plan-template.zip",
    tags: ["Business Plan", "Template", "Entrepreneuriat", "Finance"],
    pages: 45,
    words: 12000,
    size: "15.8 MB",
    fileType: "DOCX + PPTX",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300", "/api/placeholder/400/300"],
    details: [
      "Template Word de 45 pages",
      "Présentation PowerPoint incluse",
      "Exemples et instructions détaillées",
      "Modèles financiers Excel"
    ],
    rights: [
      "Utiliser pour vos projets personnels",
      "Adapter à votre secteur d'activité",
      "Partager avec investisseurs",
      "Utiliser dans vos accompagnements",
      "Créer des versions personnalisées",
      "Revendre le template modifié"
    ],
    isPremium: false,
    downloads: 678,
    rating: 4.4,
    category: "Entrepreneuriat",
    instructor: "Philippe Moreau",
    duration: "Template permanent",
    features: [
      {
        icon: "FileText",
        title: "Template Complet",
        description: "45 pages avec toutes les sections essentielles"
      },
      {
        icon: "PresentationChart",
        title: "Présentation Incluse",
        description: "PowerPoint pour pitcher votre projet"
      },
      {
        icon: "Calculator",
        title: "Modèles Financiers",
        description: "Tableaux Excel pour projections financières"
      },
      {
        icon: "BookOpen",
        title: "Guide Détaillé",
        description: "Instructions pour chaque section"
      }
    ],
    permissions: [
      "Utiliser pour vos projets personnels",
      "Adapter à votre secteur d'activité",
      "Partager avec investisseurs",
      "Utiliser dans vos accompagnements",
      "Créer des versions personnalisées",
      "Revendre le template modifié"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/business-plan-template.zip"
  },
  {
    id: "productivity-masterclass",
    title: "Productivity Masterclass",
    subtitle: "Formation vidéo complète pour maximiser votre productivité.",
    format: "Formation",
    image: "/api/placeholder/400/225",
    description: "Formation vidéo de 4 heures pour maîtriser les techniques de productivité des entrepreneurs à succès. Méthodes, outils et systèmes inclus.",
    shortDescription: "Masterclass vidéo de 4h pour devenir ultra-productif et atteindre vos objectifs.",
    longDescription: "Cette masterclass de 4 heures vous enseigne les techniques de productivité utilisées par les entrepreneurs les plus performants. Vous apprendrez à gérer votre temps, éliminer les distractions, automatiser vos tâches, et créer des systèmes qui vous permettront d'atteindre vos objectifs plus rapidement. Inclut des templates, outils et bonus exclusifs.",
    likes: 35,
    fileUrl: "/downloads/productivity-masterclass.zip",
    tags: ["Productivité", "Formation", "Video", "Entrepreneuriat"],
    pages: 0,
    words: 0,
    size: "2.1 GB",
    fileType: "MP4 + Bonus",
    images: ["/api/placeholder/400/225", "/api/placeholder/400/300", "/api/placeholder/400/300"],
    details: [
      "Formation vidéo de 4 heures",
      "12 modules progressifs",
      "Templates et outils inclus",
      "Bonus : Communauté privée"
    ],
    rights: [
      "Suivre la formation personnellement",
      "Appliquer les méthodes dans votre business",
      "Partager avec votre équipe",
      "Utiliser les templates fournis",
      "Créer vos propres systèmes",
      "Former d'autres personnes"
    ],
    isPremium: true,
    downloads: 389,
    rating: 4.8,
    category: "Développement Personnel",
    instructor: "Antoine Dubois",
    duration: "4h 00min",
    features: [
      {
        icon: "Play",
        title: "Formation Vidéo",
        description: "4 heures de contenu premium en HD"
      },
      {
        icon: "Layers",
        title: "12 Modules",
        description: "Progression structurée et logique"
      },
      {
        icon: "Download",
        title: "Templates Inclus",
        description: "Outils et templates prêts à utiliser"
      },
      {
        icon: "Users",
        title: "Communauté",
        description: "Accès à la communauté privée"
      }
    ],
    permissions: [
      "Suivre la formation personnellement",
      "Appliquer les méthodes dans votre business",
      "Partager avec votre équipe",
      "Utiliser les templates fournis",
      "Créer vos propres systèmes",
      "Former d'autres personnes"
    ],
    previewImages: [
      "/api/placeholder/800/450",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    downloadUrl: "/downloads/productivity-masterclass.zip"
  },
  // --- NOUVELLES FORMATIONS 2025 ---
  {
    id: "affiliation-2025",
    title: "Affiliation 2025",
    subtitle: "Lancez-vous dans l'affiliation et trouvez un programme rentable.",
    format: "Formation",
    image: "/formations/affiliation-2025.jpg",
    description: "Découvrez les stratégies d'affiliation les plus rentables pour 2025 et comment générer des revenus passifs.",
    shortDescription: "10 modules pour tout comprendre de l'affiliation.",
    likes: 0,
    fileUrl: "",
    tags: ["Affiliation", "Business", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.8,
    category: "Business",
    instructor: "Equipe Dropskills",
    duration: "10 modules",
    features: [
      { icon: "TrendingUp", title: "Nouvelle commission", description: "Système 2025" },
      { icon: "Users", title: "Communauté", description: "Accès privé" }
    ]
  },
  {
    id: "dropshipping-2025",
    title: "Dropshipping 2025",
    subtitle: "10 modules pour vous lancer avec un capital de 100€.",
    format: "Formation",
    image: "/formations/dropshipping-2025.jpg",
    description: "Maîtrisez le dropshipping nouvelle génération, sans stock et avec un minimum d'investissement.",
    shortDescription: "Stratégies dropshipping à jour pour 2025.",
    likes: 0,
    fileUrl: "",
    tags: ["E-commerce", "Dropshipping", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.7,
    category: "E-commerce",
    instructor: "Equipe Dropskills",
    duration: "10 modules",
    features: [
      { icon: "Box", title: "Stock minimal", description: "Démarrage avec 100€" },
      { icon: "Zap", title: "Automatisation", description: "Outils 2025 inclus" }
    ]
  },
  {
    id: "closing-mastery",
    title: "Closing Mastery",
    subtitle: "Devenez un closer hors pair grâce à des techniques de vente redoutables.",
    format: "Formation",
    image: "/formations/closing-mastery.jpg",
    description: "Apprenez à closer des ventes à haut ticket avec des scripts et des méthodes éprouvées.",
    shortDescription: "Techniques de closing professionnel.",
    likes: 0,
    fileUrl: "",
    tags: ["Vente", "Closing", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.9,
    category: "Vente",
    instructor: "Equipe Dropskills",
    duration: "7 modules",
    features: [
      { icon: "Phone", title: "Scripts de closing", description: "Scripts prêts à l'emploi" },
      { icon: "UserCheck", title: "Coaching", description: "Accompagnement inclus" }
    ]
  },
  {
    id: "shopify-2025",
    title: "Créer un site Shopify qui convertit",
    subtitle: "Apprenez à créer une boutique optimisée sur Shopify.",
    format: "Formation",
    image: "/formations/shopify-2025.jpg",
    description: "Toutes les étapes pour lancer un site Shopify performant et rentable.",
    shortDescription: "Formation Shopify complète.",
    likes: 0,
    fileUrl: "",
    tags: ["Shopify", "E-commerce", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.8,
    category: "E-commerce",
    instructor: "Equipe Dropskills",
    duration: "8 modules",
    features: [
      { icon: "ShoppingCart", title: "Optimisation", description: "Boutique qui convertit" },
      { icon: "Zap", title: "Automatisation", description: "Apps recommandées" }
    ]
  },
  {
    id: "personal-branding-2025",
    title: "Personal Branding",
    subtitle: "Explosez sur les réseaux sociaux grâce à une stratégie d'image de marque.",
    format: "Formation",
    image: "/formations/personal-branding-2025.jpg",
    description: "Construisez une marque personnelle forte et visible en 2025.",
    shortDescription: "Stratégies de personal branding.",
    likes: 0,
    fileUrl: "",
    tags: ["Personal Branding", "Réseaux Sociaux", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.7,
    category: "Marketing",
    instructor: "Equipe Dropskills",
    duration: "6 modules",
    features: [
      { icon: "User", title: "Image de marque", description: "Développez votre présence" },
      { icon: "Camera", title: "Contenu", description: "Stratégie réseaux sociaux" }
    ]
  },
  {
    id: "tunnels-vente-2025",
    title: "Tunnels de Vente 2.0",
    subtitle: "Apprenez à créer des tunnels de vente performants.",
    format: "Formation",
    image: "/formations/tunnels-vente-2025.jpg",
    description: "Toutes les étapes pour créer un tunnel de vente qui convertit en 2025.",
    shortDescription: "Tunnel de vente nouvelle génération.",
    likes: 0,
    fileUrl: "",
    tags: ["Tunnel de vente", "Conversion", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.8,
    category: "Vente",
    instructor: "Equipe Dropskills",
    duration: "7 modules",
    features: [
      { icon: "Layers", title: "Tunnel complet", description: "Étapes détaillées" },
      { icon: "Zap", title: "Automatisation", description: "Outils inclus" }
    ]
  },
  {
    id: "google-ads-2025",
    title: "Google Ads 2025",
    subtitle: "Créez des campagnes Search & Shopping, ciblez les bons mots-clés.",
    format: "Formation",
    image: "/formations/google-ads-2025.jpg",
    description: "Maîtrisez Google Ads avec les dernières stratégies et optimisations.",
    shortDescription: "Formation Google Ads à jour.",
    likes: 0,
    fileUrl: "",
    tags: ["Google Ads", "SEA", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.7,
    category: "Marketing",
    instructor: "Equipe Dropskills",
    duration: "9 modules",
    features: [
      { icon: "Search", title: "SEA", description: "Campagnes Search & Shopping" },
      { icon: "TrendingUp", title: "Optimisation", description: "Stratégies avancées" }
    ]
  },
  {
    id: "coaching-high-ticket-2025",
    title: "Coaching High Ticket",
    subtitle: "Lancez votre offre coaching High Ticket, scalez jusqu'à +10K/mois.",
    format: "Formation",
    image: "/formations/coaching-high-ticket-2025.jpg",
    description: "Toutes les méthodes pour vendre du coaching haut de gamme.",
    shortDescription: "Coaching High Ticket, méthodes 2025.",
    likes: 0,
    fileUrl: "",
    tags: ["Coaching", "High Ticket", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.8,
    category: "Coaching",
    instructor: "Equipe Dropskills",
    duration: "8 modules",
    features: [
      { icon: "UserCheck", title: "Coaching", description: "Accompagnement inclus" },
      { icon: "TrendingUp", title: "Ventes", description: "Techniques de closing" }
    ]
  },
  {
    id: "growth-hacking-2025",
    title: "Growth Hacking 2025",
    subtitle: "Génération de leads sur les réseaux sociaux.",
    format: "Formation",
    image: "/formations/growth-hacking-2025.jpg",
    description: "Toutes les techniques de growth hacking pour 2025.",
    shortDescription: "Growth hacking réseaux sociaux.",
    likes: 0,
    fileUrl: "",
    tags: ["Growth Hacking", "Réseaux Sociaux", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.7,
    category: "Marketing",
    instructor: "Equipe Dropskills",
    duration: "7 modules",
    features: [
      { icon: "Zap", title: "Automatisation", description: "Outils inclus" },
      { icon: "Users", title: "Leads", description: "Génération sur TikTok, Insta, etc." }
    ]
  },
  {
    id: "canva-2025",
    title: "Canva 2025",
    subtitle: "Découvrez les secrets de Canva.",
    format: "Formation",
    image: "/formations/canva-2025.jpg",
    description: "Maîtrisez Canva et créez des visuels pros en 2025.",
    shortDescription: "Formation Canva complète.",
    likes: 0,
    fileUrl: "",
    tags: ["Canva", "Design", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.8,
    category: "Design",
    instructor: "Equipe Dropskills",
    duration: "6 modules",
    features: [
      { icon: "Image", title: "Visuels pros", description: "Templates inclus" },
      { icon: "Sparkles", title: "Astuces", description: "Trucs & hacks Canva" }
    ]
  },
  {
    id: "capcut-2025",
    title: "Capcut 2025",
    subtitle: "Montez vos vidéos comme un pro.",
    format: "Formation",
    image: "/formations/capcut-2025.jpg",
    description: "Formation complète pour maîtriser Capcut en 2025.",
    shortDescription: "Capcut, montage vidéo pro.",
    likes: 0,
    fileUrl: "",
    tags: ["Capcut", "Montage", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.7,
    category: "Montage",
    instructor: "Equipe Dropskills",
    duration: "7 modules",
    features: [
      { icon: "Film", title: "Montage vidéo", description: "Techniques pros" },
      { icon: "Zap", title: "Effets", description: "Transitions & effets" }
    ]
  },
  {
    id: "chatgpt-2025",
    title: "ChatGPT 2025",
    subtitle: "Prenez en main l'IA générative et boostez votre business.",
    format: "Formation",
    image: "/formations/chatgpt-2025.jpg",
    description: "Formation complète sur ChatGPT et l'IA générative pour entrepreneurs.",
    shortDescription: "ChatGPT, prompts et automatisations.",
    likes: 0,
    fileUrl: "",
    tags: ["ChatGPT", "IA", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.9,
    category: "IA",
    instructor: "Equipe Dropskills",
    duration: "8 modules",
    features: [
      { icon: "Bot", title: "Prompts avancés", description: "200+ prompts inclus" },
      { icon: "Zap", title: "Automatisation", description: "Workflows IA" }
    ]
  },
  {
    id: "meta-ads-2025",
    title: "Meta Ads 2025",
    subtitle: "Maîtrisez la publicité Facebook & Instagram en 2025.",
    format: "Formation",
    image: "/formations/meta-ads-2025.jpg",
    description: "Toutes les stratégies Meta Ads à jour pour 2025.",
    shortDescription: "Meta Ads, Facebook & Instagram.",
    likes: 0,
    fileUrl: "",
    tags: ["Meta Ads", "Facebook", "Instagram", "2025"],
    isPremium: true,
    downloads: 0,
    rating: 4.8,
    category: "Publicité",
    instructor: "Equipe Dropskills",
    duration: "9 modules",
    features: [
      { icon: "Facebook", title: "Facebook Ads", description: "Stratégies avancées" },
      { icon: "Instagram", title: "Instagram Ads", description: "Optimisation 2025" }
    ]
  }
]; 