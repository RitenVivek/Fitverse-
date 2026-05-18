const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const WeightEntry = require('../models/WeightEntry');
const DailyLog = require('../models/DailyLog');
const auth = require('../middleware/auth');
const router = express.Router();

// Helper to run Python scripts
function runPython(script, inputData) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'ml', script);
    const child = execFile('python', [scriptPath], { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) {
        console.error('Python error:', stderr);
        reject(new Error(stderr || err.message));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (e) {
        reject(new Error('Failed to parse Python output: ' + stdout));
      }
    });
    child.stdin.write(JSON.stringify(inputData));
    child.stdin.end();
  });
}

// GET /api/ml/predict-weight — Weight prediction using Linear Regression
router.get('/predict-weight', auth, async (req, res, next) => {
  try {
    const entries = await WeightEntry.find({ user: req.userId })
      .sort({ date: 1 }).limit(365);

    if (entries.length < 3) {
      return res.json({
        prediction: null,
        message: 'Need at least 3 weight entries for prediction. Keep logging!',
        currentEntries: entries.length,
      });
    }

    const weightData = entries.map(e => ({
      date: e.date.toISOString().split('T')[0],
      weight: e.weight,
    }));

    const targetWeight = req.user.targetWeight || req.user.weight;

    const result = await runPython('weight_predictor.py', {
      weights: weightData,
      targetWeight,
      daysToPredict: 90,
    });

    res.json(result);
  } catch (error) {
    // Fallback if Python is not available
    console.error('ML Error:', error.message);
    const entries = await WeightEntry.find({ user: req.userId }).sort({ date: 1 });
    res.json(fallbackWeightPrediction(entries, req.user));
  }
});

// GET /api/ml/insights — AI fitness insights
router.get('/insights', auth, async (req, res, next) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const [thisWeekLogs, lastWeekLogs, weightEntries] = await Promise.all([
      DailyLog.find({ user: req.userId, date: { $gte: weekAgo } }),
      DailyLog.find({ user: req.userId, date: { $gte: twoWeeksAgo, $lt: weekAgo } }),
      WeightEntry.find({ user: req.userId }).sort({ date: -1 }).limit(30),
    ]);

    const user = req.user;
    const insights = [];

    // Consistency insight
    const thisWeekCount = thisWeekLogs.length;
    const lastWeekCount = lastWeekLogs.length;
    if (thisWeekCount >= 5) {
      insights.push({ type: 'success', message: `Amazing consistency! You logged ${thisWeekCount} days this week.` });
    } else if (thisWeekCount < lastWeekCount && lastWeekCount > 0) {
      insights.push({ type: 'warning', message: `Consistency dropped this week (${thisWeekCount} vs ${lastWeekCount} days last week). Stay on track!` });
    } else if (thisWeekCount > 0) {
      insights.push({ type: 'info', message: `You've logged ${thisWeekCount} days this week. Aim for at least 5!` });
    }

    // Calorie insight
    const avgCalories = thisWeekLogs.length > 0
      ? Math.round(thisWeekLogs.reduce((s, l) => s + (l.calories?.consumed || 0), 0) / thisWeekLogs.length) : 0;
    const tdee = user.calculateTDEE();
    if (tdee && avgCalories > 0) {
      if (user.goal === 'weight_loss' && avgCalories > tdee) {
        insights.push({ type: 'warning', message: `Your avg intake (${avgCalories} cal) exceeds your TDEE (${tdee} cal). Consider reducing portions.` });
      } else if (user.goal === 'weight_loss' && avgCalories <= tdee - 500) {
        insights.push({ type: 'success', message: `Great deficit! Avg ${avgCalories} cal/day vs ${tdee} TDEE. On track for weight loss.` });
      }
    }

    // Weight trend insight
    if (weightEntries.length >= 2) {
      const latest = weightEntries[0].weight;
      const oldest = weightEntries[weightEntries.length - 1].weight;
      const diff = (latest - oldest).toFixed(1);
      if (user.goal === 'weight_loss' && diff < 0) {
        insights.push({ type: 'success', message: `You've lost ${Math.abs(diff)} kg! Keep going!` });
      } else if (user.goal === 'weight_gain' && diff > 0) {
        insights.push({ type: 'success', message: `You've gained ${diff} kg of progress!` });
      }

      // Target weight estimation
      if (user.targetWeight && weightEntries.length >= 3) {
        const weeklyChange = (latest - oldest) / (weightEntries.length / 7 || 1);
        const remaining = Math.abs(user.targetWeight - latest);
        if (Math.abs(weeklyChange) > 0.05) {
          const weeksNeeded = Math.ceil(remaining / Math.abs(weeklyChange));
          const daysNeeded = weeksNeeded * 7;
          if (daysNeeded > 0 && daysNeeded < 365) {
            insights.push({ type: 'info', message: `At current pace, you may reach your target weight (${user.targetWeight} kg) in ~${daysNeeded} days.` });
          }
        }
      }
    }

    // Water intake insight
    const avgWater = thisWeekLogs.length > 0
      ? (thisWeekLogs.reduce((s, l) => s + (l.waterIntake || 0), 0) / thisWeekLogs.length).toFixed(1) : 0;
    if (avgWater < 6 && avgWater > 0) {
      insights.push({ type: 'warning', message: `Avg water: ${avgWater} glasses/day. Aim for 8+ glasses for optimal hydration.` });
    } else if (avgWater >= 8) {
      insights.push({ type: 'success', message: `Great hydration! Averaging ${avgWater} glasses/day.` });
    }

    // Steps insight
    const avgSteps = thisWeekLogs.length > 0
      ? Math.round(thisWeekLogs.reduce((s, l) => s + (l.steps || 0), 0) / thisWeekLogs.length) : 0;
    if (avgSteps >= 10000) {
      insights.push({ type: 'success', message: `Excellent! Averaging ${avgSteps.toLocaleString()} steps/day.` });
    } else if (avgSteps > 0 && avgSteps < 5000) {
      insights.push({ type: 'warning', message: `Only ${avgSteps.toLocaleString()} avg steps/day. Try to reach 10,000!` });
    }

    if (insights.length === 0) {
      insights.push({ type: 'info', message: 'Start logging your daily metrics to get personalized AI insights!' });
    }

    res.json({ insights });
  } catch (error) { next(error); }
});

