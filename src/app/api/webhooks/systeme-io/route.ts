import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { prisma } from '@/lib/prisma'

// Vérification de la signature webhook
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return signature === expectedSignature
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

  // Créer ou récupérer l'utilisateur et son profil
  let user = await prisma.user.findUnique({
    where: { email: customerEmail },
    include: { profile: true }
  })

  if (!user) {
    // Créer l'utilisateur et son profil
    user = await prisma.user.create({
      data: {
        email: customerEmail,
        firstName: data.customer?.first_name,
        lastName: data.customer?.last_name,
        profile: {
          create: {
            firstName: data.customer?.first_name,
            lastName: data.customer?.last_name,
            role: 'USER'
          }
        }
      },
      include: { profile: true }
    })
  }

  // Trouver le pack correspondant (mapping par productId ou autre logique)
  const pack = await findPackByProductId(productId)
  
  if (pack && user) {
    // Créer l'accès au pack pour l'utilisateur
    await prisma.userPack.create({
      data: {
        userId: user.id,
        packId: pack.id
      }
    })

    // Mettre à jour les statistiques du pack
    await prisma.packStats.upsert({
      where: { packId: pack.id },
      update: {
        purchasesCount: { increment: 1 }
      },
      create: {
        packId: pack.id,
        purchasesCount: 1
      }
    })
  }
}

async function handleSubscriptionCreated(data: any, webhookEventId: string) {
  const customerEmail = data.customer?.email
  const planId = data.subscription?.plan_id

  if (!customerEmail) return

  let user = await prisma.user.findUnique({
    where: { email: customerEmail },
    include: { profile: true }
  })

  if (!user) {
    // Créer l'utilisateur et son profil
    user = await prisma.user.create({
      data: {
        email: customerEmail,
        firstName: data.customer?.first_name,
        lastName: data.customer?.last_name,
        profile: {
          create: {
            firstName: data.customer?.first_name,
            lastName: data.customer?.last_name,
            role: 'USER'
          }
        }
      },
      include: { profile: true }
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
    // Supprimer l'accès au pack ou marquer comme remboursé
    // await prisma.userPack.deleteMany({
    //   where: { transactionId }
    // })
  }
}

// Fonctions utilitaires
async function findPackByProductId(productId: string) {
  // TODO: Adapter cette fonction au nouveau schéma Pack
  return await prisma.pack.findFirst({
    where: {
      // Exemple: utiliser une logique de mapping personnalisée
      title: { contains: productId } // Logique temporaire
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