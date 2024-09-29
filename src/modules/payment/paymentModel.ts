import mongoose, { model, Schema } from 'mongoose';
import { PaymentType } from './paymentValidation';

const paymentSchema = new Schema<PaymentType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide the user ID.'],
      ref: 'User',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide the payment amount.'],
      min: [0, 'Amount must be a positive number.'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters.'],
    },
    transactionID: {
      type: String,
      required: [true, 'Please provide the transaction ID.'],
      unique: true,
    },
    paymentProvider: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = model<PaymentType>('Payment', paymentSchema);

export default Payment;
