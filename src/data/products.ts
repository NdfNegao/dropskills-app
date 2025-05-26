export type Product = {
  id: string;
  title: string;
  subtitle: string;
  format: 'ebook' | 'audio' | 'video' | 'template' | 'tool';
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
};

export const PRODUCTS: Product[] = [
  {
    id: "youtube-accelerator",
    title: "The 6-Day YouTube Accelerator",
    subtitle: "Email course to master YouTube Ads & boost your business.",
    format: "ebook",
    image: "/mock/youtube-accelerator.jpg",
    description: "Ce cours email clé-en-main donne à vos clients un système simple et éprouvé pour lancer et développer des campagnes publicitaires YouTube performantes.",
    shortDescription: "Email course designed to help you provide expert guidance on YouTube ads while upselling your services.",
    longDescription: "This done-for-you email course gives your customers a proven, easy-to-follow system for launching and growing successful YouTube ad campaigns. It teaches them how to create compelling video ads, target the right audience, optimize for conversions, and scale their campaigns for maximum ROI. Perfect for coaches, consultants, and agencies looking to add value to their clients while generating additional revenue streams.",
    likes: 12,
    fileUrl: "/downloads/youtube-accelerator.zip",
    tags: ["Digital Marketing", "YouTube", "Tools"],
    pages: 26,
    words: 2699,
    size: "3.0 MB",
    fileType: "ZIP",
    images: ["/mock/youtube-accelerator.jpg", "/mock/youtube-accelerator-preview1.jpg", "/mock/youtube-accelerator-preview2.jpg"],
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
    ]
  },
  {
    id: "psychology-selling",
    title: "The Psychology of Selling",
    subtitle: "How the brain buys, and how you can sell more.",
    format: "ebook",
    image: "/mock/psychology-selling.jpg",
    description: "Découvrez les secrets psychologiques qui influencent les décisions d'achat et boostez vos ventes.",
    shortDescription: "Un guide complet sur les techniques psychologiques de vente pour augmenter vos conversions.",
    longDescription: "Ce guide approfondi explore les mécanismes psychologiques qui gouvernent les décisions d'achat. Vous découvrirez comment utiliser les biais cognitifs, les déclencheurs émotionnels et les techniques de persuasion pour créer des expériences de vente irrésistibles. Parfait pour les entrepreneurs, vendeurs et marketeurs qui veulent comprendre la psychologie de leurs clients.",
    likes: 8,
    fileUrl: "/downloads/psychology-selling.zip",
    tags: ["Sales", "Psychology", "Ebook"],
    pages: 45,
    words: 8500,
    size: "2.1 MB",
    fileType: "PDF",
    images: ["/mock/psychology-selling.jpg", "/mock/psychology-selling-preview1.jpg"],
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
    ]
  },
  {
    id: "audio-motivation",
    title: "Motivation Booster Audio",
    subtitle: "Un audio pour booster votre motivation chaque matin.",
    format: "audio",
    image: "/mock/audio-motivation.jpg",
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
    images: ["/mock/audio-motivation.jpg"],
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
    ]
  }
]; 