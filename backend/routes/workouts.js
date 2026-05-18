const express = require('express');
const { body } = require('express-validator');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const router = express.Router();

// POST /api/workouts
router.post('/', auth, [
  body('title').optional().trim(),
  body('exercises').isArray({ min: 1 }).withMessage('At least one exercise required'),
  body('exercises.*.name').notEmpty(),
  body('exercises.*.duration').isInt({ min: 1 }),
  validate,
], async (req, res, next) => {
  try {
    const workout = await Workout.create({ user: req.userId, ...req.body });
    res.status(201).json({ message: 'Workout logged', workout });
  } catch (error) { next(error); }
});

// GET /api/workouts
router.get('/', auth, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const workouts = await Workout.find({ user: req.userId })
      .sort({ date: -1 }).limit(limit);
    res.json({ workouts });
  } catch (error) { next(error); }
});

// GET /api/workouts/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.userId });
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json({ workout });
  } catch (error) { next(error); }
});

// DELETE /api/workouts/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch (error) { next(error); }
});

module.exports = router;
