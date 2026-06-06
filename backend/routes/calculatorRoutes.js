import express from 'express';
import { calculateBMI, calculateBMR, calculateWater } from '../controllers/calculatorController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/bmi', calculateBMI);
router.post('/bmr', calculateBMR);
router.post('/water', calculateWater);

export default router;
