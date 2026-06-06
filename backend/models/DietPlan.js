import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  items: [{ type: String }],
  time: { type: String, default: '08:00' },
  calories: { type: Number, default: 0 },
});

const dietPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    dietType: { type: String, enum: ['veg', 'non_veg'], default: 'veg' },
    breakfast: mealSchema,
    lunch: mealSchema,
    eveningSnacks: mealSchema,
    dinner: mealSchema,
    remindersEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('DietPlan', dietPlanSchema);
