const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      minlength: 6,
      select: false
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: 0
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      uppercase: true,
      trim: true
    },
    organType: {
      type: String,
      required: [true, 'Organ type is required'],
      lowercase: true,
      trim: true
    },
    organHealthScore: {
      type: Number,
      required: [true, 'Organ health score is required'],
      min: 0,
      max: 100
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    reportFile: {
      type: String,
      default: null
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'matched', 'unavailable'],
      default: 'available'
    },
    applicationStatus: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Matched', 'Completed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

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
