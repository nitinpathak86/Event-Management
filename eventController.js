const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const filter = {};
    
    // Non-admins only see approved events
    // Assuming you want to show "Upcoming" or you can filter further.
    // We will ensure only Approved are seen on the home/events page.
    // If not admin, add approvalStatus = 'Approved' to query.
    filter.approvalStatus = 'Approved';
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    // Search by title
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const events = await Event.find(filter).populate('organizer', 'name email').sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending events (Admin Only)
// @route   GET /api/events/pending
// @access  Private (Admin)
const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ approvalStatus: 'Pending' })
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get organizer's events
// @route   GET /api/events/my
// @access  Private (Organizer/Admin)
const getMyEvents = async (req, res) => {
  try {
    // Both Organizer and Admin can fetch events they created.
    const events = await Event.find({ organizer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      venue,
      maxParticipants
    } = req.body;

    let posterImage = '';
    if (req.file) {
      posterImage = req.file.path; // Cloudinary URL
    } else if (req.body.posterImage) {
      posterImage = req.body.posterImage;
    }

    const event = new Event({
      title,
      description,
      category,
      date,
      venue,
      posterImage,
      maxParticipants: Number(maxParticipants),
      organizer: req.user._id,
      status: 'Upcoming',
      approvalStatus: req.user.role === 'Admin' ? 'Approved' : 'Pending' 
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      // Check if user is organizer or admin
      if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return res.status(401).json({ message: 'Not authorized to update this event' });
      }

      event.title = req.body.title || event.title;
      event.description = req.body.description || event.description;
      event.category = req.body.category || event.category;
      event.date = req.body.date || event.date;
      event.venue = req.body.venue || event.venue;
      
      if (req.file) {
        event.posterImage = req.file.path;
      } else if (req.body.posterImage) {
        event.posterImage = req.body.posterImage;
      }
      
      if (req.body.maxParticipants) {
        event.maxParticipants = Number(req.body.maxParticipants);
      }
      
      if (req.user.role === 'Admin' && req.body.approvalStatus) {
        event.approvalStatus = req.body.approvalStatus;
      }

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return res.status(401).json({ message: 'Not authorized to delete this event' });
      }

      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Admin Stats
// @route   GET /api/events/stats/admin
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const categoryStats = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5).select('name role createdAt');
    const pendingEvents = await Event.find({ approvalStatus: 'Pending' }).countDocuments();

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      pendingEvents,
      categoryStats,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Organizer Stats
// @route   GET /api/events/stats/organizer
// @access  Private (Organizer)
const getOrganizerStats = async (req, res) => {
  try {
    const myEvents = await Event.find({ organizer: req.user._id });
    const eventIds = myEvents.map(e => e._id);
    
    const totalParticipants = myEvents.reduce((acc, ev) => acc + ev.currentParticipants, 0);
    const totalRevenue = myEvents.reduce((acc, ev) => acc + (ev.price * ev.currentParticipants), 0);
    
    // Monthly registration trend for their events
    const registrationTrend = await Booking.aggregate([
      { $match: { event: { $in: eventIds } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      totalEvents: myEvents.length,
      totalParticipants,
      totalRevenue,
      registrationTrend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getPendingEvents,
  getAdminStats,
  getOrganizerStats
};
