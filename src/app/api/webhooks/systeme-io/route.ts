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
    
    // Enregistrement de l'événement webhook
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        eventType: 'PURCHASE_COMPLETED',
        provider: 'SYSTEME_IO',
        status: 'RECEIVED',
        userEmail: data.customer?.email,
        rawData: data,
        ipAddress: request.ip,
        userAgent: request.headers.get('user-agent'),
      }
    })

    // Traitement selon le type d'événement
    switch (data.event_type) {
      case 'order.completed':
        await handleOrderCompleted(data, webhookEvent.id)
        break
      case 'subscription.created':
        await handleSubscriptionCreated(data, webhookEvent.id)
        break
      case 'refund.completed':
        await handleRefundCompleted(data, webhookEvent.id)
        break
      default:
        console.log('Événement non géré:', data.event_type)
    }

    // Mise à jour du statut
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { 
        status: 'PROCESSED',
        processedData: data
      }
    })

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

  // Créer ou récupérer l'utilisateur
  let user = await prisma.user.findUnique({
    where: { email: customerEmail }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: customerEmail,
        firstName: data.customer?.first_name,
        lastName: data.customer?.last_name,
        provider: 'SYSTEME_IO',
        status: 'ACTIVE'
      }
    })
  }

  // Trouver le pack correspondant (mapping par productId ou autre logique)
  const pack = await findPackByProductId(productId)
  
  if (pack) {
    // Créer l'accès au pack
    await prisma.packUser.create({
      data: {
        userId: user.id,
        packId: pack.id,
        status: 'ACTIVE',
        origin: 'SYSTEME_IO',
        transactionId: data.order?.id,
        amount: amount,
        currency: data.order?.currency || 'EUR'
      }
    })

    // Mettre à jour les statistiques
    await prisma.packStats.upsert({
      where: { packId: pack.id },
      update: {
        purchases: { increment: 1 },
        revenue: { increment: amount || 0 }
      },
      create: {
        packId: pack.id,
        purchases: 1,
        revenue: amount || 0
      }
    })
  }
}

async function handleSubscriptionCreated(data: any, webhookEventId: string) {
  const customerEmail = data.customer?.email
  const planId = data.subscription?.plan_id

  if (!customerEmail) return

  let user = await prisma.user.findUnique({
    where: { email: customerEmail }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: customerEmail,
        firstName: data.customer?.first_name,
        lastName: data.customer?.last_name,
        provider: 'SYSTEME_IO'
      }
    })
  }

  // Mettre à jour l'abonnement
  const subscriptionType = mapPlanToSubscriptionType(planId)
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionType,
      subscriptionStatus: 'ACTIVE',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: calculateEndDate(data.subscription?.billing_cycle)
    }
  })
}

async function handleRefundCompleted(data: any, webhookEventId: string) {
  const transactionId = data.refund?.original_transaction_id

  if (transactionId) {
    await prisma.packUser.updateMany({
      where: { transactionId },
      data: { status: 'REFUNDED' }
    })
  }
}

// Fonctions utilitaires
async function findPackByProductId(productId: string) {
  // Logique pour mapper les produits Systeme.io aux packs
  // Peut utiliser une table de mapping ou des métadonnées
  return await prisma.pack.findFirst({
    where: {
      // Exemple: utiliser les tags ou métadonnées
      tags: { has: `systeme_io:${productId}` }
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