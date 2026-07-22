const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, verifyBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.post('/verify', protect, verifyBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, getAllBookings);


module.exports = router;
