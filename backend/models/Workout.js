const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    default: 'other',
  },
  duration: { type: Number, required: true },     // minutes
  caloriesBurned: { type: Number, default: 0 },
  sets: { type: Number },
  reps: { type: Number },
  weight: { type: Number },                        // kg (for strength training)
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  title: { type: String, default: 'Workout Session' },
  exercises: [exerciseSchema],
  totalDuration: { type: Number, default: 0 },
  totalCaloriesBurned: { type: Number, default: 0 },
  notes: { type: String, maxlength: 500 },
}, { timestamps: true });

// Auto-calculate totals before saving
workoutSchema.pre('save', function (next) {
  if (this.exercises && this.exercises.length > 0) {
    this.totalDuration = this.exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
    this.totalCaloriesBurned = this.exercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);
