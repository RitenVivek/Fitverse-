const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },   // grams
  carbs: { type: Number, default: 0 },     // grams
  fats: { type: Number, default: 0 },      // grams
  quantity: { type: String, default: '1 serving' },
});

const dietPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: 'My Diet Plan',
  },
  targetCalories: { type: Number, required: true },
  targetProtein: { type: Number },
  targetCarbs: { type: Number },
  targetFats: { type: Number },
  meals: {
    breakfast: [mealItemSchema],
    lunch: [mealItemSchema],
    dinner: [mealItemSchema],
    snacks: [mealItemSchema],
  },
  isActive: { type: Boolean, default: true },
  isAIGenerated: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
