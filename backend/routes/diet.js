const express = require('express');
const { body } = require('express-validator');
const DietPlan = require('../models/DietPlan');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const router = express.Router();

// POST /api/diet — Create diet plan
router.post('/', auth, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('targetCalories').isInt({ min: 500, max: 10000 }),
  validate,
], async (req, res, next) => {
  try {
    const plan = await DietPlan.create({ user: req.userId, ...req.body });
    res.status(201).json({ message: 'Diet plan created', plan });
  } catch (error) { next(error); }
});

// GET /api/diet
router.get('/', auth, async (req, res, next) => {
  try {
    const plans = await DietPlan.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json({ plans });
  } catch (error) { next(error); }
});

// GET /api/diet/active
router.get('/active', auth, async (req, res, next) => {
  try {
    const plan = await DietPlan.findOne({ user: req.userId, isActive: true });
    res.json({ plan });
  } catch (error) { next(error); }
});

// GET /api/diet/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const plan = await DietPlan.findOne({ _id: req.params.id, user: req.userId });
    if (!plan) return res.status(404).json({ error: 'Diet plan not found' });
    res.json({ plan });
  } catch (error) { next(error); }
});

// PUT /api/diet/:id
router.put('/:id', auth, async (req, res, next) => {
  try {
    const plan = await DietPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ error: 'Diet plan not found' });
    res.json({ message: 'Diet plan updated', plan });
  } catch (error) { next(error); }
});

// DELETE /api/diet/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const plan = await DietPlan.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!plan) return res.status(404).json({ error: 'Diet plan not found' });
    res.json({ message: 'Diet plan deleted' });
  } catch (error) { next(error); }
});

// POST /api/diet/:id/meal
router.post('/:id/meal', auth, [
  body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snacks']),
  body('item.name').notEmpty(), body('item.calories').isInt({ min: 0 }),
  validate,
], async (req, res, next) => {
  try {
    const { mealType, item } = req.body;
    const plan = await DietPlan.findOne({ _id: req.params.id, user: req.userId });
    if (!plan) return res.status(404).json({ error: 'Diet plan not found' });
    plan.meals[mealType].push(item);
    await plan.save();
    res.json({ message: 'Meal item added', plan });
  } catch (error) { next(error); }
});

// POST /api/diet/generate — AI-generated diet plan
router.post('/generate', auth, async (req, res, next) => {
  try {
    const user = req.user;
    const tdee = user.calculateTDEE() || 2000;
    let targetCalories = tdee;
    if (user.goal === 'weight_loss') targetCalories = tdee - 500;
    else if (user.goal === 'weight_gain') targetCalories = tdee + 400;

    let pR = 0.30, cR = 0.40, fR = 0.30;
    if (user.goal === 'weight_loss') { pR = 0.35; cR = 0.35; fR = 0.30; }
    else if (user.goal === 'weight_gain') { pR = 0.30; cR = 0.45; fR = 0.25; }

    const targetProtein = Math.round((targetCalories * pR) / 4);
    const targetCarbs = Math.round((targetCalories * cR) / 4);
    const targetFats = Math.round((targetCalories * fR) / 9);

    const meals = generateMeals(targetCalories, user.goal);
    await DietPlan.updateMany({ user: req.userId, isActive: true }, { isActive: false });

    const plan = await DietPlan.create({
      user: req.userId, name: `AI Plan — ${user.goal.replace('_', ' ')}`,
      targetCalories, targetProtein, targetCarbs, targetFats,
      meals, isActive: true, isAIGenerated: true,
    });
    res.status(201).json({ message: 'AI diet plan generated', plan });
  } catch (error) { next(error); }
});

