import express from 'express';
import {
  getDietPlans, getDietPlan, createDietPlan, updateDietPlan, deleteDietPlan,
} from '../controllers/dietController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.route('/').get(getDietPlans).post(createDietPlan);
router.route('/:id').get(getDietPlan).put(updateDietPlan).delete(deleteDietPlan);

export default router;
