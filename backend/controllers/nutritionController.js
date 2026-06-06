import NutritionLog from '../models/NutritionLog.js';
import { todayStr } from '../utils/helpers.js';

const sumMeal = (entries = []) =>
  entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      protein: acc.protein + (e.protein || 0),
      carbs: acc.carbs + (e.carbs || 0),
      fat: acc.fat + (e.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

const getSummary = (log) => {
  const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  meals.forEach((m) => {
    const s = sumMeal(log[m]);
    totals.calories += s.calories;
    totals.protein += s.protein;
    totals.carbs += s.carbs;
    totals.fat += s.fat;
  });
  return totals;
};

/** Get or create log for a date */
const getOrCreateLog = async (userId, date) => {
  let log = await NutritionLog.findOne({ user: userId, date });
  if (!log) log = await NutritionLog.create({ user: userId, date });
  return log;
};

export const getLog = async (req, res) => {
  const date = req.query.date || todayStr();
  const log = await getOrCreateLog(req.user._id, date);
  res.json({ log, summary: getSummary(log) });
};

export const addFood = async (req, res) => {
  try {
    const { date, mealType, food } = req.body;
    const validMeals = ['breakfast', 'lunch', 'dinner', 'snacks'];
    if (!validMeals.includes(mealType)) {
      return res.status(400).json({ message: 'Invalid meal type' });
    }
    const log = await getOrCreateLog(req.user._id, date || todayStr());
    log[mealType].push(food);
    await log.save();
    res.json({ log, summary: getSummary(log) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFood = async (req, res) => {
  const { date, mealType, index } = req.body;
  const log = await NutritionLog.findOne({ user: req.user._id, date: date || todayStr() });
  if (!log) return res.status(404).json({ message: 'Log not found' });
  log[mealType].splice(index, 1);
  await log.save();
  res.json({ log, summary: getSummary(log) });
};

export const getHistory = async (req, res) => {
  const logs = await NutritionLog.find({ user: req.user._id })
    .sort('-date')
    .limit(30);
  res.json(logs.map((l) => ({ date: l.date, summary: getSummary(l) })));
};
