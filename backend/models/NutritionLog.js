import mongoose from 'mongoose';

const foodEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  quantity: { type: String, default: '1 serving' },
});

const nutritionLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    breakfast: [foodEntrySchema],
    lunch: [foodEntrySchema],
    dinner: [foodEntrySchema],
    snacks: [foodEntrySchema],
  },
  { timestamps: true }
);

nutritionLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('NutritionLog', nutritionLogSchema);
