require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Données produits (extrait de products.ts)
const PRODUCTS_DATA = [
  {
    id: "youtube-accelerator",
    title: "The 6-Day YouTube Accelerator",
    subtitle: "Email course to master YouTube Ads & boost your business.",
    format: "Course",
    image: '/formations/youtube-accelerator.png',
    description: "Ce cours email clé-en-main donne à vos clients un système simple et éprouvé pour lancer et développer des campagnes publicitaires YouTube performantes.",
    shortDescription: "Email course designed to help you provide expert guidance on YouTube ads while upselling your services.",
    isPremium: true,
    downloads: 1247,
    rating: 4.8,
    category: "Digital Marketing",
    instructor: "DropSkills Team",
    duration: "6 jours",
    students: 0
  },
  {
    id: "psychology-selling",
    title: "The Psychology of Selling",
    subtitle: "How the brain buys, and how you can sell more.",
    format: "ebook",
    image: '/formations/psychology-selling.png',
    description: "Découvrez les secrets psychologiques qui influencent les décisions d'achat et boostez vos ventes.",
    shortDescription: "Un guide complet sur les techniques psychologiques de vente pour augmenter vos conversions.",
    isPremium: false,
    downloads: 892,
    rating: 4.6,
    category: "Sales & Psychology",
    instructor: "Dr. Marc Dubois",
    duration: "2h lecture",
    students: 0
  },
  {
    id: "social-media-workbook",
    title: "Social Media Strategy Workbook",
    subtitle: "Workbook interactif pour créer votre stratégie social media.",
    format: "Workbook",
    image: '/formations/social-media-workbook.png',
    description: "Workbook interactif de 60 pages pour développer une stratégie social media gagnante.",
    shortDescription: "Workbook pratique avec exercices pour maîtriser les réseaux sociaux.",
    isPremium: false,
    downloads: 567,
    rating: 4.5,
    category: "Social Media",
    instructor: "Sarah Johnson",
    duration: "4-6h travail",
    students: 0
  },
  {
    id: "chatgpt-prompts-pack",
    title: "ChatGPT Prompts Pack Pro",
    subtitle: "200+ prompts ChatGPT pour entrepreneurs et marketeurs.",
    format: "Prompt Pack",
    image: '/formations/chatgpt-prompts-pack.png',
    description: "Collection de 200+ prompts ChatGPT optimisés pour le business, marketing, copywriting et productivité.",
    shortDescription: "Pack de prompts ChatGPT professionnels pour booster votre productivité.",
    isPremium: true,
    downloads: 1089,
    rating: 4.9,
    category: "Intelligence Artificielle",
    instructor: "Alex Chen",
    duration: "Accès immédiat",
    students: 0
  },
  {
    id: "meta-ads-2025",
    title: "Meta Ads 2025",
    subtitle: "Maîtrisez la publicité Facebook & Instagram en 2025.",
    format: "Formation",
    image: '/formations/meta-ads-2025.png',
    description: "Toutes les stratégies Meta Ads à jour pour 2025.",
    shortDescription: "Meta Ads, Facebook & Instagram.",
    isPremium: true,
    downloads: 0,
    rating: 4.8,
    category: "Publicité",
    instructor: "Equipe Dropskills",
    duration: "9 modules",
    students: 0
  },
  {
    id: "affiliation-2025",
    title: "Affiliation 2025",
    subtitle: "Lancez-vous dans l'affiliation et trouvez un programme rentable.",
    format: "Formation",
    image: '/formations/affiliation-2025.png',
    description: "Découvrez les stratégies d'affiliation les plus rentables pour 2025.",
    shortDescription: "10 modules pour tout comprendre de l'affiliation.",
    isPremium: true,
    downloads: 0,
    rating: 4.8,
    category: "Business",
    instructor: "Equipe Dropskills",
    duration: "10 modules",
    students: 0
  },
  {
    id: "dropshipping-2025",
    title: "Dropshipping 2025",
    subtitle: "10 modules pour vous lancer avec un capital de 100€.",
    format: "Formation",
    image: '/formations/dropshipping-2025.png',
    description: "Maîtrisez le dropshipping nouvelle génération, sans stock et avec un minimum d'investissement.",
    shortDescription: "Stratégies dropshipping à jour pour 2025.",
    isPremium: true,
    downloads: 0,
    rating: 4.7,
    category: "E-commerce",
    instructor: "Equipe Dropskills",
    duration: "10 modules",
    students: 0
  }
];

async function migrateProducts() {
  console.log('🚀 Début de la migration des produits...');
  console.log(`📦 ${PRODUCTS_DATA.length} produits à migrer`);

  try {
    // Vérifier si la table existe
    const { data: tables, error: tableError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Erreur d\'accès à la table products:', tableError.message);
      console.log('💡 Assurez-vous que la table products a été créée');
      return;
    }

    console.log('✅ Table products accessible');

    // Transformer les données pour Supabase
    const productsToInsert = PRODUCTS_DATA.map(product => ({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle || null,
      format: product.format,
      image: product.image || null,
      description: product.description || null,
      short_description: product.shortDescription || null,
      long_description: product.longDescription || null,
      likes: product.likes || 0,
      file_url: product.fileUrl || null,
      tags: product.tags || [],
      pages: product.pages || null,
      words: product.words || null,
      size: product.size || null,
      file_type: product.fileType || null,
      images: product.images || [],
      details: product.details || [],
      rights: product.rights || [],
      is_premium: product.isPremium || false,
      downloads: product.downloads || 0,
      rating: product.rating || 0,
      category: product.category || null,
      instructor: product.instructor || null,
      duration: product.duration || null,
      features: product.features || [],
      permissions: product.permissions || [],
      preview_images: product.previewImages || [],
      download_url: product.downloadUrl || null,
      students: product.students || 0
    }));

    // Supprimer les données existantes (pour éviter les doublons)
    console.log('🗑️ Nettoyage des données existantes...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 'inexistant'); // Supprime tout

    if (deleteError && !deleteError.message.includes('0 rows')) {
      console.warn('⚠️ Erreur lors du nettoyage:', deleteError.message);
    }

    // Insérer les nouveaux produits
    console.log('📥 Insertion des produits...');
    const { data, error } = await supabase
      .from('products')
      .insert(productsToInsert);

    if (error) {
      console.error('❌ Erreur lors de l\'insertion:', error.message);
      return;
    }

    console.log('✅ Migration réussie !');
    console.log(`📊 ${productsToInsert.length} produits migrés`);
    
    // Statistiques
    const premiumCount = productsToInsert.filter(p => p.is_premium).length;
    const freeCount = productsToInsert.length - premiumCount;
    
    console.log(`👑 ${premiumCount} produits premium`);
    console.log(`🆓 ${freeCount} produits gratuits`);

    // Vérification finale
    const { data: finalCheck, error: checkError } = await supabase
      .from('products')
      .select('id, title, is_premium')
      .order('created_at', { ascending: false });

    if (checkError) {
      console.error('❌ Erreur lors de la vérification:', checkError.message);
      return;
    }

    console.log('🔍 Vérification finale:');
    console.log(`📋 ${finalCheck.length} produits en base`);
    console.log('📖 Produits migrés:');
    finalCheck.forEach(product => {
      console.log(`  - ${product.title} ${product.is_premium ? '👑' : '🆓'}`);
    });

    console.log('');
    console.log('🎯 Prêt pour tester l\'API admin !');

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Exécution
migrateProducts(); 