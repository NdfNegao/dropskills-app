import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Vérification de la signature webhook
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature') || ''
    const secret = process.env.SYSTEME_IO_WEBHOOK_SECRET!

    // Vérification de la signature
    if (!verifyWebhookSignature(body, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(body)
    
    // TODO: Réimplémenter l'enregistrement des événements webhook
    // const webhookEvent = await prisma.webhookEvent.create({
    //   data: {
    //     eventType: 'PURCHASE_COMPLETED',
    //     provider: 'SYSTEME_IO',
    //     status: 'RECEIVED',
    //     userEmail: data.customer?.email,
    //     payload: body,
    //     headers: JSON.stringify(Object.fromEntries(request.headers.entries())),
    //   }
    // })

    // Traitement selon le type d'événement
    switch (data.event_type) {
      case 'order.completed':
        await handleOrderCompleted(data, 'temp_webhook_id')
        break
      case 'subscription.created':
        await handleSubscriptionCreated(data, 'temp_webhook_id')
        break
      case 'refund.completed':
        await handleRefundCompleted(data, 'temp_webhook_id')
        break
      default:
        console.log('Événement non géré:', data.event_type)
    }

    // TODO: Réimplémenter la mise à jour du statut
    // await prisma.webhookEvent.update({
    //   where: { id: webhookEvent.id },
    //   data: { 
    //     status: 'PROCESSED',
    //     processedAt: new Date()
    //   }
    // })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur webhook Systeme.io:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleOrderCompleted(data: any, webhookEventId: string) {
  const customerEmail = data.customer?.email
  const productId = data.product?.id
  const amount = data.order?.total_amount

  if (!customerEmail) return

  // Créer ou récupérer le profil utilisateur
  // Note: Pour Systeme.io, nous devons d'abord créer l'utilisateur dans Supabase Auth
  // puis créer le profil correspondant
  let profile = await prisma.profile.findFirst({
    where: { 
      // Recherche par email via une jointure ou logique personnalisée
      // Pour l'instant, on utilise une approche simplifiée
    }
  })

  if (!profile) {
    // TODO: Intégrer avec Supabase Auth pour créer l'utilisateur complet
    // Pour l'instant, on crée juste le profil avec un ID temporaire
    const tempId = `systeme_io_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    profile = await prisma.profile.create({
      data: {
        id: tempId, // ID temporaire - à remplacer par l'ID Supabase Auth
        firstName: data.customer?.first_name,
        lastName: data.customer?.last_name,
        status: 'ACTIVE',
        role: 'USER'
      }
    })
  }

  // Trouver le pack correspondant (mapping par productId ou autre logique)
  const pack = await findPackByProductId(productId)
  
  if (pack) {
    // TODO: Réimplémenter l'accès aux packs avec le nouveau schéma
    // await prisma.packUser.create({
    //   data: {
    //     userId: profile.id,
    //     packId: pack.id,
    //     status: 'ACTIVE',
    //     transactionId: data.order?.id,
    //     amount: amount,
    //     currency: data.order?.currency || 'EUR'
    //   }
    // })

    // TODO: Réimplémenter les statistiques des packs
    // await prisma.packStats.upsert({
    //   where: { packId: pack.id },
    //   update: {
    //     purchases: { increment: 1 },
    //     revenue: { increment: amount || 0 }
    //   },
    //   create: {
    //     packId: pack.id,
    //     purchases: 1,
    //     revenue: amount || 0
    //   }
    // })
  }
}

async function handleSubscriptionCreated(data: any, webhookEventId: string) {
  const customerEmail = data.customer?.email
  const planId = data.subscription?.plan_id

  if (!customerEmail) return

  let profile = await prisma.profile.findFirst({
    where: { 
      // Recherche par email - nécessite une logique personnalisée
      // car l'email est dans auth.users, pas dans profiles
    }
  })

  if (!profile) {
    // TODO: Intégrer avec Supabase Auth
    const tempId = `systeme_io_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    profile = await prisma.profile.create({
      data: {
        id: tempId,
        firstName: data.customer?.first_name,
        lastName: data.customer?.last_name,
        role: 'USER',
        status: 'ACTIVE'
      }
    })
  }

  // Note: Les informations d'abonnement devraient être stockées dans une table séparée
  // car elles ne font plus partie du modèle Profile
  // TODO: Créer une table subscriptions pour gérer les abonnements
}

async function handleRefundCompleted(data: any, webhookEventId: string) {
  const transactionId = data.refund?.original_transaction_id

  if (transactionId) {
    // TODO: Réimplémenter la gestion des remboursements
    // await prisma.packUser.updateMany({
    //   where: { transactionId },
    //   data: { status: 'REFUNDED' }
    // })
  }
}

// Fonctions utilitaires
async function findPackByProductId(productId: string) {
  // TODO: Adapter cette fonction au nouveau schéma Pack
  return await prisma.pack.findFirst({
    where: {
      // Exemple: utiliser une logique de mapping personnalisée
      name: { contains: productId } // Logique temporaire
    }
  })
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