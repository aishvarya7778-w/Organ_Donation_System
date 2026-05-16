const mongoose = require('mongoose');


const recipientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    age: {
      type: Number,
      required: true
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },

    bloodGroup: {
      type: String,
      required: true
    },

    neededOrgan: {
      type: String,
      required: true
    },

    urgencyLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },

    city: {
      type: String,
      required: true,
      trim: true
    },

    hospital: {
      type: String,
      trim: true
    },

    address: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    emergencyContact: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipient', recipientSchema);
matchSchema.index({ donorId: 1, recipientId: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
