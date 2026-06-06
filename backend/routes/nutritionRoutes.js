import express from 'express';
import { getLog, addFood, removeFood, getHistory } from '../controllers/nutritionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getLog);
router.get('/history', getHistory);
router.post('/add', addFood);
router.post('/remove', removeFood);

export default router;
