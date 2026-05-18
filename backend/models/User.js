const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  age: { type: Number, min: 10, max: 120 },
  height: { type: Number, min: 50, max: 300 },       // cm
  weight: { type: Number, min: 20, max: 500 },       // kg
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'sedentary',
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'maintenance', 'weight_gain'],
    default: 'maintenance',
  },
  targetWeight: { type: Number, min: 20, max: 500 },
  profileCompleted: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate BMI
userSchema.methods.calculateBMI = function () {
  if (!this.height || !this.weight) return null;
  const heightInMeters = this.height / 100;
  return parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
};

// Calculate BMR (Mifflin-St Jeor)
userSchema.methods.calculateBMR = function () {
  if (!this.age || !this.height || !this.weight) return null;
  if (this.gender === 'male') {
    return Math.round(10 * this.weight + 6.25 * this.height - 5 * this.age + 5);
  }
  return Math.round(10 * this.weight + 6.25 * this.height - 5 * this.age - 161);
};

// Calculate TDEE
userSchema.methods.calculateTDEE = function () {
  const bmr = this.calculateBMR();
  if (!bmr) return null;
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * (multipliers[this.activityLevel] || 1.2));
};

module.exports = mongoose.model('User', userSchema);
