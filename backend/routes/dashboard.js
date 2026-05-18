const express = require('express');
const { body, query } = require('express-validator');
const DailyLog = require('../models/DailyLog');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Helper to normalize date to start of day
const normalizeDate = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// POST /api/dashboard/log — Create or update daily log
router.post('/log', auth, [
  body('date').optional().isISO8601(),
  body('calories.consumed').optional().isInt({ min: 0 }),
  body('calories.burned').optional().isInt({ min: 0 }),
  body('calories.target').optional().isInt({ min: 0 }),
  body('weight').optional().isFloat({ min: 20, max: 500 }),
  body('steps').optional().isInt({ min: 0 }),
  body('waterIntake').optional().isInt({ min: 0 }),
  body('sleepHours').optional().isFloat({ min: 0, max: 24 }),
  body('mood').optional().isIn(['great', 'good', 'okay', 'bad', 'terrible']),
  validate,
], async (req, res, next) => {
  try {
    const date = normalizeDate(req.body.date);
    const updateData = { ...req.body, date };
    delete updateData.user;

    const log = await DailyLog.findOneAndUpdate(
      { user: req.userId, date },
      { $set: updateData, user: req.userId },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: 'Daily log saved', log });
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard/today — Get today's log
router.get('/today', auth, async (req, res, next) => {
  try {
    const today = normalizeDate();
    let log = await DailyLog.findOne({ user: req.userId, date: today });

    if (!log) {
      // Calculate target calories from user TDEE
      const user = req.user;
      const tdee = user.calculateTDEE() || 2000;
      let targetCalories = tdee;
      if (user.goal === 'weight_loss') targetCalories = tdee - 500;
      else if (user.goal === 'weight_gain') targetCalories = tdee + 400;

      log = await DailyLog.create({
        user: req.userId,
        date: today,
        calories: { consumed: 0, burned: 0, target: targetCalories },
      });
    }

    res.json({ log });
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard/history?days=30 — Get log history
router.get('/history', auth, [
  query('days').optional().isInt({ min: 1, max: 365 }),
  validate,
], async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const logs = await DailyLog.find({
      user: req.userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    res.json({ logs, count: logs.length });
  } catch (error) {
    next(error);
  }
});

// GET /api/dashboard/summary — Aggregated stats
router.get('/summary', auth, async (req, res, next) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);
    weekAgo.setHours(0, 0, 0, 0);
    monthAgo.setHours(0, 0, 0, 0);

    const [weekLogs, monthLogs] = await Promise.all([
      DailyLog.find({ user: req.userId, date: { $gte: weekAgo } }),
      DailyLog.find({ user: req.userId, date: { $gte: monthAgo } }),
    ]);

    const avgCalories = weekLogs.length > 0
      ? Math.round(weekLogs.reduce((sum, l) => sum + (l.calories?.consumed || 0), 0) / weekLogs.length)
      : 0;

    const avgSteps = weekLogs.length > 0
      ? Math.round(weekLogs.reduce((sum, l) => sum + (l.steps || 0), 0) / weekLogs.length)
      : 0;

    const avgWater = weekLogs.length > 0
      ? parseFloat((weekLogs.reduce((sum, l) => sum + (l.waterIntake || 0), 0) / weekLogs.length).toFixed(1))
      : 0;

    const avgSleep = weekLogs.length > 0
      ? parseFloat((weekLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / weekLogs.length).toFixed(1))
      : 0;

    const totalWorkoutCalories = monthLogs.reduce((sum, l) => sum + (l.calories?.burned || 0), 0);
    const streakDays = weekLogs.filter(l => (l.calories?.consumed || 0) > 0).length;

    res.json({
      weekly: {
        avgCalories,
        avgSteps,
        avgWater,
        avgSleep,
        streakDays,
        logsCount: weekLogs.length,
      },
      monthly: {
        totalWorkoutCalories,
        logsCount: monthLogs.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
