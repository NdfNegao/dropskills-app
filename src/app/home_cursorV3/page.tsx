'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  Star, Zap, Target, Mail, BarChart3, Shield, Crown,
  Sparkles, CheckCircle, ShoppingCart, Rocket, Lock, ArrowRight,
  PlayCircle, Download, Eye, Code, Layers, Cpu, TrendingUp,
  Users, Package, Copy, DollarSign, Clock, Infinity
} from 'lucide-react';

// Variants d'animations pour le nouveau style
const popInVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const slideInLeftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInRightVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerFastVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Composant de défilement d'images de produits
const ProductsCarousel = ({ direction = "left" }) => {
  const products = [
    "Formation E-commerce", "Guide Instagram", "Templates Funnels", "Pack Email Marketing",
    "Méthode Dropshipping", "Formation Facebook Ads", "Guide YouTube", "Pack PLR Business",
    "Formation Affiliation", "Templates Réseaux Sociaux", "Guide TikTok", "Pack Infopreneurs",
    "Formation Copywriting", "Templates Landing Pages", "Guide LinkedIn", "Pack Formations",
    "Méthode Growth Hacking", "Formation SEO", "Guide Pinterest", "Pack Marketing Digital",
    "Formation Webinaires"
  ];

  return (
    <div className="overflow-hidden py-4">
      <motion.div 
        className="flex gap-6 whitespace-nowrap"
        animate={{ 
          x: direction === "left" ? [0, -1000] : [-1000, 0] 
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[...products, ...products].map((product, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-r from-[#ff0033]/20 to-[#ff6b6b]/20 border border-[#ff0033]/30 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255, 0, 51, 0.3)",
              transition: { duration: 0.2 }
            }}
          >
            {product}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Composant d'animation "Copier - Coller - Encaisser"
const CopyPasteAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Copier", "Coller", "Encaisser"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 my-8">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-500 ${
            currentStep === index 
              ? 'bg-[#ff0033] text-white scale-110 shadow-lg' 
              : 'bg-gray-800 text-gray-400'
          }`}
          animate={{
            scale: currentStep === index ? 1.1 : 1,
            backgroundColor: currentStep === index ? "#ff0033" : "#1f2937"
          }}
        >
          {step}
        </motion.div>
      ))}
    </div>
  );
};

// Composant principal
export default function HomePageV3() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#18181b] text-white">
      
      {/* Hero Section - Style Digital Dropshipping */}
      <motion.section 
        ref={heroRef}
        className="max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Badge France */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-6 py-3 rounded-full text-lg font-bold border border-blue-500/30">
            <span className="text-2xl">🇫🇷</span>
            DropSkills, Leader du Digital Dropshipping en France
          </div>
        </motion.div>

        {/* Titre Principal */}
        <motion.div 
          className="text-center mb-12"
          variants={staggerFastVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-black mb-6 leading-tight"
            variants={popInVariants}
          >
            <span className="block">Revendez des</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff0033] to-[#ff6b6b]">
              Produits Digitaux
            </span>
            <span className="block text-4xl md:text-5xl mt-4 text-gray-300">
              Sans Devoir les Créer
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            variants={popInVariants}
          >
            Imaginez disposer instantanément de vos propres produits digitaux : 
            <span className="text-[#ff0033] font-bold"> e-books, cours vidéo, templates</span> et bien plus encore.
          </motion.p>

          <motion.p 
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
            variants={popInVariants}
          >
            Rebrandez-les, revendez-les ou utilisez-les comme bon vous semble, 
            sans gros investissements ni mois de création.
          </motion.p>

          {/* Badges de vente */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-8"
            variants={staggerFastVariants}
          >
            {[
              { icon: <Crown className="w-6 h-6" />, text: "Ressources premium", color: "text-yellow-400" },
              { icon: <Infinity className="w-6 h-6" />, text: "Mises à jour à vie", color: "text-blue-400" },
              { icon: <DollarSign className="w-6 h-6" />, text: "100% de profit pour vous", color: "text-green-400" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700"
                variants={popInVariants}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255, 0, 51, 0.1)",
                  borderColor: "rgba(255, 0, 51, 0.3)"
                }}
              >
                <span className={item.color}>{item.icon}</span>
                <span className="font-semibold">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="flex items-center justify-center gap-2 mb-8 text-yellow-400"
            variants={popInVariants}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="font-bold ml-2">Validé par +300 entrepreneurs</span>
          </motion.div>

          {/* CTA Principal */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={popInVariants}
          >
            <Link href="/auth/signin">
              <motion.button 
                className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-10 py-5 rounded-xl font-black text-xl shadow-2xl flex items-center gap-3"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(255, 0, 51, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-6 h-6" />
                COMMANDER MAINTENANT
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Carousel de produits */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <ProductsCarousel direction="left" />
          <ProductsCarousel direction="right" />
        </motion.div>
      </motion.section>

      {/* Section Lead Magnet */}
      <motion.section 
        className="max-w-4xl mx-auto px-4 py-16 text-center"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-[#ff0033]/10 to-[#ff6b6b]/10 border-2 border-[#ff0033]/30 rounded-3xl p-12"
          whileHover={{ 
            borderColor: "rgba(255, 0, 51, 0.5)",
            boxShadow: "0 20px 40px rgba(255, 0, 51, 0.2)"
          }}
        >
          <h2 className="text-4xl font-black mb-4">
            Teste <span className="text-[#ff0033]">GRATUITEMENT</span> 27 formations exclusives
          </h2>
          <p className="text-2xl mb-8 text-gray-300">
            pour démarrer ton aventure, prêt à relever le défi ?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Email"
              className="flex-1 px-6 py-4 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-[#ff0033] focus:outline-none"
            />
            <motion.button 
              className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-4 rounded-xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              RECEVOIR MON PACK GRATUIT !
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* Section Copier-Coller-Encaisser */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center">
          <motion.h2 
            className="text-5xl md:text-6xl font-black mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#ff0033]">Copier</span> - 
            <span className="text-[#ff6b6b]"> Coller</span> - 
            <span className="text-[#ff0033]"> Encaisser</span>
          </motion.h2>
          
          <motion.p 
            className="text-2xl text-gray-300 mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Le Moyen le Plus Simple de Lancer un Business en 2025.
          </motion.p>

          <CopyPasteAnimation />

          <motion.p 
            className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            L'infoprenariat est <span className="text-[#ff0033] font-bold">LE business le plus simple et le plus lucratif</span> à lancer en 2025, 
            et ça, les gourous du net l'ont bien compris. L'explosion de l'intelligence artificielle (AI) a totalement rebattu les cartes.
          </motion.p>
        </div>
      </motion.section>

      {/* Section Offre All-in-One */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={slideInLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-black mb-6">
              Offre <span className="text-[#ff0033]">All in One</span> qui comprend :
            </h3>
            <ul className="space-y-4 text-xl">
              {[
                "formations en ligne", "ebooks", "templates", "tunnel de vente", "séquence email"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="space-y-6"
            variants={slideInRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="bg-[#111111] border border-[#333] rounded-2xl p-6">
              <h4 className="text-2xl font-bold mb-3 text-[#ff0033]">Totalement personnalisable</h4>
              <p className="text-gray-400">Modifie les titres, les textes, le logo pour coller à ta marque</p>
            </div>
            
            <div className="bg-[#111111] border border-[#333] rounded-2xl p-6">
              <h4 className="text-2xl font-bold mb-3 text-[#ff0033]">100% À TOI</h4>
              <p className="text-gray-400">Formez vous, revendez (en pack ou à l'unité), les produits sont à vous, faites en ce que vous voulez !</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/catalogue">
            <motion.button 
              className="bg-gradient-to-r from-[#ff0033] to-[#ff6b6b] text-white px-12 py-5 rounded-xl font-black text-xl"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 0, 51, 0.3)"
              }}
            >
              DÉCOUVRIR LE CATALOGUE
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Section Revenus */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 py-20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-5xl font-black mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
        >
          Transformez des <span className="text-[#ff0033]">Formations Digitales</span><br />
          en <span className="text-[#ff6b6b]">Revenus Réels</span> en quelques clics !
        </motion.h2>

        <motion.p 
          className="text-3xl font-bold text-[#ff0033] mb-12"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Génères jusqu'à 5K€/mois grâce au Digital Dropshipping.
        </motion.p>

        {/* Carousel de produits */}
        <motion.div 
          className="space-y-2 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ProductsCarousel direction="left" />
          <ProductsCarousel direction="right" />
        </motion.div>

        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Le Digital Dropshipping, c'est l'art de vendre des produits digitaux sans stock, 
          avec jusqu'à <span className="text-[#ff0033] font-bold">95% de marge</span> et des ventes automatisées 24/7. 
          Avec Dropskills, accédez à plus de <span className="text-[#ff0033] font-bold">100 formations clé en main</span> à revendre sous votre marque.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/auth/signin">
            <motion.button 
              className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-12 py-5 rounded-xl font-black text-xl"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 0, 51, 0.3)"
              }}
            >
              COMMANDER MAINTENANT
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Footer simple */}
      <motion.footer 
        className="border-t border-[#222] py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 DropSkills.fr - Leader du Digital Dropshipping en France 🇫🇷</p>
        </div>
      </motion.footer>
    </div>
  );
} 