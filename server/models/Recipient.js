const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recipientSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
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
    requiredOrgan: {
      type: String,
      required: [true, 'Required organ is required'],
      lowercase: true,
      trim: true
    },
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: [true, 'Urgency level is required']
    },
    requiredHealthThreshold: {
      type: Number,
      required: [true, 'Required health threshold is required'],
      min: 0,
      max: 100
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    applicationStatus: {
      type: String,
      enum: ['Pending', 'Waiting', 'Match Found', 'Scheduled', 'Completed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

recipientSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

recipientSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Recipient', recipientSchema);
