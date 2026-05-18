const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// PUT /api/user/profile — Update profile
router.put('/profile', auth, [
  body('age').optional().isInt({ min: 10, max: 120 }),
  body('height').optional().isFloat({ min: 50, max: 300 }),
  body('weight').optional().isFloat({ min: 20, max: 500 }),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('activityLevel').optional().isIn(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  body('goal').optional().isIn(['weight_loss', 'maintenance', 'weight_gain']),
  body('targetWeight').optional().isFloat({ min: 20, max: 500 }),
  body('name').optional().trim().isLength({ min: 2 }),
  validate,
], async (req, res, next) => {
  try {
    const allowedFields = ['name', 'age', 'height', 'weight', 'gender', 'activityLevel', 'goal', 'targetWeight'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Mark profile as completed if key fields are present
    if (updates.age && updates.height && updates.weight) {
      updates.profileCompleted = true;
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        activityLevel: user.activityLevel,
        goal: user.goal,
        targetWeight: user.targetWeight,
        profileCompleted: user.profileCompleted,
        bmi: user.calculateBMI(),
        bmr: user.calculateBMR(),
        tdee: user.calculateTDEE(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/user/metrics — Get calculated metrics
router.get('/metrics', auth, async (req, res) => {
  const user = req.user;
  res.json({
    bmi: user.calculateBMI(),
    bmr: user.calculateBMR(),
    tdee: user.calculateTDEE(),
    weight: user.weight,
    height: user.height,
    age: user.age,
    gender: user.gender,
    activityLevel: user.activityLevel,
    goal: user.goal,
    targetWeight: user.targetWeight,
  });
});

module.exports = router;
