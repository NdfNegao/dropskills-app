'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  Package, Users, TrendingUp, Star, Zap, Target, Mail, BarChart3,
  Sparkles, CheckCircle, ShoppingCart, Rocket, Lock, ArrowRight,
  PlayCircle, Download, Eye, Code, Layers, Cpu
} from 'lucide-react';

// Variants d'animations réutilisables
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const scaleOnHoverVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Composant de prévisualisation de code animée avec Framer Motion
const CodePreview = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "1. Choisissez vos produits",
      code: `// Accès instantané au catalogue
const products = await getProducts({
  category: "e-books",
  rights: "PLR_FULL"
});

console.log(\`\${products.length} produits disponibles\`);`
    },
    {
      title: "2. Personnalisez votre branding",
      code: `// Rebrandez automatiquement
const customProduct = await rebrand(product, {
  brand: "VotreBrand",
  colors: "#ff0033",
  logo: "votre-logo.png"
});

// Prêt à vendre !`
    },
    {
      title: "3. Commencez à vendre",
      code: `// Vente automatisée 24/7
const sale = {
  product: "Formation-Marketing-2025",
  price: 97,
  margin: "95%",
  delivery: "instant"
};

console.log("💰 Nouvelle vente automatique !");`
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="bg-[#0f0f0f] rounded-2xl p-6 font-mono text-sm border border-[#333] overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        boxShadow: "0 20px 40px rgba(255, 0, 51, 0.1)",
        borderColor: "#444"
      }}
    >
      <motion.div 
        className="flex items-center gap-2 mb-4"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div 
          className="w-2 h-2 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="w-2 h-2 bg-yellow-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
        />
        <motion.span 
          className="text-gray-400 text-xs ml-2"
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {steps[currentStep].title}
        </motion.span>
      </motion.div>
      
      <AnimatePresence mode="wait">
        <motion.pre 
          key={currentStep}
          className="text-green-400 whitespace-pre-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {steps[currentStep].code}
        </motion.pre>
      </AnimatePresence>
    </motion.div>
  );
};

