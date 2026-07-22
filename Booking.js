const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tickets: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Waitlisted', 'Cancelled'],
    default: 'Confirmed'
  },
  qrCodeUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Prevent duplicate bookings
bookingSchema.index({ event: 1, student: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

