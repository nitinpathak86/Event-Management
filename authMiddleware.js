const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id === 'admin_master_id_001') {
        req.user = {
          _id: 'admin_master_id_001',
          name: 'System Admin',
          email: 'admin@college.com',
          role: 'Admin'
        };
      } else {
        // Select user without password
        req.user = await User.findById(decoded.id).select('-password');
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const organizer = (req, res, next) => {
  if (req.user && (req.user.role === 'Organizer' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an organizer' });
  }
};

module.exports = { protect, admin, organizer };