// Logos des clients avec animation fluide
const ClientLogos = () => {
  const clients = [
    "TechStart", "InnoVenture", "DigitalPro", "MarketBoost", 
    "CreativeMinds", "BusinessFlow", "StartupLab", "GrowthHack"
  ];

  return (
    <motion.div 
      className="flex flex-wrap justify-center items-center gap-8 opacity-60"
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {clients.map((client, index) => (
        <motion.div 
          key={index}
          className="text-gray-400 font-semibold text-lg"
          variants={fadeInUpVariants}
          whileHover={{ 
            opacity: 1, 
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
        >
          {client}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Statistiques animées avec compteurs fluides
const AnimatedStats = () => {
  const [counts, setCounts] = useState({ users: 0, products: 0, revenue: 0 });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (inView) {
      const targets = { users: 300, products: 500, revenue: 95 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounts({
          users: Math.floor(targets.users * progress),
          products: Math.floor(targets.products * progress),
          revenue: Math.floor(targets.revenue * progress)
        });
        
        if (step >= steps) clearInterval(timer);
      }, increment);
      
      return () => clearInterval(timer);
    }
  }, [inView]);

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      ref={ref}
      className="grid grid-cols-3 gap-8 text-center"
      variants={staggerContainerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div variants={statsVariants}>
        <motion.div 
          className="text-3xl font-bold text-[#ff0033] mb-1"
          animate={{ color: ["#ff0033", "#ff6b6b", "#ff0033"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {counts.users}+
        </motion.div>
        <div className="text-gray-400">Entrepreneurs actifs</div>
      </motion.div>
      <motion.div variants={statsVariants}>
        <motion.div 
          className="text-3xl font-bold text-[#ff0033] mb-1"
          animate={{ color: ["#ff0033", "#ff6b6b", "#ff0033"] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          {counts.products}+
        </motion.div>
        <div className="text-gray-400">Produits PLR</div>
      </motion.div>
      <motion.div variants={statsVariants}>
        <motion.div 
          className="text-3xl font-bold text-[#ff0033] mb-1"
          animate={{ color: ["#ff0033", "#ff6b6b", "#ff0033"] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          {counts.revenue}%
        </motion.div>
        <div className="text-gray-400">Marge moyenne</div>
      </motion.div>
    </motion.div>
  );
};

// Hook pour parallax scroll
const useParallax = (value: number, distance: number) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};

// Composant principal avec Framer Motion
export default function ModernHomePageV2() {
  const { scrollYProgress } = useScroll();
  const y = useParallax(scrollYProgress, 300);
  
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(255, 0, 51, 0.3)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#18181b] text-white overflow-hidden">
      
      {/* Hero Section avec parallax */}
      <motion.section 
        ref={heroRef}
        className="max-w-6xl mx-auto px-4 py-20 relative"
        style={{ y }}
      >
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={staggerContainerVariants}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-[#ff0033]/10 text-[#ff0033] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#ff0033]/20"
            variants={fadeInUpVariants}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 0, 51, 0.15)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            Première plateforme française de PLR automation
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            variants={titleVariants}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Transformez des
            </motion.span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff0033] to-[#ff6b6b]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Produits Digitaux
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              en Business Automatisé
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            Accédez à 500+ produits PLR premium, personnalisez-les avec votre branding, 
            et commencez à vendre en quelques clics. Jusqu'à 95% de marge, livraison instantanée.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1 }}
          >
            <Link href="/auth/signin">
              <motion.button 
                className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Rocket className="w-5 h-5" />
                </motion.div>
                Démarrer gratuitement
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
            
            <motion.button 
              className="border border-gray-600 hover:border-gray-400 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center gap-2"
              variants={scaleOnHoverVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              <PlayCircle className="w-5 h-5" />
              Voir la démo (2 min)
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="text-sm text-gray-400 flex flex-wrap justify-center gap-6"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            {[
              { icon: CheckCircle, text: "Aucune carte de crédit requise", color: "text-green-400" },
              { icon: Star, text: "300+ entrepreneurs nous font confiance", color: "text-yellow-400" },
              { icon: Lock, text: "Droits PLR complets inclus", color: "text-blue-400" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2"
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                {item.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Code Preview Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-2">Voyez comme c'est simple</h3>
            <p className="text-gray-400">3 étapes pour lancer votre business digital automatisé</p>
          </motion.div>
          <CodePreview />
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <AnimatedStats />
        </motion.div>
      </motion.section>

      {/* Trusted By Section */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 font-medium">Ils nous font déjà confiance</p>
        </motion.div>
        <ClientLogos />
      </motion.section>

      {/* Features en grid moderne avec animations */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pourquoi choisir DropSkills ?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            La seule plateforme qui vous donne tout ce qu'il faut pour réussir dans le digital
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: <Rocket className="w-8 h-8 text-[#ff0033]" />,
              title: "Lancement Express",
              description: "Commencez à vendre en moins de 24h. Pas de création, pas d'attente.",
              stats: "24h max",
              color: "#ff0033"
            },
            {
              icon: <Layers className="w-8 h-8 text-blue-400" />,
              title: "Catalogue Premium",
              description: "500+ produits PLR dans tous les domaines : marketing, développement personnel, business...",
              stats: "500+ produits",
              color: "#60a5fa"
            },
            {
              icon: <Cpu className="w-8 h-8 text-green-400" />,
              title: "Automatisation IA",
              description: "Rebranding automatique, génération de tunnels de vente et emails avec l'IA.",
              stats: "100% auto",
              color: "#4ade80"
            },
            {
              icon: <Target className="w-8 h-8 text-purple-400" />,
              title: "Marge Maximale",
              description: "Jusqu'à 95% de marge sur chaque vente. Pas de stock, pas de logistique.",
              stats: "95% marge",
              color: "#c084fc"
            },
            {
              icon: <Zap className="w-8 h-8 text-yellow-400" />,
              title: "Livraison Instantanée",
              description: "Vos clients reçoivent leurs produits immédiatement, 24h/24 et 7j/7.",
              stats: "Instant",
              color: "#facc15"
            },
            {
              icon: <Users className="w-8 h-8 text-pink-400" />,
              title: "Communauté Active",
              description: "Rejoignez 300+ entrepreneurs qui partagent leurs stratégies gagnantes.",
              stats: "300+ membres",
              color: "#f472b6"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="group bg-[#111111] border border-[#222] rounded-2xl p-8 cursor-pointer"
              variants={fadeInUpVariants}
              whileHover={{ 
                scale: 1.05,
                borderColor: feature.color,
                boxShadow: `0 20px 40px ${feature.color}20`,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="flex items-center justify-between mb-4"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <motion.span 
                  className="text-sm font-mono text-gray-400 bg-[#1a1a1a] px-2 py-1 rounded"
                  whileHover={{ 
                    backgroundColor: `${feature.color}20`,
                    color: feature.color 
                  }}
                >
                  {feature.stats}
                </motion.span>
              </motion.div>
              <motion.h3 
                className="text-xl font-bold mb-3"
                whileHover={{ color: feature.color }}
                transition={{ duration: 0.2 }}
              >
                {feature.title}
              </motion.h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Final avec animation */}
      <motion.section 
        className="max-w-4xl mx-auto px-4 py-20 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-[#ff0033]/10 to-[#ff6b6b]/10 border border-[#ff0033]/20 rounded-3xl p-12 relative overflow-hidden"
          whileHover={{ 
            background: "linear-gradient(to right, rgba(255, 0, 51, 0.15), rgba(255, 107, 107, 0.15))",
            borderColor: "rgba(255, 0, 51, 0.4)"
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{ 
              background: [
                "radial-gradient(circle at 20% 50%, #ff0033 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, #ff6b6b 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, #ff0033 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <motion.h2 
            className="text-4xl font-bold mb-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Prêt à transformer votre expertise en revenus automatiques ?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Rejoignez les 300+ entrepreneurs qui ont déjà lancé leur business digital avec DropSkills
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/auth/signin">
              <motion.button 
                className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(255, 0, 51, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-5 h-5" />
                Commencer maintenant
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.div 
              className="text-sm text-gray-400"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ 27 formations offertes • ⚡ Accès immédiat • 🎯 Sans engagement
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer simple */}
      <motion.footer 
        className="border-t border-[#222] py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="max-w-6xl mx-auto px-4 text-center text-gray-400"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p>&copy; 2025 DropSkills.fr - Tous droits réservés. Fait avec ❤️ en France</p>
        </motion.div>
      </motion.footer>
    </div>
  );
} 