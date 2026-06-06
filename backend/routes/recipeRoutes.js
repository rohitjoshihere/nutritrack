import express from 'express';
import {
  getRecipes, getRecipe, toggleFavorite, getFavorites,
  createRecipe, updateRecipe, deleteRecipe,
} from '../controllers/recipeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getRecipes);
router.get('/favorites/list', protect, getFavorites);
router.get('/:id', protect, getRecipe);
router.post('/:id/favorite', protect, toggleFavorite);

router.post('/', protect, admin, createRecipe);
router.put('/:id', protect, admin, updateRecipe);
router.delete('/:id', protect, admin, deleteRecipe);

export default router;
