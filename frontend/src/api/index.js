import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.post(`/auth/reset-password/${token}`, { password }),
};

// User
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  setWaterGoal: (dailyWaterGoal) => API.put('/users/water-goal', { dailyWaterGoal }),
  setGoalWeight: (goalWeight) => API.put('/users/goal-weight', { goalWeight }),
};

// Calculators
export const calculatorAPI = {
  bmi: (data) => API.post('/calculators/bmi', data),
  bmr: (data) => API.post('/calculators/bmr', data),
  water: (data) => API.post('/calculators/water', data),
};

// Diet
export const dietAPI = {
  list: () => API.get('/diet-plans'),
  get: (id) => API.get(`/diet-plans/${id}`),
  create: (data) => API.post('/diet-plans', data),
  update: (id, data) => API.put(`/diet-plans/${id}`, data),
  remove: (id) => API.delete(`/diet-plans/${id}`),
};

// Recipes
export const recipeAPI = {
  list: (params) => API.get('/recipes', { params }),
  get: (id) => API.get(`/recipes/${id}`),
  favorites: () => API.get('/recipes/favorites/list'),
  toggleFavorite: (id) => API.post(`/recipes/${id}/favorite`),
  create: (data) => API.post('/recipes', data),
  update: (id, data) => API.put(`/recipes/${id}`, data),
  remove: (id) => API.delete(`/recipes/${id}`),
};

// Nutrition
export const nutritionAPI = {
  getLog: (date) => API.get('/nutrition', { params: { date } }),
  addFood: (data) => API.post('/nutrition/add', data),
  removeFood: (data) => API.post('/nutrition/remove', data),
  history: () => API.get('/nutrition/history'),
};

// Water
export const waterAPI = {
  log: (data) => API.post('/water', data),
  daily: (date) => API.get('/water', { params: { date } }),
  history: () => API.get('/water/history'),
  remove: (id) => API.delete(`/water/${id}`),
};

// Weight
export const weightAPI = {
  add: (data) => API.post('/weight', data),
  history: () => API.get('/weight'),
  remove: (id) => API.delete(`/weight/${id}`),
};

// Habits
export const habitAPI = {
  today: (date) => API.get('/habits', { params: { date } }),
  update: (data) => API.put('/habits', data),
  history: () => API.get('/habits/history'),
};

// Admin
export const adminAPI = {
  stats: () => API.get('/admin/stats'),
  users: () => API.get('/admin/users'),
  blockUser: (id) => API.put(`/admin/users/${id}/block`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  foods: () => API.get('/admin/foods'),
  createFood: (data) => API.post('/admin/foods', data),
  updateFood: (id, data) => API.put(`/admin/foods/${id}`, data),
  deleteFood: (id) => API.delete(`/admin/foods/${id}`),
};
