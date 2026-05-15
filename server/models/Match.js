const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: true
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipient',
      required: true
    },
    compatibilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    reasons: {
      type: [String],
      default: []
    },
    matchStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

matchSchema.index({ donorId: 1, recipientId: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
