import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import FoodItem from '../models/FoodItem.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutritrack');

  // Admin user
  const adminExists = await User.findOne({ email: 'admin@nutritrack.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@nutritrack.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created: admin@nutritrack.com / admin123');
  }

  // Sample recipes
  if ((await Recipe.countDocuments()) === 0) {
    await Recipe.insertMany([
      {
        name: 'Grilled Chicken Salad',
        description: 'High protein low carb salad',
        ingredients: ['200g chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Olive oil', 'Lemon'],
        instructions: 'Grill chicken. Toss with greens and dressing.',
        calories: 350, protein: 42, carbs: 12, fat: 14, prepTime: 25,
        dietType: 'non_veg', tags: ['high_protein', 'low_carb'],
      },
      {
        name: 'Overnight Oats',
        description: 'Easy healthy breakfast',
        ingredients: ['Oats', 'Almond milk', 'Banana', 'Chia seeds', 'Honey'],
        instructions: 'Mix all ingredients. Refrigerate overnight.',
        calories: 280, protein: 10, carbs: 45, fat: 8, prepTime: 10,
        dietType: 'veg', tags: ['low_fat'],
      },
      {
        name: 'Paneer Tikka',
        description: 'Indian high protein vegetarian dish',
        ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell peppers', 'Onion'],
        instructions: 'Marinate paneer. Grill until golden.',
        calories: 320, protein: 22, carbs: 15, fat: 20, prepTime: 35,
        dietType: 'veg', tags: ['high_protein'],
      },
      {
        name: 'Quinoa Buddha Bowl',
        description: 'Balanced vegan-friendly bowl',
        ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Spinach', 'Tahini'],
        instructions: 'Cook quinoa. Assemble bowl with toppings.',
        calories: 410, protein: 16, carbs: 52, fat: 16, prepTime: 30,
        dietType: 'veg', tags: ['low_fat'],
      },
    ]);
    console.log('Sample recipes seeded');
  }

  // Food database
  if ((await FoodItem.countDocuments()) === 0) {
    await FoodItem.insertMany([
      { name: 'Boiled Egg', servingSize: '1 large', calories: 78, protein: 6, carbs: 0.6, fat: 5, dietType: 'veg' },
      { name: 'Brown Rice', servingSize: '1 cup', calories: 216, protein: 5, carbs: 45, fat: 1.8, dietType: 'veg' },
      { name: 'Grilled Salmon', servingSize: '100g', calories: 206, protein: 22, carbs: 0, fat: 12, dietType: 'non_veg' },
      { name: 'Greek Yogurt', servingSize: '170g', calories: 100, protein: 17, carbs: 6, fat: 0.7, dietType: 'veg' },
      { name: 'Almonds', servingSize: '28g', calories: 164, protein: 6, carbs: 6, fat: 14, dietType: 'veg' },
    ]);
    console.log('Food items seeded');
  }

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
