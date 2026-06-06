import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    ingredients: [{ type: String }],
    instructions: { type: String, default: '' },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    prepTime: { type: Number, default: 30 }, // minutes
    dietType: { type: String, enum: ['veg', 'non_veg'], default: 'veg' },
    tags: [{ type: String }], // high_protein, low_carb, low_fat
    imageUrl: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Recipe', recipeSchema);
