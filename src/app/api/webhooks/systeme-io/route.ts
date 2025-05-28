import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

// Vérification de la signature webhook
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return signature === expectedSignature
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let webhookLogId: string | null = null

  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature') || ''
    const secret = process.env.SYSTEME_IO_WEBHOOK_SECRET!

    if (!secret) {
      console.error('❌ SYSTEME_IO_WEBHOOK_SECRET non configuré')
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    // Vérification de la signature
    if (!verifyWebhookSignature(body, signature, secret)) {
      console.error('❌ Signature webhook invalide')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(body)
    console.log('📥 Webhook Systeme.io reçu:', data.event_type)

    // Enregistrer le webhook dans les logs
    const { data: webhookLog, error: logError } = await supabaseAdmin
      .from('systeme_io_webhooks')
      .insert({
        event_type: data.event_type,
        event_id: data.event_id || data.id,
        payload: data,
        signature,
        processed: false
      })
      .select()
      .single()

    if (logError) {
      console.error('❌ Erreur enregistrement webhook:', logError)
    } else {
      webhookLogId = webhookLog.id
    }

    // Traitement selon le type d'événement
    let result
    switch (data.event_type) {
      case 'order.completed':
      case 'order.paid':
        result = await handleOrderCompleted(data, webhookLogId)
        break
      case 'subscription.created':
      case 'subscription.activated':
        result = await handleSubscriptionCreated(data, webhookLogId)
        break
      case 'refund.completed':
        result = await handleRefundCompleted(data, webhookLogId)
        break
      case 'subscription.cancelled':
      case 'subscription.expired':
        result = await handleSubscriptionCancelled(data, webhookLogId)
        break
      default:
        console.log('⚠️ Événement non géré:', data.event_type)
        result = { success: true, message: 'Événement non géré mais enregistré' }
    }

    // Marquer le webhook comme traité
    if (webhookLogId) {
      await supabaseAdmin
        .from('systeme_io_webhooks')
        .update({
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq('id', webhookLogId)
    }

    const processingTime = Date.now() - startTime
    console.log(`✅ Webhook traité en ${processingTime}ms`)

    return NextResponse.json({
      success: true,
      event_type: data.event_type,
      processing_time_ms: processingTime,
      result
    })

  } catch (error) {
    console.error('❌ Erreur webhook Systeme.io:', error)

    // Marquer le webhook comme en erreur
    if (webhookLogId) {
      await supabaseAdmin
        .from('systeme_io_webhooks')
        .update({
          processed: false,
          error_message: error instanceof Error ? error.message : 'Erreur inconnue',
          retry_count: 1
        })
        .eq('id', webhookLogId)
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

async function handleOrderCompleted(data: any, webhookLogId: string | null) {
  try {
    console.log('🛒 Traitement commande complétée:', data.order?.id || data.id)

    const order = data.order || data
    const customer = data.customer || order.customer
    const product = data.product || order.product

    if (!customer?.email) {
      throw new Error('Email client manquant')
    }

    // 1. Créer ou retrouver l'utilisateur dans Supabase Auth
    let authUserId: string | null = null;
    let isNewAuthUser = false;
    let randomPassword = Math.random().toString(36).slice(-10) + 'A!';
    try {
      // Vérifier si l'utilisateur existe déjà (par email)
      const { data: listUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      const users = (listUsers?.users || []) as any[];
      const existingUser = users.find((u: any) => u.email === customer.email);
      if (existingUser) {
        authUserId = existingUser.id;
      } else {
        // Créer l'utilisateur dans Supabase Auth
        const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: customer.email,
          password: randomPassword,
          email_confirm: true,
          user_metadata: {
            first_name: customer.first_name,
            last_name: customer.last_name
          }
        });
        if (authError) throw authError;
        authUserId = newAuthUser.user.id;
        isNewAuthUser = true;
        console.log(`✅ Utilisateur Auth créé: ${customer.email}`);
      }
    } catch (authError) {
      console.error('❌ Erreur création utilisateur Auth:', authError);
      throw authError;
    }

    // Générer un UUID pour l'utilisateur (profil)
    const userId = authUserId || crypto.randomUUID();

    // Créer le profil utilisateur
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userId,
        first_name: customer.first_name,
        last_name: customer.last_name,
        role: 'USER'
      })
      .select()
      .single()

    if (profileError) {
      console.error('❌ Erreur création profil:', profileError)
      throw profileError
    }

    // (Optionnel) Log ou envoi d'email de bienvenue si nouvel utilisateur
    if (isNewAuthUser) {
      console.log(`✉️ À envoyer: email de bienvenue à ${customer.email} avec mot de passe temporaire.`);
      // TODO: Envoyer un vrai email de bienvenue ici si besoin
    }

    // Donner accès au pack
    const { data: productMapping } = await supabaseAdmin
      .from('systeme_io_products')
      .select('pack_id, pack:packs(id, title)')
      .eq('systeme_io_product_id', product?.id || 'unknown')
      .single()

    if (!productMapping?.pack_id) {
      console.warn(`⚠️ Aucun pack mappé pour le produit ${product?.id}`)
      return {
        success: true,
        message: 'Commande enregistrée mais aucun pack mappé',
        order_id: order.id
      }
    }

    // Mettre à jour les statistiques du pack
    const { data: stats } = await supabaseAdmin
      .from('pack_stats')
      .select('*')
      .eq('pack_id', productMapping.pack_id)
      .single()

    if (stats) {
      await supabaseAdmin
        .from('pack_stats')
        .update({
          purchases_count: stats.purchases_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('pack_id', productMapping.pack_id)
    } else {
      // Créer les stats si elles n'existent pas
      await supabaseAdmin
        .from('pack_stats')
        .insert({
          pack_id: productMapping.pack_id,
          views_count: 0,
          favorites_count: 0,
          purchases_count: 1
        })
    }

    // Mettre à jour la commande avec les IDs créés
    await supabaseAdmin
      .from('systeme_io_orders')
      .update({
        user_id: userId,
        pack_id: productMapping.pack_id,
        processed_at: new Date().toISOString()
      })
      .eq('id', order.id)

    console.log(`✅ Commande ${order.id} traitée avec succès - Utilisateur: ${userId}`)

    return {
      success: true,
      message: 'Commande traitée avec succès',
      data: {
        order_id: order.id,
        user_id: userId,
        pack_id: productMapping.pack_id,
        pack_title: (productMapping.pack as any)?.title
      }
    }

  } catch (error) {
    console.error('❌ Erreur traitement commande:', error)
    throw error
  }
}

async function handleSubscriptionCreated(data: any, webhookLogId: string | null) {
  try {
    console.log('📋 Traitement abonnement créé:', data.subscription?.id || data.id)

    const subscription = data.subscription || data
    const customer = data.customer || subscription.customer

    if (!customer?.email) {
      throw new Error('Email client manquant')
    }

    // Générer un UUID pour l'utilisateur
    const userId = crypto.randomUUID()

    // Créer le profil avec rôle PREMIUM
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userId,
        first_name: customer.first_name,
        last_name: customer.last_name,
        role: 'PREMIUM'
      })
      .select()
      .single()

    if (profileError) {
      throw profileError
    }

    console.log(`✅ Abonnement ${subscription.id} traité - Utilisateur PREMIUM: ${userId}`)

    return {
      success: true,
      message: 'Abonnement traité avec succès',
      data: {
        subscription_id: subscription.id,
        user_id: userId,
        role: 'PREMIUM'
      }
    }

  } catch (error) {
    console.error('❌ Erreur traitement abonnement:', error)
    throw error
  }
}

async function handleRefundCompleted(data: any, webhookLogId: string | null) {
  try {
    console.log('💰 Traitement remboursement:', data.refund?.id || data.id)

    const refund = data.refund || data
    const originalOrderId = refund.original_order_id || refund.order_id

    if (!originalOrderId) {
      throw new Error('ID commande originale manquant')
    }

    // Trouver la commande originale
    const { data: originalOrder } = await supabaseAdmin
      .from('systeme_io_orders')
      .select('*')
      .eq('systeme_io_order_id', originalOrderId)
      .single()

    if (!originalOrder) {
      console.warn(`⚠️ Commande originale ${originalOrderId} non trouvée`)
      return {
        success: true,
        message: 'Remboursement enregistré mais commande originale non trouvée'
      }
    }

    // Supprimer l'accès au pack si l'utilisateur existe
    if (originalOrder.user_id && originalOrder.pack_id) {
      await supabaseAdmin
        .from('user_packs')
        .delete()
        .eq('user_id', originalOrder.user_id)
        .eq('pack_id', originalOrder.pack_id)

      // Décrémenter les statistiques
      const { data: stats } = await supabaseAdmin
        .from('pack_stats')
        .select('*')
        .eq('pack_id', originalOrder.pack_id)
        .single()

      if (stats && stats.purchases_count > 0) {
        await supabaseAdmin
          .from('pack_stats')
          .update({
            purchases_count: stats.purchases_count - 1,
            updated_at: new Date().toISOString()
          })
          .eq('pack_id', originalOrder.pack_id)
      }
    }

    // Marquer la commande comme remboursée
    await supabaseAdmin
      .from('systeme_io_orders')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString()
      })
      .eq('systeme_io_order_id', originalOrderId)

    console.log(`✅ Remboursement ${refund.id} traité avec succès`)

    return {
      success: true,
      message: 'Remboursement traité avec succès',
      data: {
        refund_id: refund.id,
        original_order_id: originalOrderId
      }
    }

  } catch (error) {
    console.error('❌ Erreur traitement remboursement:', error)
    throw error
  }
}

