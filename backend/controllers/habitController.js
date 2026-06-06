import Habit from '../models/Habit.js';
import { todayStr } from '../utils/helpers.js';

const allHabitsDone = (habits) =>
  habits.drinkWater && habits.exercise && habits.sleep8Hours && habits.walkDaily;

/** Calculate streak from recent habit records */
const calcStreak = async (userId) => {
  const records = await Habit.find({ user: userId }).sort('-date').limit(60);
  let streak = 0;
  for (const r of records) {
    if (allHabitsDone(r.habits)) streak++;
    else break;
  }
  return streak;
};

export const getTodayHabits = async (req, res) => {
  const date = req.query.date || todayStr();
  let record = await Habit.findOne({ user: req.user._id, date });
  if (!record) {
    record = await Habit.create({
      user: req.user._id,
      date,
      habits: { drinkWater: false, exercise: false, sleep8Hours: false, walkDaily: false },
    });
  }
  const streak = await calcStreak(req.user._id);
  res.json({ record, streak });
};

export const updateHabits = async (req, res) => {
  try {
    const date = req.body.date || todayStr();
    let record = await Habit.findOne({ user: req.user._id, date });
    if (!record) {
      record = new Habit({ user: req.user._id, date, habits: req.body.habits });
    } else {
      record.habits = { ...record.habits.toObject(), ...req.body.habits };
    }
    record.streak = allHabitsDone(record.habits) ? await calcStreak(req.user._id) + 1 : 0;
    await record.save();
    const streak = await calcStreak(req.user._id);
    res.json({ record, streak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHabitHistory = async (req, res) => {
  const records = await Habit.find({ user: req.user._id }).sort('-date').limit(30);
  res.json(records);
};
