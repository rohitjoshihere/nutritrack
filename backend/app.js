import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import calculatorRoutes from './routes/calculatorRoutes.js';
import dietRoutes from './routes/dietRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import weightRoutes from './routes/weightRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'NutriTrack API' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calculators', calculatorRoutes);
app.use('/api/diet-plans', dietRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

export default app;
