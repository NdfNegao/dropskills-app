import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Signature manquante' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Erreur webhook signature:', err);
    return NextResponse.json(
      { error: 'Signature invalide' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_email || session.customer_details?.email;
        const planId = session.metadata?.planId;
        
        if (customerEmail) {
          // Mettre à jour le statut premium de l'utilisateur
          const { error } = await supabase
            .from('users')
            .upsert({
              email: customerEmail,
              is_premium: true,
              subscription_plan: planId,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'email'
            });

          if (error) {
            console.error('Erreur mise à jour utilisateur:', error);
          } else {
            console.log(`Utilisateur ${customerEmail} mis à jour avec succès`);
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Révoquer l'accès premium
        const { error } = await supabase
          .from('users')
          .update({
            is_premium: false,
            subscription_plan: null,
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer);

        if (error) {
          console.error('Erreur révocation premium:', error);
        }
        break;
      }
      
      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Erreur traitement webhook:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}