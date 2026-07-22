const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Create new booking
// @route   POST /api/registrations
// @access  Private (Student)
const createBooking = async (req, res) => {
  const { eventId, tickets } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.currentParticipants + Number(tickets) > event.maxParticipants) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    // Check if already booked
    const alreadyBooked = await Booking.findOne({ event: eventId, student: req.user._id });
    if (alreadyBooked) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const booking = await Booking.create({
      event: eventId,
      student: req.user._id,
      tickets: Number(tickets) || 1,
      totalPrice: (event.price || 0) * (Number(tickets) || 1),
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${req.user._id}-${eventId}`
    });

    // Update event participant count
    event.currentParticipants += Number(tickets) || 1;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/registrations/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin/Organizer)
// @route   GET /api/registrations
// @access  Private
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('event')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify booking (QR Scan)
// @route   POST /api/registrations/verify
// @access  Private (Organizer/Admin)
const verifyBooking = async (req, res) => {
  const { ticketData } = req.body; // format: studentId-eventId

  try {
    const [studentId, eventId] = ticketData.split('-');
    const booking = await Booking.findOne({ student: studentId, event: eventId })
      .populate('student', 'name email')
      .populate('event', 'title organizer');

    if (!booking) {
      return res.status(404).json({ message: 'Valid booking not found' });
    }

    // Check if user is the organizer of this event or admin
    if (booking.event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to verify this ticket' });
    }

    res.json({
      message: 'Ticket verified successfully!',
      attendee: booking.student.name,
      event: booking.event.title,
      bookingTime: booking.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Invalid ticket format' });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, verifyBooking };
