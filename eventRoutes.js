const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getPendingEvents,
  getAdminStats,
  getOrganizerStats
} = require('../controllers/eventController');
const { protect, organizer, admin } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

// Stats routes
router.get('/stats/admin', protect, admin, getAdminStats);
router.get('/stats/organizer', protect, organizer, getOrganizerStats);

// Admin route
router.get('/pending', protect, admin, getPendingEvents);

// Organizer route
router.get('/my', protect, organizer, getMyEvents);

router.route('/')
  .get(getEvents)
  .post(protect, organizer, upload.single('posterImage'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, organizer, upload.single('posterImage'), updateEvent)
  .delete(protect, organizer, deleteEvent);

module.exports = router;
