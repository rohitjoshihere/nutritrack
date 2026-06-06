import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
  return { resetToken, hashed };
};

/** Health calculation helpers (also used by API) */
export const calcBMI = (heightCm, weightKg) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi: Math.round(bmi * 10) / 10, category };
};

export const calcBMR = (weight, height, age, gender, activityLevel, fitnessGoal) => {
  // Mifflin-St Jeor
  let bmr =
    gender === 'female'
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5;

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  let dailyCalories = tdee;
  if (fitnessGoal === 'weight_loss') dailyCalories = tdee - 500;
  if (fitnessGoal === 'weight_gain') dailyCalories = tdee + 500;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories: Math.round(dailyCalories),
  };
};

export const calcWaterIntake = (weightKg, activityLevel) => {
  let base = weightKg * 35; // ml per kg
  if (activityLevel === 'active' || activityLevel === 'very_active') base += 500;
  if (activityLevel === 'moderate') base += 250;
  return Math.round(base);
};

export const todayStr = () => new Date().toISOString().split('T')[0];
