import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import FoodItem from '../models/FoodItem.js';

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json(users);
};

export const blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ message: user.isBlocked ? 'User blocked' : 'User unblocked', user });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

export const getFoodItems = async (req, res) => {
  const items = await FoodItem.find().sort('name');
  res.json(items);
};

export const createFoodItem = async (req, res) => {
  const item = await FoodItem.create(req.body);
  res.status(201).json(item);
};

export const updateFoodItem = async (req, res) => {
  const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
};

export const deleteFoodItem = async (req, res) => {
  await FoodItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Food item deleted' });
};

export const getStats = async (req, res) => {
  const [users, recipes, foods] = await Promise.all([
    User.countDocuments(),
    Recipe.countDocuments(),
    FoodItem.countDocuments(),
  ]);
  res.json({ users, recipes, foods });
};
