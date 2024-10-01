import env from '../../config/env';

import Stripe from 'stripe';
import Payment from './paymentModel';
import { PaymentType } from './paymentValidation';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const initiatePaymentService = async () => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Veryfy Profile and Premium Content Access',
            description: 'Unlock premium gardening tips and guides.',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/cancel`,
  });

  return session;
};

export const confirmPaymentService = async (data: PaymentType) => {
  const payment = new Payment(data);

  await payment.save();
  return payment;
};
