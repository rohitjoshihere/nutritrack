import express from 'express';
import { addWeight, getWeightHistory, deleteWeight } from '../controllers/weightController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/', addWeight);
router.get('/', getWeightHistory);
router.delete('/:id', deleteWeight);

export default router;
