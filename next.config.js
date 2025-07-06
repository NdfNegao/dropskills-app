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
  webpack: (config, { isServer, webpack }) => {
    // Exclure les fichiers de test de pdf-parse pour éviter les erreurs de build
    if (isServer) {
      // Remplacer les fichiers de test manquants par des modules vides
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /\.\/(test\/data\/.*\.pdf)$/,
          require.resolve('path')
        )
      );
      
      // Plugin pour ignorer complètement les modules de test
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/test\/data\//,
          contextRegExp: /pdf-parse/
        })
      );
      
      // Configuration des externals pour forcer l'exclusion
      config.externals = config.externals || [];
      if (typeof config.externals === 'function') {
        const originalExternals = config.externals;
        config.externals = (context, request, callback) => {
          if (request.includes('./test/data/') || request.includes('pdf-parse/test')) {
            return callback(null, 'commonjs ' + request);
          }
          return originalExternals(context, request, callback);
        };
      } else {
        if (typeof config.externals === 'object' && !Array.isArray(config.externals)) {
          config.externals = [config.externals];
        }
        config.externals.push({
          './test/data/05-versions-space.pdf': 'commonjs2 ./test/data/05-versions-space.pdf',
          './test/data/': 'commonjs2 ./test/data/'
        });
      }
      
      // Fallback pour les modules Node.js
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false
      };
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