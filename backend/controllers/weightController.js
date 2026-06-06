import WeightLog from '../models/WeightLog.js';
import { todayStr } from '../utils/helpers.js';

export const addWeight = async (req, res) => {
  try {
    const entry = await WeightLog.create({
      user: req.user._id,
      weight: req.body.weight,
      date: req.body.date || todayStr(),
      note: req.body.note || '',
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWeightHistory = async (req, res) => {
  const logs = await WeightLog.find({ user: req.user._id }).sort('-date');
  res.json(logs);
};

export const deleteWeight = async (req, res) => {
  await WeightLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Deleted' });
};
