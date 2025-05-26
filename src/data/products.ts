export type Product = {
  id: string;
  title: string;
  subtitle: string;
  format: 'ebook' | 'audio' | 'video' | 'template' | 'tool';
  image: string;
  description: string;
  likes: number;
  fileUrl: string;
  tags: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "youtube-accelerator",
    title: "The 6-Day YouTube Accelerator",
    subtitle: "Email course to master YouTube Ads & boost your business.",
    format: "ebook",
    image: "/mock/youtube-accelerator.jpg",
    description: "Ce cours email clé-en-main donne à vos clients un système simple et éprouvé pour lancer et développer des campagnes publicitaires YouTube performantes.",
    likes: 12,
    fileUrl: "/downloads/youtube-accelerator.zip",
    tags: ["Digital Marketing", "YouTube", "Tools"]
  },
  {
    id: "psychology-selling",
    title: "The Psychology of Selling",
    subtitle: "How the brain buys, and how you can sell more.",
    format: "ebook",
    image: "/mock/psychology-selling.jpg",
    description: "Découvrez les secrets psychologiques qui influencent les décisions d'achat et boostez vos ventes.",
    likes: 8,
    fileUrl: "/downloads/psychology-selling.zip",
    tags: ["Sales", "Psychology", "Ebook"]
  },
  {
    id: "audio-motivation",
    title: "Motivation Booster Audio",
    subtitle: "Un audio pour booster votre motivation chaque matin.",
    format: "audio",
    image: "/mock/audio-motivation.jpg",
    description: "Un format audio inspirant pour démarrer la journée avec énergie et focus.",
    likes: 5,
    fileUrl: "/downloads/audio-motivation.mp3",
    tags: ["Audio", "Motivation", "Bien-être"]
  }
]; 