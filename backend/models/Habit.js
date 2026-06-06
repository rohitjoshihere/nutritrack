import mongoose from 'mongoose';

const habitCheckSchema = new mongoose.Schema({
  drinkWater: { type: Boolean, default: false },
  exercise: { type: Boolean, default: false },
  sleep8Hours: { type: Boolean, default: false },
  walkDaily: { type: Boolean, default: false },
});

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    habits: habitCheckSchema,
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

habitSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Habit', habitSchema);
