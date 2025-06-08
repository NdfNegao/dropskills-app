import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test de l\'intégration Systeme.io...');

    const tests = [];

    // Test 1: Vérifier les tables Systeme.io
    try {
      const { data: products, error: productsError } = await supabase
        .from('systeme_io_products')
        .select('*')
        .limit(5);

      tests.push({
        name: 'Table systeme_io_products',
        status: productsError ? 'error' : 'success',
        data: products || [],
        error: productsError?.message
      });
    } catch (error) {
      tests.push({
        name: 'Table systeme_io_products',
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 2: Vérifier les commandes
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('systeme_io_orders')
        .select('*')
        .limit(5);

      tests.push({
        name: 'Table systeme_io_orders',
        status: ordersError ? 'error' : 'success',
        data: orders || [],
        error: ordersError?.message
      });
    } catch (error) {
      tests.push({
        name: 'Table systeme_io_orders',
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 3: Vérifier les webhooks logs
    try {
      const { data: webhooks, error: webhooksError } = await supabase
        .from('systeme_io_webhooks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      tests.push({
        name: 'Table systeme_io_webhooks',
        status: webhooksError ? 'error' : 'success',
        data: webhooks || [],
        error: webhooksError?.message
      });
    } catch (error) {
      tests.push({
        name: 'Table systeme_io_webhooks',
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 4: Vérifier les logs de sync
    try {
      const { data: syncLogs, error: syncError } = await supabase
        .from('systeme_io_sync_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(5);

      tests.push({
        name: 'Table systeme_io_sync_logs',
        status: syncError ? 'error' : 'success',
        data: syncLogs || [],
        error: syncError?.message
      });
    } catch (error) {
      tests.push({
        name: 'Table systeme_io_sync_logs',
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 5: Vérifier les variables d'environnement
    const envTests = {
      SYSTEME_IO_WEBHOOK_SECRET: !!process.env.SYSTEME_IO_WEBHOOK_SECRET,
      SYSTEME_IO_API_KEY: !!process.env.SYSTEME_IO_API_KEY
    };

    tests.push({
      name: 'Variables d\'environnement',
      status: Object.values(envTests).every(Boolean) ? 'success' : 'warning',
      data: envTests
    });

    // Test 6: Statistiques générales
    try {
      const stats = await getSystemeIoStats();
      tests.push({
        name: 'Statistiques Systeme.io',
        status: 'success',
        data: stats
      });
    } catch (error) {
      tests.push({
        name: 'Statistiques Systeme.io',
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    const successCount = tests.filter(t => t.status === 'success').length;
    const errorCount = tests.filter(t => t.status === 'error').length;
    const warningCount = tests.filter(t => t.status === 'warning').length;

    console.log(`✅ Tests terminés: ${successCount} succès, ${warningCount} avertissements, ${errorCount} erreurs`);

    return NextResponse.json({
      success: true,
      message: 'Tests de l\'intégration Systeme.io terminés',
      summary: {
        total_tests: tests.length,
        success: successCount,
        warnings: warningCount,
        errors: errorCount,
        overall_status: errorCount === 0 ? (warningCount === 0 ? 'healthy' : 'warning') : 'error'
      },
      tests
    });

  } catch (error) {
    console.error('❌ Erreur tests Systeme.io:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'create_test_data':
        return await createTestData();
      case 'simulate_webhook':
        return await simulateWebhook();
      case 'cleanup_test_data':
        return await cleanupTestData();
      default:
        return NextResponse.json({
          success: false,
          error: 'Action non supportée'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Erreur action test:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

async function getSystemeIoStats() {
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: webhooksCount },
    { count: syncLogsCount }
  ] = await Promise.all([
    supabase.from('systeme_io_products').select('*', { count: 'exact', head: true }),
    supabase.from('systeme_io_orders').select('*', { count: 'exact', head: true }),
    supabase.from('systeme_io_webhooks').select('*', { count: 'exact', head: true }),
    supabase.from('systeme_io_sync_logs').select('*', { count: 'exact', head: true })
  ]);

  // Statistiques des webhooks par type
  const { data: webhookStats } = await supabase
    .from('systeme_io_webhooks')
    .select('event_type, processed')
    .order('created_at', { ascending: false })
    .limit(100);

  const webhooksByType = webhookStats?.reduce((acc: any, webhook) => {
    const type = webhook.event_type;
    if (!acc[type]) {
      acc[type] = { total: 0, processed: 0, failed: 0 };
    }
    acc[type].total++;
    if (webhook.processed) {
      acc[type].processed++;
    } else {
      acc[type].failed++;
    }
    return acc;
  }, {}) || {};

  return {
    products_count: productsCount || 0,
    orders_count: ordersCount || 0,
    webhooks_count: webhooksCount || 0,
    sync_logs_count: syncLogsCount || 0,
    webhooks_by_type: webhooksByType
  };
}

async function createTestData() {
  try {
    console.log('🧪 Création de données de test Systeme.io...');

    // Récupérer quelques packs existants
    const { data: packs } = await supabase
      .from('packs')
      .select('id, title, price')
      .limit(3);

    if (!packs || packs.length === 0) {
      throw new Error('Aucun pack disponible pour les tests');
    }

    // Créer des produits de test
    const testProducts = [
      {
        systeme_io_product_id: 'test_prod_001',
        pack_id: packs[0].id,
        product_name: `${packs[0].title} - Test Systeme.io`,
        product_price: packs[0].price || 97.00,
        currency: 'EUR',
        status: 'active'
      },
      {
        systeme_io_product_id: 'test_prod_002',
        pack_id: packs[1]?.id || packs[0].id,
        product_name: `${packs[1]?.title || packs[0].title} - Test Premium`,
        product_price: (packs[1]?.price || packs[0].price) || 147.00,
        currency: 'EUR',
        status: 'active'
      }
    ];

    const { data: createdProducts, error: productsError } = await supabase
      .from('systeme_io_products')
      .upsert(testProducts, { onConflict: 'systeme_io_product_id' })
      .select();

    if (productsError) {
      throw productsError;
    }

    // Créer des commandes de test
    const testOrders = [
      {
        systeme_io_order_id: 'test_order_001',
        systeme_io_product_id: 'test_prod_001',
        customer_email: 'test.customer1@example.com',
        customer_first_name: 'Jean',
        customer_last_name: 'Dupont',
        total_amount: 97.00,
        currency: 'EUR',
        status: 'completed',
        order_date: new Date().toISOString()
      },
      {
        systeme_io_order_id: 'test_order_002',
        systeme_io_product_id: 'test_prod_002',
        customer_email: 'test.customer2@example.com',
        customer_first_name: 'Marie',
        customer_last_name: 'Martin',
        total_amount: 147.00,
        currency: 'EUR',
        status: 'completed',
        order_date: new Date().toISOString()
      }
    ];

    const { data: createdOrders, error: ordersError } = await supabase
      .from('systeme_io_orders')
      .upsert(testOrders, { onConflict: 'systeme_io_order_id' })
      .select();

    if (ordersError) {
      throw ordersError;
    }

    console.log('✅ Données de test créées avec succès');

    return NextResponse.json({
      success: true,
      message: 'Données de test créées avec succès',
      data: {
        products: createdProducts,
        orders: createdOrders
      }
    });

  } catch (error) {
    console.error('❌ Erreur création données de test:', error);
    throw error;
  }
}

async function simulateWebhook() {
  try {
    console.log('🧪 Simulation d\'un webhook Systeme.io...');

    const testWebhookData = {
      event_type: 'order.completed',
      event_id: 'test_event_' + Date.now(),
      order: {
        id: 'test_order_' + Date.now(),
        total_amount: 97.00,
        currency: 'EUR',
        status: 'completed',
        created_at: new Date().toISOString()
      },
      customer: {
        email: 'test.webhook@example.com',
        first_name: 'Test',
        last_name: 'Webhook'
      },
      product: {
        id: 'test_prod_001'
      }
    };

    // Enregistrer le webhook simulé
    const { data: webhookLog, error: webhookError } = await supabase
      .from('systeme_io_webhooks')
      .insert({
        event_type: testWebhookData.event_type,
        event_id: testWebhookData.event_id,
        payload: testWebhookData,
        signature: 'test_signature',
        processed: true,
        processed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (webhookError) {
      throw webhookError;
    }

    console.log('✅ Webhook simulé avec succès');

    return NextResponse.json({
      success: true,
      message: 'Webhook simulé avec succès',
      data: {
        webhook_log: webhookLog,
        test_data: testWebhookData
      }
    });

  } catch (error) {
    console.error('❌ Erreur simulation webhook:', error);
    throw error;
  }
}

async function cleanupTestData() {
  try {
    console.log('🧹 Nettoyage des données de test...');

    // Supprimer les données de test
    const cleanupResults = await Promise.allSettled([
      supabase.from('systeme_io_orders').delete().ilike('systeme_io_order_id', 'test_%'),
      supabase.from('systeme_io_products').delete().ilike('systeme_io_product_id', 'test_%'),
      supabase.from('systeme_io_webhooks').delete().ilike('event_id', 'test_%')
    ]);

    console.log('✅ Nettoyage terminé');

    return NextResponse.json({
      success: true,
      message: 'Données de test nettoyées',
      data: {
        cleanup_results: cleanupResults.map((result, index) => ({
          table: ['orders', 'products', 'webhooks'][index],
          status: result.status,
          error: result.status === 'rejected' ? result.reason : null
        }))
      }
    });

  } catch (error) {
    console.error('❌ Erreur nettoyage:', error);
    throw error;
  }
}