const mongoose = require('mongoose');

const weightEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 500,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: { type: String, maxlength: 200 },
}, { timestamps: true });

weightEntrySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('WeightEntry', weightEntrySchema);
