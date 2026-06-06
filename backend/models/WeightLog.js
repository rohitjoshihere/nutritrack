import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weight: { type: Number, required: true },
    date: { type: String, required: true },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('WeightLog', weightLogSchema);
