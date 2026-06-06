import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true }, // ml
    time: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('WaterLog', waterLogSchema);
