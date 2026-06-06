import express from 'express';
import { logWater, getDailyWater, deleteWaterEntry, getWaterHistory } from '../controllers/waterController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/', logWater);
router.get('/', getDailyWater);
router.get('/history', getWaterHistory);
router.delete('/:id', deleteWaterEntry);

export default router;
