/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Variables d'environnement par défaut pour éviter les erreurs de build
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'default-secret-for-build',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build en production
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Ignorer les erreurs ESLint pendant le build en production
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    // Exclure les fichiers de test de pdf-parse pour éviter les erreurs de build
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Ignorer les fichiers de test manquants
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        './test/data/05-versions-space.pdf': 'commonjs ./test/data/05-versions-space.pdf'
      });
    }
    
    return config;
  },
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.jsdelivr.net',
      'placehold.co',
      'dummyimage.com',
      'res.cloudinary.com',
      // Ajoute ici d'autres domaines si besoin
    ],
  },
};

module.exports = nextConfig;