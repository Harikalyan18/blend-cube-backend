
const mongoose = require('mongoose');

const { model, Schema} = mongoose 

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  space: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Space'
  },
  spaceType: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Space'
  },
  office: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Office'
  },
  currentDaySelection: String,
  duration: Number,
  totalAmount: {
    type: Number,
    required: true
  },

}, {
  timestamps: true
})

const Booking = model('Booking', bookingSchema);

module.exports = Booking
