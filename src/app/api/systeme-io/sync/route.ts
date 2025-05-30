import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

// Configuration Systeme.io API
const SYSTEME_IO_API_BASE = 'https://api.systeme.io/v1';
const SYSTEME_IO_API_KEY = process.env.SYSTEME_IO_API_KEY;

interface SystemeIoApiProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SystemeIoApiOrder {
  id: string;
  product_id: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
  };
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
}

// Fonction pour appeler l'API Systeme.io
async function callSystemeIoApi(endpoint: string, options: RequestInit = {}) {
  if (!SYSTEME_IO_API_KEY) {
    throw new Error('SYSTEME_IO_API_KEY non configurée');
  }

  const response = await fetch(`${SYSTEME_IO_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${SYSTEME_IO_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur API Systeme.io: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'sync_products':
        return await syncProducts();
      case 'sync_orders':
        return await syncOrders(data?.since);
      case 'create_product':
        return await createProduct(data);
      case 'update_product':
        return await updateProduct(data);
      default:
        return NextResponse.json({
          success: false,
          error: 'Action non supportée'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Erreur synchronisation Systeme.io:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

async function syncProducts() {
  try {
    console.log('🔄 Synchronisation des produits Systeme.io...');

    // Récupérer les produits depuis Systeme.io
    const products: SystemeIoApiProduct[] = await callSystemeIoApi('/products');

    const syncResults = [];

    for (const product of products) {
      try {
        // Vérifier si le mapping existe déjà
        const { data: existingMapping } = await supabaseAdmin
          .from('systeme_io_products')
          .select('*')
          .eq('systeme_io_product_id', product.id)
          .single();

        if (existingMapping) {
          // Mettre à jour le mapping existant
          const { data: updatedMapping, error } = await supabaseAdmin
            .from('systeme_io_products')
            .update({
              product_name: product.name,
              product_price: product.price,
              currency: product.currency,
              status: product.status === 'active' ? 'active' : 'inactive',
              updated_at: new Date().toISOString()
            })
            .eq('systeme_io_product_id', product.id)
            .select()
            .single();

          if (error) {
            throw error;
          }

          syncResults.push({
            product_id: product.id,
            action: 'updated',
            data: updatedMapping
          });
        } else {
          // Créer un nouveau mapping (sans pack_id pour l'instant)
          const { data: newMapping, error } = await supabaseAdmin
            .from('systeme_io_products')
            .insert({
              systeme_io_product_id: product.id,
              product_name: product.name,
              product_price: product.price,
              currency: product.currency,
              status: product.status === 'active' ? 'active' : 'inactive'
            })
            .select()
            .single();

          if (error) {
            throw error;
          }

          syncResults.push({
            product_id: product.id,
            action: 'created',
            data: newMapping
          });
        }
      } catch (error) {
        console.error(`❌ Erreur sync produit ${product.id}:`, error);
        syncResults.push({
          product_id: product.id,
          action: 'error',
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    console.log('✅ Synchronisation produits terminée');

    return NextResponse.json({
      success: true,
      message: 'Synchronisation des produits terminée',
      data: {
        total_products: products.length,
        results: syncResults,
        summary: {
          created: syncResults.filter(r => r.action === 'created').length,
          updated: syncResults.filter(r => r.action === 'updated').length,
          errors: syncResults.filter(r => r.action === 'error').length
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur synchronisation produits:', error);
    throw error;
  }
}

async function syncOrders(since?: string) {
  try {
    console.log('🔄 Synchronisation des commandes Systeme.io...');

    // Construire l'endpoint avec filtre de date si fourni
    let endpoint = '/orders';
    if (since) {
      endpoint += `?since=${since}`;
    }

    // Récupérer les commandes depuis Systeme.io
    const orders: SystemeIoApiOrder[] = await callSystemeIoApi(endpoint);

    const syncResults = [];

    for (const order of orders) {
      try {
        // Vérifier si la commande existe déjà
        const { data: existingOrder } = await supabaseAdmin
          .from('systeme_io_orders')
          .select('*')
          .eq('systeme_io_order_id', order.id)
          .single();

        if (!existingOrder) {
          // Créer la commande
          const { data: newOrder, error } = await supabaseAdmin
            .from('systeme_io_orders')
            .insert({
              systeme_io_order_id: order.id,
              systeme_io_product_id: order.product_id,
              customer_email: order.customer.email,
              customer_first_name: order.customer.first_name,
              customer_last_name: order.customer.last_name,
              total_amount: order.total_amount,
              currency: order.currency,
              status: order.status,
              order_date: order.created_at
            })
            .select()
            .single();

          if (error) {
            throw error;
          }

          syncResults.push({
            order_id: order.id,
            action: 'created',
            data: newOrder
          });

          // Traiter la commande (créer utilisateur, donner accès au pack, etc.)
          await processOrder(order);
        } else {
          syncResults.push({
            order_id: order.id,
            action: 'skipped',
            reason: 'already_exists'
          });
        }
      } catch (error) {
        console.error(`❌ Erreur sync commande ${order.id}:`, error);
        syncResults.push({
          order_id: order.id,
          action: 'error',
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    console.log('✅ Synchronisation commandes terminée');

    return NextResponse.json({
      success: true,
      message: 'Synchronisation des commandes terminée',
      data: {
        total_orders: orders.length,
        results: syncResults,
        summary: {
          created: syncResults.filter(r => r.action === 'created').length,
          skipped: syncResults.filter(r => r.action === 'skipped').length,
          errors: syncResults.filter(r => r.action === 'error').length
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur synchronisation commandes:', error);
    throw error;
  }
}

async function processOrder(order: SystemeIoApiOrder) {
  try {
    // Trouver le pack correspondant au produit
    const { data: productMapping } = await supabaseAdmin
      .from('systeme_io_products')
      .select('pack_id')
      .eq('systeme_io_product_id', order.product_id)
      .single();

    if (!productMapping?.pack_id) {
      console.warn(`⚠️ Aucun pack mappé pour le produit ${order.product_id}`);
      return;
    }

    // Générer un UUID pour l'utilisateur
    const userId = crypto.randomUUID();

    // Créer le profil utilisateur
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userId,
        first_name: order.customer.first_name,
        last_name: order.customer.last_name,
        role: 'USER'
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erreur création profil:', profileError);
      return;
    }

    // Donner accès au pack
    const { error: userPackError } = await supabaseAdmin
      .from('user_packs')
      .insert({
        user_id: userId,
        pack_id: productMapping.pack_id
      });

    if (userPackError) {
      console.error('❌ Erreur création user_pack:', userPackError);
      return;
    }

    // Mettre à jour les statistiques du pack
    const { data: stats } = await supabaseAdmin
      .from('pack_stats')
      .select('*')
      .eq('pack_id', productMapping.pack_id)
      .single();

    if (stats) {
      await supabaseAdmin
        .from('pack_stats')
        .update({
          purchases_count: stats.purchases_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('pack_id', productMapping.pack_id);
    }

    console.log(`✅ Commande ${order.id} traitée avec succès`);

  } catch (error) {
    console.error(`❌ Erreur traitement commande ${order.id}:`, error);
  }
}

async function createProduct(data: any) {
  try {
    const { pack_id, systeme_io_data } = data;

    // Créer le produit sur Systeme.io
    const product = await callSystemeIoApi('/products', {
      method: 'POST',
      body: JSON.stringify(systeme_io_data)
    });

    // Créer le mapping local
    const { data: mapping, error } = await supabaseAdmin
      .from('systeme_io_products')
      .insert({
        systeme_io_product_id: product.id,
        pack_id,
        product_name: product.name,
        product_price: product.price,
        currency: product.currency,
        status: product.status
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Produit créé avec succès',
      data: { product, mapping }
    });

  } catch (error) {
    console.error('❌ Erreur création produit:', error);
    throw error;
  }
}

async function updateProduct(data: any) {
  try {
    const { systeme_io_product_id, systeme_io_data } = data;

    // Mettre à jour le produit sur Systeme.io
    const product = await callSystemeIoApi(`/products/${systeme_io_product_id}`, {
      method: 'PUT',
      body: JSON.stringify(systeme_io_data)
    });

    // Mettre à jour le mapping local
    const { data: mapping, error } = await supabaseAdmin
      .from('systeme_io_products')
      .update({
        product_name: product.name,
        product_price: product.price,
        currency: product.currency,
        status: product.status,
        updated_at: new Date().toISOString()
      })
      .eq('systeme_io_product_id', systeme_io_product_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: { product, mapping }
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour produit:', error);
    throw error;
  }
} 