import { calcBMI, calcBMR, calcWaterIntake } from '../utils/helpers.js';

/** POST /api/calculators/bmi */
export const calculateBMI = (req, res) => {
  const { height, weight } = req.body;
  if (!height || !weight) {
    return res.status(400).json({ message: 'Height (cm) and weight (kg) required' });
  }
  res.json(calcBMI(Number(height), Number(weight)));
};

/** POST /api/calculators/bmr */
export const calculateBMR = (req, res) => {
  const { weight, height, age, gender, activityLevel, fitnessGoal } = req.body;
  if (!weight || !height || !age || !gender) {
    return res.status(400).json({ message: 'Weight, height, age and gender required' });
  }
  res.json(calcBMR(Number(weight), Number(height), Number(age), gender, activityLevel, fitnessGoal));
};

/** POST /api/calculators/water */
export const calculateWater = (req, res) => {
  const { weight, activityLevel } = req.body;
  if (!weight) return res.status(400).json({ message: 'Weight (kg) required' });
  res.json({ recommendedMl: calcWaterIntake(Number(weight), activityLevel) });
};
