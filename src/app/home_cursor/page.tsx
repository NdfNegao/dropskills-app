'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Package, Users, TrendingUp, Star, Zap, Target, Mail, BarChart3,
  Sparkles, CheckCircle, ShoppingCart, Rocket, Lock, ArrowRight,
  PlayCircle, Download, Eye, Code, Layers, Cpu
} from 'lucide-react';

// Composant de prévisualisation de code animée
const CodePreview = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
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

  // Animation de typing effect
  useEffect(() => {
    setIsTyping(true);
    setDisplayedCode('');
    
    const code = steps[currentStep].code;
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode(code.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30);
    
    return () => clearInterval(typeInterval);
  }, [currentStep]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="bg-[#0f0f0f] rounded-2xl p-6 font-mono text-sm border border-[#333] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.div 
          className="w-2 h-2 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        ></motion.div>
        <motion.div 
          className="w-2 h-2 bg-yellow-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        ></motion.div>
        <motion.div 
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
        ></motion.div>
        <motion.span 
          className="text-gray-400 text-xs ml-2"
          key={currentStep}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {steps[currentStep].title}
        </motion.span>
      </div>
      <pre className="text-green-400 whitespace-pre-wrap min-h-[200px]">
        {displayedCode}
        {isTyping && (
          <motion.span
            className="text-green-400"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            |
          </motion.span>
        )}
      </pre>
    </motion.div>
  );
};

// Logos des clients satisfaits (simulés)
const ClientLogos = () => {
  const clients = [
    "TechStart", "InnoVenture", "DigitalPro", "MarketBoost", 
    "CreativeMinds", "BusinessFlow", "StartupLab", "GrowthHack"
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
      {clients.map((client, index) => (
        <div key={index} className="text-gray-400 font-semibold text-lg">
          {client}
        </div>
      ))}
    </div>
  );
};

