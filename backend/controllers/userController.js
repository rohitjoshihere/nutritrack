import User from '../models/User.js';

/** GET /api/users/profile */
export const getProfile = async (req, res) => {
  res.json(req.user);
};

/** PUT /api/users/profile */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, profile } = req.body;
    if (name) user.name = name;
    if (profile) {
      const current = user.profile?.toObject ? user.profile.toObject() : { ...user.profile };
      user.profile = { ...current, ...profile };
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** PUT /api/users/water-goal */
export const setWaterGoal = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.profile.dailyWaterGoal = req.body.dailyWaterGoal || 2000;
    await user.save();
    res.json(user.profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** PUT /api/users/goal-weight */
export const setGoalWeight = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.profile.goalWeight = req.body.goalWeight;
    await user.save();
    res.json(user.profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
