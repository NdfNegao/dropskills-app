import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  console.warn('STRIPE_SECRET_KEY not defined - Stripe functionality disabled');
}

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
}) : null;

// Configuration des prix (à remplacer par vos vrais price_id de Stripe)
export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
  yearly: process.env.STRIPE_PRICE_YEARLY || 'price_yearly_placeholder',
};