const mongoose = require('mongoose');
const Donor = require('../models/Donor');
const Recipient = require('../models/Recipient');
const Match = require('../models/Match');
const calculateCompatibility = require('../algorithms/compatibilityScore');
const stableMatching = require('../algorithms/stableMatching');
const asyncHandler = require('../utils/asyncHandler');
const { emitNotification } = require('../utils/notificationEmitter');

const checkCompatibility = asyncHandler(async (req, res) => {
  const { donorId, recipientId } = req.params;

  if (!mongoose.isValidObjectId(donorId) || !mongoose.isValidObjectId(recipientId)) {
    res.status(400);
    throw new Error('Invalid donor or recipient id');
  }

  const donor = await Donor.findById(donorId);
  if (!donor) {
    res.status(404);
    throw new Error('Donor not found');
  }

  const recipient = await Recipient.findById(recipientId);
  if (!recipient) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  const result = calculateCompatibility(donor, recipient);

  res.status(200).json({
    success: true,
    donorId: donor._id,
    recipientId: recipient._id,
    result
  });
});

const runMatching = asyncHandler(async (req, res) => {
  const donors = await Donor.find();
  const recipients = await Recipient.find();

  if (!donors.length || !recipients.length) {
    res.status(400);
    throw new Error('At least one donor and one recipient are required to run matching');
  }

  const compatibilityMatrix = donors.map((donor) => ({
    donor,
    recipients: recipients.map((recipient) => {
      const compatibility = calculateCompatibility(donor, recipient);

      return {
        recipient,
        score: compatibility.score,
        compatible: compatibility.compatible,
        reasons: compatibility.reasons
      };
    })
  }));

  const { allocations, donorPreferences, recipientPreferences } = stableMatching(donors, recipients);

  if (!allocations.length) {
    emitNotification({
      title: 'Matching completed',
      message: 'Matching completed with no compatible allocations found.',
      type: 'match_completed'
    });

    res.status(200).json({
      success: true,
      message: 'No compatible matches found',
      compatibilityMatrix: compatibilityMatrix.map((item) => ({
        donorId: item.donor._id,
        donorName: item.donor.fullName,
        recipients: item.recipients.map((entry) => ({
          recipientId: entry.recipient._id,
          recipientName: entry.recipient.patientName,
          score: entry.score,
          compatible: entry.compatible,
          reasons: entry.reasons
        }))
      })),
      donorPreferences: Object.fromEntries(donorPreferences),
      recipientPreferences: Object.fromEntries(recipientPreferences),
      allocations: []
    });
    return;
  }

  const savedMatches = [];
  for (const allocation of allocations) {
    const match = await Match.findOneAndUpdate(
      {
        donorId: allocation.donor._id,
        recipientId: allocation.recipient._id
      },
      {
        donorId: allocation.donor._id,
        recipientId: allocation.recipient._id,
        compatibilityScore: allocation.compatibilityScore,
        reasons: allocation.reasons,
        matchStatus: 'pending'
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    )
      .populate('donorId')
      .populate('recipientId');

    await Promise.all([
      Donor.findByIdAndUpdate(allocation.donor._id, {
        applicationStatus: 'Matched',
        availabilityStatus: 'matched'
      }),
      Recipient.findByIdAndUpdate(allocation.recipient._id, {
        applicationStatus: 'Match Found'
      })
    ]);

    savedMatches.push(match);
  }

  emitNotification({
    title: 'Match found',
    message: `${savedMatches.length} compatible allocation${savedMatches.length === 1 ? '' : 's'} found.`,
    type: 'match_found'
  });

  res.status(200).json({
    success: true,
    message: 'Matching completed successfully',
    compatibilityMatrix: compatibilityMatrix.map((item) => ({
      donorId: item.donor._id,
      donorName: item.donor.fullName,
      recipients: item.recipients.map((entry) => ({
        recipientId: entry.recipient._id,
        recipientName: entry.recipient.patientName,
        score: entry.score,
        compatible: entry.compatible,
        reasons: entry.reasons
      }))
    })),
    donorPreferences: Object.fromEntries(donorPreferences),
    recipientPreferences: Object.fromEntries(recipientPreferences),
    allocations: savedMatches.map((match) => ({
      donorName: match.donorId.fullName,
      recipientName: match.recipientId.patientName,
      organType: match.donorId.organType,
      urgencyLevel: match.recipientId.urgencyLevel,
      compatibilityScore: match.compatibilityScore,
      reasons: match.reasons
    }))
  });
});

module.exports = {
  checkCompatibility,
  runMatching
};
