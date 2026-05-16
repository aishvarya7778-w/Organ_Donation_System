const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const donorSchema = new mongoose.Schema(
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

    organType: {
      type: String,
      required: true
    },

    healthScore: {
      type: Number,
      min: 1,
      max: 100,
      required: true
    },

    availabilityStatus: {
      type: String,
      enum: ['Available', 'Unavailable'],
      default: 'Available'
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

    // Optional for demo
    // aadhaarNumber: {
    //   type: String,
    //   trim: true
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donor', donorSchema);
donorSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

donorSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Donor', donorSchema);