// GET /api/ml/calorie-recommendation
router.get('/calorie-recommendation', auth, async (req, res, next) => {
  try {
    const user = req.user;
    const inputData = {
      age: user.age || 25, height: user.height || 170,
      weight: user.weight || 70, gender: user.gender || 'male',
      activityLevel: user.activityLevel || 'sedentary',
      goal: user.goal || 'maintenance',
    };

    let result;
    try {
      result = await runPython('calorie_recommender.py', inputData);
    } catch {
      result = fallbackCalorieRecommendation(inputData);
    }
    res.json(result);
  } catch (error) { next(error); }
});

// Fallback functions if Python is not available
function fallbackWeightPrediction(entries, user) {
  if (entries.length < 3) {
    return { prediction: null, message: 'Need more data points', currentEntries: entries.length };
  }
  const weights = entries.map(e => e.weight);
  const n = weights.length;
  const avgChange = (weights[n - 1] - weights[0]) / n;
  const predictions = [];
  let lastWeight = weights[n - 1];
  for (let i = 1; i <= 90; i++) {
    lastWeight += avgChange;
    if (i % 7 === 0) {
      predictions.push({ day: i, weight: parseFloat(lastWeight.toFixed(1)) });
    }
  }
  const targetDays = user.targetWeight
    ? Math.ceil(Math.abs(user.targetWeight - weights[n - 1]) / Math.abs(avgChange || 0.01))
    : null;
  return {
    currentWeight: weights[n - 1],
    predictions,
    trend: avgChange > 0 ? 'gaining' : avgChange < 0 ? 'losing' : 'stable',
    avgDailyChange: parseFloat(avgChange.toFixed(3)),
    daysToTarget: targetDays && targetDays < 365 ? targetDays : null,
    targetWeight: user.targetWeight,
    method: 'linear_fallback',
  };
}

function fallbackCalorieRecommendation(data) {
  let bmr;
  if (data.gender === 'male') {
    bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
  } else {
    bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
  }
  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  const tdee = Math.round(bmr * (mult[data.activityLevel] || 1.2));
  let target = tdee;
  if (data.goal === 'weight_loss') target = tdee - 500;
  else if (data.goal === 'weight_gain') target = tdee + 400;
  return {
    bmr: Math.round(bmr), tdee, recommendedCalories: target,
    macros: {
      protein: Math.round((target * 0.30) / 4),
      carbs: Math.round((target * 0.40) / 4),
      fats: Math.round((target * 0.30) / 9),
    },
    method: 'mifflin_st_jeor_fallback',
  };
}

module.exports = router;
