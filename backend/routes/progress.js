const express = require('express');
const { body, query } = require('express-validator');
const WeightEntry = require('../models/WeightEntry');
const DailyLog = require('../models/DailyLog');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const router = express.Router();

// POST /api/progress/weight — Add weight entry
router.post('/weight', auth, [
  body('weight').isFloat({ min: 20, max: 500 }),
  body('date').optional().isISO8601(),
  validate,
], async (req, res, next) => {
  try {
    const entry = await WeightEntry.create({
      user: req.userId,
      weight: req.body.weight,
      date: req.body.date || new Date(),
      notes: req.body.notes,
    });
    // Also update user's current weight
    await require('../models/User').findByIdAndUpdate(req.userId, { weight: req.body.weight });
    res.status(201).json({ message: 'Weight recorded', entry });
  } catch (error) { next(error); }
});

// GET /api/progress/weight — Weight history
router.get('/weight', auth, [
  query('days').optional().isInt({ min: 1, max: 365 }),
  validate,
], async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const entries = await WeightEntry.find({
      user: req.userId, date: { $gte: startDate },
    }).sort({ date: 1 });
    res.json({ entries, count: entries.length });
  } catch (error) { next(error); }
});

// GET /api/progress/charts — Chart data for frontend
router.get('/charts', auth, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const [logs, weightEntries] = await Promise.all([
      DailyLog.find({ user: req.userId, date: { $gte: startDate } }).sort({ date: 1 }),
      WeightEntry.find({ user: req.userId, date: { $gte: startDate } }).sort({ date: 1 }),
    ]);

    const caloriesData = logs.map(l => ({
      date: l.date.toISOString().split('T')[0],
      consumed: l.calories?.consumed || 0,
      burned: l.calories?.burned || 0,
      target: l.calories?.target || 2000,
    }));

    const stepsData = logs.map(l => ({
      date: l.date.toISOString().split('T')[0],
      steps: l.steps || 0,
    }));

    const waterData = logs.map(l => ({
      date: l.date.toISOString().split('T')[0],
      glasses: l.waterIntake || 0,
    }));

    const weightData = weightEntries.map(e => ({
      date: e.date.toISOString().split('T')[0],
      weight: e.weight,
    }));

    res.json({ caloriesData, stepsData, waterData, weightData });
  } catch (error) { next(error); }
});

module.exports = router;
