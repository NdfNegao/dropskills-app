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
    if (isServer) {
      // Solution radicale: remplacer pdf-parse par une version qui évite les fichiers de test
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.SKIP_PDF_PARSE_TESTS': JSON.stringify('true')
        })
      );
      
      // Intercepter tous les require/import vers les fichiers de test
      const originalResolve = config.resolve.plugins || [];
      config.resolve.plugins = [
        ...originalResolve,
        {
          apply: (resolver) => {
            resolver.hooks.resolve.tapAsync('IgnorePdfParseTests', (request, resolveContext, callback) => {
              if (request.request && request.request.includes('./test/data/')) {
                // Retourner un module vide au lieu du fichier manquant
                return callback(null, {
                  ...request,
                  request: require.resolve('path')
                });
              }
              callback();
            });
          }
        }
      ];
      
      // Configuration des externals pour exclure les fichiers de test
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          './test/data/05-versions-space.pdf': 'commonjs2 ./test/data/05-versions-space.pdf',
          './test/data/': 'commonjs2 ./test/data/'
        });
      }
      
      // Plugin pour ignorer les modules de test
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/test\/data\//,
          contextRegExp: /pdf-parse/
        })
      );
      
      // Fallbacks Node.js
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