// Statistiques animées
const AnimatedStats = () => {
  const [counts, setCounts] = useState({ users: 0, products: 0, revenue: 0 });
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  
  useEffect(() => {
    if (!isInView) return;
    
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
  }, [isInView]);

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <div ref={ref} className="grid grid-cols-3 gap-8 text-center">
      {[
        { value: counts.users, suffix: '+', label: 'Entrepreneurs actifs' },
        { value: counts.products, suffix: '+', label: 'Produits PLR' },
        { value: counts.revenue, suffix: '%', label: 'Marge moyenne' }
      ].map((stat, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={statVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="text-3xl font-bold text-[#ff0033] mb-1"
            animate={isInView ? { scale: [1, 1.1, 1] } : {}}
            transition={{ delay: index * 0.2 + 0.5, duration: 0.3 }}
          >
            {stat.value}{stat.suffix}
          </motion.div>
          <div className="text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Composant principal
export default function ModernHomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#18181b] text-white overflow-hidden">
      
      {/* Hero Section Moderne */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 py-20 relative"
        style={{ y: y1, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 bg-[#ff0033]/10 text-[#ff0033] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#ff0033]/20"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            variants={itemVariants}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Transformez des
            </motion.span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff0033] to-[#ff6b6b]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            >
              Produits Digitaux
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              en Business Automatisé
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Accédez à 500+ produits PLR premium, personnalisez-les avec votre branding, 
            et commencez à vendre en quelques clics. Jusqu'à 95% de marge, livraison instantanée.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={itemVariants}
          >
            <Link href="/auth/signin">
              <motion.button 
                className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[#ff0033]/20 hover:shadow-2xl flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Rocket className="w-5 h-5" />
                </motion.div>
                Démarrer gratuitement
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
            <motion.button 
              className="border border-gray-600 hover:border-gray-400 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:bg-gray-800/50 flex items-center gap-2"
              whileHover={{ scale: 1.02, borderColor: "#9ca3af" }}
              whileTap={{ scale: 0.98 }}
            >
              <PlayCircle className="w-5 h-5" />
              Voir la démo (2 min)
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="text-sm text-gray-400 flex flex-wrap justify-center gap-6"
            variants={itemVariants}
          >
            {[
              { icon: CheckCircle, text: "Aucune carte de crédit requise", color: "text-green-400" },
              { icon: Star, text: "300+ entrepreneurs nous font confiance", color: "text-yellow-400" },
              { icon: Lock, text: "Droits PLR complets inclus", color: "text-blue-400" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                {item.text}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Code Preview Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          style={{ y: y2 }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, threshold: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-2">Voyez comme c'est simple</h3>
            <p className="text-gray-400">3 étapes pour lancer votre business digital automatisé</p>
          </motion.div>
          <CodePreview />
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, threshold: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <AnimatedStats />
        </motion.div>
      </motion.section>

      {/* Trusted By Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <p className="text-gray-400 font-medium">Ils nous font déjà confiance</p>
        </div>
        <ClientLogos />
      </section>

      {/* Features en grid moderne */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, threshold: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Pourquoi choisir DropSkills ?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            La seule plateforme qui vous donne tout ce qu'il faut pour réussir dans le digital
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              className="group bg-[#111111] border border-[#222] rounded-2xl p-8 hover:border-[#333] transition-all duration-500 cursor-pointer overflow-hidden relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, threshold: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: `0 20px 40px ${feature.color}20`
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${feature.color}20, transparent)` }}
              />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <motion.span 
                  className="text-sm font-mono text-gray-400 bg-[#1a1a1a] px-2 py-1 rounded"
                  whileHover={{ scale: 1.1 }}
                >
                  {feature.stats}
                </motion.span>
              </div>
              <motion.h3 
                className="text-xl font-bold mb-3 group-hover:text-[#ff0033] transition-colors duration-300 relative z-10"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                {feature.title}
              </motion.h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Témoignages modernes */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, threshold: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ce qu'en disent nos entrepreneurs
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              text: "J'ai fait mes premières 1000€ en 2 semaines avec DropSkills. Le rebranding automatique est une dinguerie !",
              author: "Moussa I.",
              role: "Coach Business",
              avatar: "M",
              bg: "bg-blue-500"
            },
            {
              text: "Enfin une plateforme française sérieuse ! Support réactif, produits de qualité, je recommande à 100%.",
              author: "Stéphanie P.",
              role: "Formatrice en ligne",
              avatar: "S",
              bg: "bg-purple-500"
            },
            {
              text: "Grâce aux tunnels auto-générés, j'ai économisé 3000€ en frais d'agence. ROI immédiat !",
              author: "Fatou S.",
              role: "Entrepreneure",
              avatar: "F",
              bg: "bg-green-500"
            }
          ].map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-[#111111] border border-[#222] rounded-2xl p-8 hover:border-[#333] transition-all duration-300 cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, threshold: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              />
              <motion.div 
                className="flex items-center gap-1 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.4 + i * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                  >
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>
              <motion.p 
                className="text-gray-300 mb-6 italic leading-relaxed relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
              >
                "{testimonial.text}"
              </motion.p>
              <motion.div 
                className="flex items-center gap-3 relative z-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 + 0.7, duration: 0.6 }}
              >
                <motion.div 
                  className={`w-10 h-10 ${testimonial.bg} rounded-full flex items-center justify-center text-white font-bold`}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Pricing moderne */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choisissez votre plan de réussite</h2>
          <p className="text-xl text-gray-300">Commencez gratuitement, évoluez selon vos besoins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan Gratuit */}
          <div className="bg-[#111111] border border-[#222] rounded-2xl p-8 hover:border-[#333] transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Découverte</h3>
              <div className="text-4xl font-bold text-[#ff0033] mb-2">Gratuit</div>
              <p className="text-gray-400">Pour découvrir la plateforme</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {[
                "Pack de 27 formations offertes",
                "Accès limité au catalogue",
                "Tutoriels de démarrage",
                "Support communautaire"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/auth/signin">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300">
                Commencer gratuitement
              </button>
            </Link>
          </div>

          {/* Plan Pro (Featured) */}
          <div className="bg-[#111111] border-2 border-[#ff0033] rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#ff0033] text-white px-4 py-1 text-sm font-bold">
              POPULAIRE
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-[#ff0033]">27€</span>
                <div className="text-left">
                  <div className="text-lg line-through text-gray-400">47€</div>
                  <div className="text-sm text-gray-400">/mois</div>
                </div>
              </div>
              <p className="text-gray-400">Pour entrepreneurs sérieux</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {[
                "Catalogue complet (500+ produits)",
                "Droits PLR illimités",
                "Rebranding automatique IA",
                "Tunnels de vente auto-générés",
                "Templates emails inclus",
                "Support prioritaire",
                "Communauté privée"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/auth/signin">
              <button className="w-full bg-[#ff0033] hover:bg-[#cc0029] text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                Lancer mon business
              </button>
            </Link>
          </div>

          {/* Plan Master */}
          <div className="bg-[#111111] border border-[#222] rounded-2xl p-8 hover:border-[#333] transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Master</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-[#ff0033]">697€</span>
                <div className="text-left">
                  <div className="text-lg line-through text-gray-400">1497€</div>
                  <div className="text-sm text-gray-400">à vie</div>
                </div>
              </div>
              <p className="text-gray-400">Investissement à vie</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {[
                "Tout du plan Pro à vie",
                "Catalogue + MRR exclusifs",
                "Outils IA avancés illimités",
                "Formation complète incluse",
                "Coaching mensuel groupe",
                "Support VIP 24/7",
                "Accès anticipé nouvelles features"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/auth/signin">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300">
                Accès VIP à vie
              </button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">🔒 Paiement sécurisé - Satisfait ou remboursé 30 jours</p>
          <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
            <span>Stripe</span>
            <span>PayPal</span>
            <span>CB Sécurisée</span>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-[#ff0033]/10 to-[#ff6b6b]/10 border border-[#ff0033]/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à transformer votre expertise en revenus automatiques ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez les 300+ entrepreneurs qui ont déjà lancé leur business digital avec DropSkills
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signin">
              <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Commencer maintenant
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <div className="text-sm text-gray-400">
              ✨ 27 formations offertes • ⚡ Accès immédiat • 🎯 Sans engagement
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4">DropSkills</h3>
              <p className="text-gray-400 mb-4">
                La première plateforme française d'automatisation PLR pour entrepreneurs ambitieux.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholder */}
                <div className="w-8 h-8 bg-[#333] rounded-lg"></div>
                <div className="w-8 h-8 bg-[#333] rounded-lg"></div>
                <div className="w-8 h-8 bg-[#333] rounded-lg"></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/outils" className="hover:text-white transition-colors">Catalogue PLR</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/premium" className="hover:text-white transition-colors">Plans & Tarifs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/support" className="hover:text-white transition-colors">Centre d'aide</Link></li>
                <li><Link href="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">CGU</Link></li>
                <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#222] pt-8 text-center text-gray-400">
            <p>&copy; 2025 DropSkills.fr - Tous droits réservés. Fait avec ❤️ en France</p>
          </div>
        </div>
      </footer>
    </div>
  );
}