import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    const { planId } = await request.json();
    
    if (!planId || !['monthly', 'yearly'].includes(planId)) {
      return NextResponse.json(
        { error: 'Plan invalide' },
        { status: 400 }
      );
    }

    const priceId = STRIPE_PRICES[planId as keyof typeof STRIPE_PRICES];
    
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.email,
        planId: planId,
      },
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/premium?cancelled=true`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
    
  } catch (error) {
    console.error('Erreur création session Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}