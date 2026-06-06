import WaterLog from '../models/WaterLog.js';
import { todayStr } from '../utils/helpers.js';

export const logWater = async (req, res) => {
  try {
    const { amount, date, time } = req.body;
    const entry = await WaterLog.create({
      user: req.user._id,
      amount,
      date: date || todayStr(),
      time: time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDailyWater = async (req, res) => {
  const date = req.query.date || todayStr();
  const logs = await WaterLog.find({ user: req.user._id, date }).sort('createdAt');
  const total = logs.reduce((sum, l) => sum + l.amount, 0);
  res.json({ date, logs, total });
};

export const deleteWaterEntry = async (req, res) => {
  const entry = await WaterLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!entry) return res.status(404).json({ message: 'Entry not found' });
  res.json({ message: 'Deleted' });
};

export const getWaterHistory = async (req, res) => {
  const logs = await WaterLog.find({ user: req.user._id }).sort('-date').limit(100);
  const byDate = {};
  logs.forEach((l) => {
    byDate[l.date] = (byDate[l.date] || 0) + l.amount;
  });
  res.json(byDate);
};