async function handleSubscriptionCancelled(data: any, webhookLogId: string | null) {
  try {
    console.log('❌ Traitement annulation abonnement:', data.subscription?.id || data.id)

    const subscription = data.subscription || data
    const customer = data.customer || subscription.customer

    if (!customer?.email) {
      throw new Error('Email client manquant')
    }

    // Trouver l'utilisateur par email et rétrograder son rôle
    // Note: Cette logique devra être adaptée selon votre système d'authentification
    console.log(`⚠️ Abonnement ${subscription.id} annulé pour ${customer.email}`)

    return {
      success: true,
      message: 'Annulation abonnement enregistrée',
      data: {
        subscription_id: subscription.id,
        customer_email: customer.email
      }
    }

  } catch (error) {
    console.error('❌ Erreur traitement annulation:', error)
    throw error
  }
}

// Fonctions utilitaires
async function findPackByProductId(productId: string) {
  const { data: pack } = await supabaseAdmin
    .from('packs')
    .select('*')
    .ilike('title', `%${productId}%`) // Logique temporaire
    .limit(1)
    .single()

  return pack
}

function mapPlanToSubscriptionType(planId: string) {
  const mapping: Record<string, any> = {
    'starter': 'STARTER',
    'pro': 'PRO',
    'enterprise': 'ENTERPRISE'
  }
  return mapping[planId] || 'FREE'
}

function calculateEndDate(billingCycle: string) {
  const now = new Date()
  switch (billingCycle) {
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1))
    case 'yearly':
      return new Date(now.setFullYear(now.getFullYear() + 1))
    default:
      return new Date(now.setMonth(now.getMonth() + 1))
  }
} 