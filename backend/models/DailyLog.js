const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    },
  },
  calories: {
    consumed: { type: Number, default: 0 },
    burned: { type: Number, default: 0 },
    target: { type: Number, default: 2000 },
  },
  weight: { type: Number },                    // kg (daily weigh-in)
  steps: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 },   // glasses
  sleepHours: { type: Number, default: 0 },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'bad', 'terrible'],
    default: 'okay',
  },
  notes: { type: String, maxlength: 500 },
}, { timestamps: true });

// Ensure one log per user per day
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
