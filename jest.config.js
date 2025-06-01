const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Chemin vers l'app Next.js pour charger les configs next.config.js et .env
  dir: './',
});

// Configuration Jest personnalisée
const customJestConfig = {
  // Environnement de test
  testEnvironment: 'node',
  
  // Chemins des modules (moduleNameMapping -> moduleNameMapper)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Fichiers à ignorer
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  
  // Extensions de fichiers à tester
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Patterns des fichiers de test
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  
  // Variables d'environnement pour les tests
  setupFiles: ['<rootDir>/jest.env.js'],
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types/**',
  ],
  
  // Transformation des fichiers
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};

// Exporter la configuration créée par Next.js avec nos customisations
module.exports = createJestConfig(customJestConfig); 