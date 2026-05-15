const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Admin authorization token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      res.status(401);
      throw new Error('Admin not found');
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Admin authorization token invalid');
  }
});

const protectDonor = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Donor authorization token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const donor = await Donor.findById(decoded.id).select('-password');

    if (!donor) {
      res.status(401);
      throw new Error('Donor not found');
    }

    req.donor = donor;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Donor authorization token invalid');
  }
});

const protectRecipient = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Recipient authorization token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recipient = await Recipient.findById(decoded.id).select('-password');

    if (!recipient) {
      res.status(401);
      throw new Error('Recipient not found');
    }

    req.recipient = recipient;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Recipient authorization token invalid');
  }
});

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Forbidden: insufficient permissions');
  }

  next();
};

module.exports = {
  protect,
  protectAdmin,
  protectDonor,
  protectRecipient,
  authorizeRoles
};