function generateMeals(cal, goal) {
  const b = Math.round(cal * 0.25), l = Math.round(cal * 0.35);
  const d = Math.round(cal * 0.30), s = Math.round(cal * 0.10);
  const m = {
    weight_loss: {
      breakfast: [
        { name: 'Greek Yogurt with Berries', calories: Math.round(b*0.5), protein: 15, carbs: 20, fats: 5, quantity: '1 bowl' },
        { name: 'Whole Grain Toast', calories: Math.round(b*0.3), protein: 8, carbs: 22, fats: 3, quantity: '2 slices' },
        { name: 'Egg Whites', calories: Math.round(b*0.2), protein: 18, carbs: 2, fats: 1, quantity: '4 whites' },
      ],
      lunch: [
        { name: 'Grilled Chicken Salad', calories: Math.round(l*0.5), protein: 35, carbs: 12, fats: 8, quantity: '1 bowl' },
        { name: 'Quinoa', calories: Math.round(l*0.3), protein: 8, carbs: 35, fats: 4, quantity: '1 cup' },
        { name: 'Steamed Broccoli', calories: Math.round(l*0.2), protein: 4, carbs: 8, fats: 1, quantity: '1 cup' },
      ],
      dinner: [
        { name: 'Baked Salmon', calories: Math.round(d*0.5), protein: 30, carbs: 0, fats: 14, quantity: '150g' },
        { name: 'Sweet Potato', calories: Math.round(d*0.3), protein: 3, carbs: 30, fats: 2, quantity: '1 medium' },
        { name: 'Green Salad', calories: Math.round(d*0.2), protein: 3, carbs: 8, fats: 5, quantity: '1 bowl' },
      ],
      snacks: [
        { name: 'Almonds', calories: Math.round(s*0.5), protein: 6, carbs: 3, fats: 14, quantity: '15 pcs' },
        { name: 'Apple', calories: Math.round(s*0.5), protein: 0, carbs: 15, fats: 0, quantity: '1 apple' },
      ],
    },
    weight_gain: {
      breakfast: [
        { name: 'Protein Pancakes', calories: Math.round(b*0.4), protein: 25, carbs: 40, fats: 8, quantity: '3 pancakes' },
        { name: 'PB Banana Smoothie', calories: Math.round(b*0.35), protein: 15, carbs: 35, fats: 12, quantity: '1 glass' },
        { name: 'Whole Eggs', calories: Math.round(b*0.25), protein: 18, carbs: 2, fats: 15, quantity: '3 eggs' },
      ],
      lunch: [
        { name: 'Rice & Chicken', calories: Math.round(l*0.5), protein: 40, carbs: 50, fats: 8, quantity: '1 plate' },
        { name: 'Lentil Soup', calories: Math.round(l*0.3), protein: 18, carbs: 30, fats: 4, quantity: '1 bowl' },
        { name: 'Mixed Veggies', calories: Math.round(l*0.2), protein: 5, carbs: 15, fats: 3, quantity: '1 cup' },
      ],
      dinner: [
        { name: 'Steak & Potatoes', calories: Math.round(d*0.5), protein: 40, carbs: 35, fats: 18, quantity: '200g' },
        { name: 'Pasta', calories: Math.round(d*0.35), protein: 12, carbs: 50, fats: 10, quantity: '1 plate' },
        { name: 'Cheese', calories: Math.round(d*0.15), protein: 8, carbs: 12, fats: 10, quantity: '1 serving' },
      ],
      snacks: [
        { name: 'Trail Mix', calories: Math.round(s*0.5), protein: 8, carbs: 20, fats: 15, quantity: '1/3 cup' },
        { name: 'Protein Bar', calories: Math.round(s*0.5), protein: 20, carbs: 25, fats: 8, quantity: '1 bar' },
      ],
    },
    maintenance: {
      breakfast: [
        { name: 'Oatmeal with Honey', calories: Math.round(b*0.5), protein: 10, carbs: 40, fats: 8, quantity: '1 bowl' },
        { name: 'Boiled Eggs', calories: Math.round(b*0.3), protein: 12, carbs: 1, fats: 10, quantity: '2 eggs' },
        { name: 'Orange Juice', calories: Math.round(b*0.2), protein: 2, carbs: 25, fats: 0, quantity: '1 glass' },
      ],
      lunch: [
        { name: 'Turkey Wrap', calories: Math.round(l*0.45), protein: 28, carbs: 30, fats: 10, quantity: '1 wrap' },
        { name: 'Veggie Soup', calories: Math.round(l*0.3), protein: 6, carbs: 18, fats: 4, quantity: '1 bowl' },
        { name: 'Fruit Salad', calories: Math.round(l*0.25), protein: 2, carbs: 30, fats: 1, quantity: '1 cup' },
      ],
      dinner: [
        { name: 'Grilled Fish & Rice', calories: Math.round(d*0.5), protein: 30, carbs: 40, fats: 8, quantity: '1 plate' },
        { name: 'Caesar Salad', calories: Math.round(d*0.3), protein: 8, carbs: 12, fats: 10, quantity: '1 bowl' },
        { name: 'Wheat Bread', calories: Math.round(d*0.2), protein: 5, carbs: 20, fats: 3, quantity: '2 slices' },
      ],
      snacks: [
        { name: 'Greek Yogurt', calories: Math.round(s*0.5), protein: 12, carbs: 8, fats: 3, quantity: '1 cup' },
        { name: 'Dark Chocolate', calories: Math.round(s*0.5), protein: 2, carbs: 15, fats: 8, quantity: '2 squares' },
      ],
    },
  };
  return m[goal] || m.maintenance;
}

module.exports = router;
