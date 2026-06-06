import express from 'express';
import {
  getUsers, blockUser, deleteUser, getFoodItems, createFoodItem,
  updateFoodItem, deleteFoodItem, getStats,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);
router.get('/foods', getFoodItems);
router.post('/foods', createFoodItem);
router.put('/foods/:id', updateFoodItem);
router.delete('/foods/:id', deleteFoodItem);

export default router;
