import env from '../../config/env';

import Stripe from 'stripe';
import { Pagination, QueryString } from '../../@types';
import ApiFeatures from '../../builder/APIFeature';
import { monthNames } from '../../constant';
import Payment from './paymentModel';
import { PaymentType } from './paymentValidation';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const initiatePaymentService = async (userId: string) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Verify Profile and Premium Content Access',
            description: 'Unlock premium gardening tips and guides.',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${env.FRONTEND_URL}/${userId}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/${userId}/cancel`,
  });

  return session;
};

export const confirmPaymentService = async (data: PaymentType) => {
  const payment = new Payment(data);

  await payment.save();
  return payment;
};

export const getAllPaymentsService = async (query: QueryString) => {
  const features = new ApiFeatures<PaymentType>(
    Payment.find().populate('user'),
    query
  )
    .sort()
    .limitFields()
    .paginate();

  const count = await Payment.countDocuments();
  const total = count || 0;
  const totalPage = Math.ceil(total / (Number(query.limit) || 10));
  const pagination: Pagination = {
    totalPage,
    total,
    limit: Number(query.limit) || 10,
    page: Number(query.page) || 1,
  };

  if (pagination.page < totalPage) {
    pagination.next = pagination.page + 1;
  }
  if (pagination.page > 1) {
    pagination.prev = pagination.page - 1;
  }

  const payments = await features.query;
  return {
    payments,
    pagination,
  };
};

export const getMonthlyPaymentsService = async () => {
  const payments = await Payment.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return payments.map(({ _id, totalAmount, count }) => {
    const [year, month] = _id.split('-');
    return {
      month: monthNames[parseInt(month, 10) - 1],
      year,
      totalAmount,
      count,
    };
  });
};

// export const getMonthlyPaymentsService = async () => {
//   const payments = await Payment.aggregate([
//     {
//       $group: {
//         _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
//         totalAmount: { $sum: '$amount' },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { _id: 1 } },
//   ]);
//   return payments;
// };
