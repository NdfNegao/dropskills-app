import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Configuration des tables Systeme.io...');

    // Script SQL pour créer les tables
    const sqlScript = `
      -- ============================================================================
      -- TABLES POUR L'INTÉGRATION SYSTEME.IO
      -- ============================================================================

      -- 1. TABLE SYSTEME_IO_PRODUCTS
      CREATE TABLE IF NOT EXISTS systeme_io_products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        systeme_io_product_id VARCHAR(255) UNIQUE NOT NULL,
        pack_id UUID REFERENCES packs(id) ON DELETE SET NULL,
        product_name VARCHAR(255) NOT NULL,
        product_price DECIMAL(10,2) NOT NULL DEFAULT 0,
        currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Index pour les recherches fréquentes
      CREATE INDEX IF NOT EXISTS idx_systeme_io_products_product_id ON systeme_io_products(systeme_io_product_id);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_products_pack_id ON systeme_io_products(pack_id);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_products_status ON systeme_io_products(status);

      -- 2. TABLE SYSTEME_IO_ORDERS
      CREATE TABLE IF NOT EXISTS systeme_io_orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        systeme_io_order_id VARCHAR(255) UNIQUE NOT NULL,
        systeme_io_product_id VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_first_name VARCHAR(255),
        customer_last_name VARCHAR(255),
        total_amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
        status VARCHAR(50) NOT NULL,
        order_date TIMESTAMP WITH TIME ZONE NOT NULL,
        processed_at TIMESTAMP WITH TIME ZONE,
        user_id UUID,
        pack_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Index pour les recherches fréquentes
      CREATE INDEX IF NOT EXISTS idx_systeme_io_orders_order_id ON systeme_io_orders(systeme_io_order_id);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_orders_product_id ON systeme_io_orders(systeme_io_product_id);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_orders_customer_email ON systeme_io_orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_orders_status ON systeme_io_orders(status);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_orders_order_date ON systeme_io_orders(order_date);

      -- 3. TABLE SYSTEME_IO_WEBHOOKS
      CREATE TABLE IF NOT EXISTS systeme_io_webhooks (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_id VARCHAR(255),
        payload JSONB NOT NULL,
        signature VARCHAR(255),
        processed BOOLEAN DEFAULT FALSE,
        processed_at TIMESTAMP WITH TIME ZONE,
        error_message TEXT,
        retry_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Index pour les recherches fréquentes
      CREATE INDEX IF NOT EXISTS idx_systeme_io_webhooks_event_type ON systeme_io_webhooks(event_type);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_webhooks_event_id ON systeme_io_webhooks(event_id);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_webhooks_processed ON systeme_io_webhooks(processed);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_webhooks_created_at ON systeme_io_webhooks(created_at);

      -- 4. TABLE SYSTEME_IO_SYNC_LOGS
      CREATE TABLE IF NOT EXISTS systeme_io_sync_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        sync_type VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
        total_items INTEGER DEFAULT 0,
        processed_items INTEGER DEFAULT 0,
        failed_items INTEGER DEFAULT 0,
        error_message TEXT,
        sync_data JSONB,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
      );

      -- Index pour les recherches fréquentes
      CREATE INDEX IF NOT EXISTS idx_systeme_io_sync_logs_type ON systeme_io_sync_logs(sync_type);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_sync_logs_status ON systeme_io_sync_logs(status);
      CREATE INDEX IF NOT EXISTS idx_systeme_io_sync_logs_started_at ON systeme_io_sync_logs(started_at);
    `;

    // Exécuter le script SQL par parties
    const sqlStatements = sqlScript
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const statement of sqlStatements) {
      try {
        const { data, error } = await supabaseAdmin.rpc('exec_sql', {
          sql_query: statement + ';'
        });

        if (error) {
          // Si la fonction n'existe pas, essayer directement
          console.warn('⚠️ exec_sql non disponible, création manuelle des tables requise');
          results.push({
            statement: statement.substring(0, 50) + '...',
            status: 'warning',
            message: 'Fonction exec_sql non disponible'
          });
          errorCount++;
        } else {
          results.push({
            statement: statement.substring(0, 50) + '...',
            status: 'success'
          });
          successCount++;
        }
      } catch (error) {
        results.push({
          statement: statement.substring(0, 50) + '...',
          status: 'error',
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
        errorCount++;
      }
    }

    // Créer les triggers
    await createTriggers();

    // Créer les politiques RLS
    await createPolicies();

    // Vérifier que les tables existent
    const tablesCheck = await checkTables();

    console.log(`✅ Configuration terminée: ${successCount} succès, ${errorCount} erreurs`);

    return NextResponse.json({
      success: errorCount === 0,
      message: errorCount === 0 ? 'Tables Systeme.io créées avec succès' : 'Configuration partielle',
      data: {
        sql_execution: {
          total: sqlStatements.length,
          success: successCount,
          errors: errorCount,
          results
        },
        tables_check: tablesCheck,
        note: errorCount > 0 ? 'Veuillez exécuter le script SQL manuellement dans Supabase' : null
      }
    });

  } catch (error) {
    console.error('❌ Erreur configuration Systeme.io:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      note: 'Veuillez exécuter le script systeme_io_tables.sql manuellement dans Supabase'
    }, { status: 500 });
  }
}

async function createTriggers() {
  try {
    // Trigger pour systeme_io_products
    await supabaseAdmin.rpc('exec_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION update_systeme_io_products_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_update_systeme_io_products_updated_at ON systeme_io_products;
        CREATE TRIGGER trigger_update_systeme_io_products_updated_at
          BEFORE UPDATE ON systeme_io_products
          FOR EACH ROW
          EXECUTE FUNCTION update_systeme_io_products_updated_at();
      `
    });

    // Trigger pour systeme_io_orders
    await supabaseAdmin.rpc('exec_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION update_systeme_io_orders_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_update_systeme_io_orders_updated_at ON systeme_io_orders;
        CREATE TRIGGER trigger_update_systeme_io_orders_updated_at
          BEFORE UPDATE ON systeme_io_orders
          FOR EACH ROW
          EXECUTE FUNCTION update_systeme_io_orders_updated_at();
      `
    });
  } catch (error) {
    console.warn('⚠️ Impossible de créer les triggers automatiquement');
  }
}

async function createPolicies() {
  try {
    const tables = ['systeme_io_products', 'systeme_io_orders', 'systeme_io_webhooks', 'systeme_io_sync_logs'];
    
    for (const table of tables) {
      await supabaseAdmin.rpc('exec_sql', {
        sql_query: `
          ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
          
          DROP POLICY IF EXISTS "Allow all operations on ${table}" ON ${table};
          CREATE POLICY "Allow all operations on ${table}" ON ${table}
          FOR ALL USING (true) WITH CHECK (true);
        `
      });
    }
  } catch (error) {
    console.warn('⚠️ Impossible de créer les politiques RLS automatiquement');
  }
}

async function checkTables() {
  const tables = ['systeme_io_products', 'systeme_io_orders', 'systeme_io_webhooks', 'systeme_io_sync_logs'];
  const results = {};

  for (const table of tables) {
    try {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true });

      results[table] = {
        exists: !error,
        count: count || 0,
        error: error?.message
      };
    } catch (error) {
      results[table] = {
        exists: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  return results;
} 