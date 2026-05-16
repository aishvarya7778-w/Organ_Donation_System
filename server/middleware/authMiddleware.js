const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const asyncHandler = require('../utils/asyncHandler');

const getTokenFromHeader = (req) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || typeof header !== 'string') {
    return null;
  }

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

const verifyToken = (token, req, res) => {
  if (!token) {
    res.status(401);
    throw new Error('Authorization token missing');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error.message, {
      path: req.originalUrl,
      authorization: req.headers.authorization
    });

    res.status(401);
    if (error.name === 'TokenExpiredError') {
      throw new Error('Authorization token expired');
    }
    throw new Error('Authorization token invalid');
  }
};

const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req);
  const decoded = verifyToken(token, req, res);

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  req.user = user;
  next();
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req);
  const decoded = verifyToken(token, req, res);

  const admin = await Admin.findById(decoded.id).select('-password');
  if (!admin) {
    res.status(401);
    throw new Error('Admin not found');
  }

  req.admin = admin;
  next();
});

const protectDonor = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req);
  const decoded = verifyToken(token, req, res);

  const donor = await Donor.findById(decoded.id).select('-password');
  if (!donor) {
    res.status(401);
    throw new Error('Donor not found');
  }

  req.donor = donor;
  next();
});

const protectRecipient = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req);
  const decoded = verifyToken(token, req, res);

  const recipient = await Recipient.findById(decoded.id).select('-password');
  if (!recipient) {
    res.status(401);
    throw new Error('Recipient not found');
  }

  req.recipient = recipient;
  next();
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
