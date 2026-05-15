const Recipient = require('../models/Recipient');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');
const { emitNotification } = require('../utils/notificationEmitter');
const generateToken = require('../utils/generateToken');

const recipientStatuses = ['Pending', 'Waiting', 'Match Found', 'Scheduled', 'Completed'];

const sanitizeRecipient = (recipient) => ({
  _id: recipient._id,
  patientName: recipient.patientName,
  email: recipient.email,
  age: recipient.age,
  bloodGroup: recipient.bloodGroup,
  requiredOrgan: recipient.requiredOrgan,
  urgencyLevel: recipient.urgencyLevel,
  requiredHealthThreshold: recipient.requiredHealthThreshold,
  city: recipient.city,
  applicationStatus: recipient.applicationStatus,
  createdAt: recipient.createdAt,
  updatedAt: recipient.updatedAt
});

const getRecipientMatchDetails = async (recipientId) => {
  const match = await Match.findOne({ recipientId })
    .sort({ updatedAt: -1 })
    .populate('donorId');

  if (!match) {
    return null;
  }

  return {
    matchId: match._id,
    matchStatus: match.matchStatus,
    compatibilityScore: match.compatibilityScore,
    reasons: match.reasons,
    donorName: match.donorId?.fullName,
    organType: match.donorId?.organType,
    bloodGroup: match.donorId?.bloodGroup,
    city: match.donorId?.city,
    updatedAt: match.updatedAt
  };
};

const registerRecipient = asyncHandler(async (req, res) => {
  if (req.body.email) {
    const existingRecipient = await Recipient.findOne({ email: req.body.email });
    if (existingRecipient) {
      res.status(409);
      throw new Error('Recipient already exists with this email');
    }
  }

  const recipient = await Recipient.create(req.body);

  emitNotification({
    title: 'New recipient added',
    message: `${recipient.patientName} was added to the waiting list for ${recipient.requiredOrgan}.`,
    type: 'recipient_added'
  });

  res.status(201).json({
    success: true,
    message: 'Recipient registered successfully',
    data: {
      recipient: sanitizeRecipient(recipient),
      token: recipient.email ? generateToken(recipient._id) : undefined
    }
  });
});

const loginRecipient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const recipient = await Recipient.findOne({ email }).select('+password');
  if (!recipient || !recipient.password || !(await recipient.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    message: 'Recipient login successful',
    data: {
      recipient: sanitizeRecipient(recipient),
      token: generateToken(recipient._id)
    }
  });
});

const getRecipientProfile = asyncHandler(async (req, res) => {
  const matchDetails = await getRecipientMatchDetails(req.recipient._id);

  res.status(200).json({
    success: true,
    data: {
      profile: sanitizeRecipient(req.recipient),
      applicationStatus: req.recipient.applicationStatus,
      latestUpdate: req.recipient.updatedAt,
      matchDetails
    }
  });
});

const getRecipientStatus = asyncHandler(async (req, res) => {
  const matchDetails = await getRecipientMatchDetails(req.recipient._id);

  res.status(200).json({
    success: true,
    data: {
      applicationStatus: req.recipient.applicationStatus,
      urgencyLevel: req.recipient.urgencyLevel,
      matchStatus: matchDetails ? 'Match Found' : 'Waiting for match',
      latestUpdate: req.recipient.updatedAt,
      matchDetails
    }
  });
});

const updateRecipientStatus = asyncHandler(async (req, res) => {
  const { applicationStatus } = req.body;

  if (!recipientStatuses.includes(applicationStatus)) {
    res.status(400);
    throw new Error('Invalid recipient application status');
  }

  const recipient = await Recipient.findByIdAndUpdate(
    req.params.id,
    { applicationStatus },
    {
      new: true,
      runValidators: true
    }
  );

  if (!recipient) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  emitNotification({
    title: 'Recipient status updated',
    message: `${recipient.patientName} is now ${recipient.applicationStatus}.`,
    type: 'recipient_status_updated'
  });

  res.status(200).json({
    success: true,
    message: 'Recipient status updated successfully',
    data: sanitizeRecipient(recipient)
  });
});

const getAllRecipients = asyncHandler(async (req, res) => {
  const recipients = await Recipient.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: recipients.length,
    data: recipients
  });
});

const getRecipientById = asyncHandler(async (req, res) => {
  const recipient = await Recipient.findById(req.params.id);

  if (!recipient) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  res.status(200).json({
    success: true,
    data: recipient
  });
});

module.exports = {
  registerRecipient,
  loginRecipient,
  getRecipientProfile,
  getRecipientStatus,
  updateRecipientStatus,
  getAllRecipients,
  getRecipientById
};
