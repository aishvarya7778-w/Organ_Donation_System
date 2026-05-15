const Donor = require('../models/Donor');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');
const { emitNotification } = require('../utils/notificationEmitter');
const generateToken = require('../utils/generateToken');

const donorStatuses = ['Pending', 'Under Review', 'Approved', 'Matched', 'Completed'];

const sanitizeDonor = (donor) => ({
  _id: donor._id,
  fullName: donor.fullName,
  email: donor.email,
  age: donor.age,
  bloodGroup: donor.bloodGroup,
  organType: donor.organType,
  organHealthScore: donor.organHealthScore,
  city: donor.city,
  reportFile: donor.reportFile,
  availabilityStatus: donor.availabilityStatus,
  applicationStatus: donor.applicationStatus,
  createdAt: donor.createdAt,
  updatedAt: donor.updatedAt
});

const getDonorMatchDetails = async (donorId) => {
  const match = await Match.findOne({ donorId })
    .sort({ updatedAt: -1 })
    .populate('recipientId');

  if (!match) {
    return null;
  }

  return {
    matchId: match._id,
    matchStatus: match.matchStatus,
    compatibilityScore: match.compatibilityScore,
    reasons: match.reasons,
    recipientName: match.recipientId?.patientName,
    requiredOrgan: match.recipientId?.requiredOrgan,
    urgencyLevel: match.recipientId?.urgencyLevel,
    city: match.recipientId?.city,
    updatedAt: match.updatedAt
  };
};

const registerDonor = asyncHandler(async (req, res) => {
  const donorData = {
    ...req.body,
    reportFile: req.file ? `/uploads/${req.file.filename}` : undefined
  };

  if (donorData.email) {
    const existingDonor = await Donor.findOne({ email: donorData.email });
    if (existingDonor) {
      res.status(409);
      throw new Error('Donor already exists with this email');
    }
  }

  const donor = await Donor.create(donorData);

  emitNotification({
    title: 'New donor added',
    message: `${donor.fullName} registered as a donor for ${donor.organType}.`,
    type: 'donor_added'
  });

  res.status(201).json({
    success: true,
    message: 'Donor registered successfully',
    data: {
      donor: sanitizeDonor(donor),
      token: donor.email ? generateToken(donor._id) : undefined
    }
  });
});

const loginDonor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const donor = await Donor.findOne({ email }).select('+password');
  if (!donor || !donor.password || !(await donor.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    message: 'Donor login successful',
    data: {
      donor: sanitizeDonor(donor),
      token: generateToken(donor._id)
    }
  });
});

const getDonorProfile = asyncHandler(async (req, res) => {
  const matchDetails = await getDonorMatchDetails(req.donor._id);

  res.status(200).json({
    success: true,
    data: {
      profile: sanitizeDonor(req.donor),
      applicationStatus: req.donor.applicationStatus,
      latestUpdate: req.donor.updatedAt,
      matchDetails
    }
  });
});

const getDonorStatus = asyncHandler(async (req, res) => {
  const matchDetails = await getDonorMatchDetails(req.donor._id);

  res.status(200).json({
    success: true,
    data: {
      applicationStatus: req.donor.applicationStatus,
      availabilityStatus: req.donor.availabilityStatus,
      matchStatus: matchDetails ? 'Matched' : 'No active match',
      reportFile: req.donor.reportFile,
      latestUpdate: req.donor.updatedAt,
      matchDetails
    }
  });
});

const updateDonorStatus = asyncHandler(async (req, res) => {
  const { applicationStatus } = req.body;

  if (!donorStatuses.includes(applicationStatus)) {
    res.status(400);
    throw new Error('Invalid donor application status');
  }

  const update = { applicationStatus };
  if (applicationStatus === 'Matched') {
    update.availabilityStatus = 'matched';
  }

  const donor = await Donor.findByIdAndUpdate(
    req.params.id,
    update,
    {
      new: true,
      runValidators: true
    }
  );

  if (!donor) {
    res.status(404);
    throw new Error('Donor not found');
  }

  emitNotification({
    title: 'Donor status updated',
    message: `${donor.fullName} is now ${donor.applicationStatus}.`,
    type: 'donor_status_updated'
  });

  res.status(200).json({
    success: true,
    message: 'Donor status updated successfully',
    data: sanitizeDonor(donor)
  });
});

const getAllDonors = asyncHandler(async (req, res) => {
  const donors = await Donor.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: donors.length,
    data: donors
  });
});

const getDonorById = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.params.id);

  if (!donor) {
    res.status(404);
    throw new Error('Donor not found');
  }

  res.status(200).json({
    success: true,
    data: donor
  });
});

module.exports = {
  registerDonor,
  loginDonor,
  getDonorProfile,
  getDonorStatus,
  updateDonorStatus,
  getAllDonors,
  getDonorById
};
