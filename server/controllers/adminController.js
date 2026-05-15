const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

const sanitizeAdmin = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    res.status(409);
    throw new Error('Admin already exists with this email');
  }

  const admin = await Admin.create({
    name,
    email,
    password
  });

  res.status(201).json({
    success: true,
    message: 'Admin registered successfully',
    data: {
      admin: sanitizeAdmin(admin),
      token: generateToken(admin._id)
    }
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    message: 'Admin login successful',
    data: {
      admin: sanitizeAdmin(admin),
      token: generateToken(admin._id)
    }
  });
});

const getAdminProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      admin: sanitizeAdmin(req.admin)
    }
  });
});

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile
};
