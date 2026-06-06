import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    servingSize: { type: String, default: '100g' },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    dietType: { type: String, enum: ['veg', 'non_veg', 'both'], default: 'both' },
  },
  { timestamps: true }
);

export default mongoose.model('FoodItem', foodItemSchema);
