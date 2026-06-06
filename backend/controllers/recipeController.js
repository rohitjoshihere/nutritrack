import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

export const getRecipes = async (req, res) => {
  const { search, dietType, tag } = req.query;
  const filter = {};
  if (dietType) filter.dietType = dietType;
  if (tag) filter.tags = tag;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const recipes = await Recipe.find(filter).sort('-createdAt');
  res.json(recipes);
};

export const getRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json(recipe);
};

export const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);
  const id = req.params.id;
  const idx = user.favoriteRecipes.indexOf(id);
  if (idx > -1) user.favoriteRecipes.splice(idx, 1);
  else user.favoriteRecipes.push(id);
  await user.save();
  res.json({ favorites: user.favoriteRecipes });
};

export const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate('favoriteRecipes');
  res.json(user.favoriteRecipes);
};

// Admin CRUD
export const createRecipe = async (req, res) => {
  const recipe = await Recipe.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(recipe);
};

export const updateRecipe = async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json(recipe);
};

export const deleteRecipe = async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.json({ message: 'Recipe deleted' });
};
