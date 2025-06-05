require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { PRODUCTS } = require('../src/data/products.ts');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables Supabase manquantes');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateProducts() {
  console.log('🚀 Début de la migration des produits...');
  console.log(`📦 ${PRODUCTS.length} produits à migrer`);

  try {
    // Vérifier si la table existe
    const { data: tables, error: tableError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Erreur d\'accès à la table products:', tableError.message);
      console.log('💡 Assurez-vous que la migration 002_products_table.sql a été exécutée');
      return;
    }

    // Transformer les données pour Supabase
    const productsToInsert = PRODUCTS.map(product => ({
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

    if (deleteError) {
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
    console.log('📖 Premiers produits:');
    finalCheck.slice(0, 5).forEach(product => {
      console.log(`  - ${product.title} ${product.is_premium ? '👑' : '🆓'}`);
    });

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Exécution
migrateProducts(); 