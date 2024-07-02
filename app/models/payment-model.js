const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  transactionId: {
    type: String,  // Stripe transaction IDs are usually strings
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['successful', 'pending', 'failed'],
    default: 'pending'
  },
  paymentType: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

module.exports = Payment;
