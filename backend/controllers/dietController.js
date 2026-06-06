import DietPlan from '../models/DietPlan.js';

const defaultMeal = (time) => ({ name: '', items: [], time, calories: 0 });

export const getDietPlans = async (req, res) => {
  const plans = await DietPlan.find({ user: req.user._id }).sort('-createdAt');
  res.json(plans);
};

export const getDietPlan = async (req, res) => {
  const plan = await DietPlan.findOne({ _id: req.params.id, user: req.user._id });
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  res.json(plan);
};

export const createDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.create({
      user: req.user._id,
      title: req.body.title,
      dietType: req.body.dietType || 'veg',
      breakfast: req.body.breakfast || defaultMeal('08:00'),
      lunch: req.body.lunch || defaultMeal('13:00'),
      eveningSnacks: req.body.eveningSnacks || defaultMeal('17:00'),
      dinner: req.body.dinner || defaultMeal('20:00'),
      remindersEnabled: req.body.remindersEnabled || false,
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDietPlan = async (req, res) => {
  const plan = await DietPlan.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  res.json(plan);
};

export const deleteDietPlan = async (req, res) => {
  const plan = await DietPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  res.json({ message: 'Plan deleted' });
};
