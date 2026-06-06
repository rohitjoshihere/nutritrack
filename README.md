# NutriTrack — Health & Nutrition Web App

Full-stack health and nutrition tracking application built with React, Node.js, Express, MongoDB, and JWT authentication.

## Project Structure

```
nutritrack/
├── backend/                 # Node.js + Express API
│   ├── config/              # Database connection
│   ├── controllers/         # Route handlers
│   ├── middleware/          # JWT auth middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── utils/               # Helpers & seed script
│   └── server.js            # Entry point
└── frontend/                # React + Vite + Tailwind
    └── src/
        ├── api/             # Axios API client
        ├── components/      # Reusable UI & layout
        ├── context/         # Auth context
        └── pages/           # Feature pages
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

## Setup

### 1. Backend

```bash
cd nutritrack/backend
cp .env.example .env
npm install
npm run seed    # Creates admin user + sample data
npm run dev     # Starts API on http://localhost:5000
```

**Default admin:** `admin@nutritrack.com` / `admin123`

### 2. Frontend

```bash
cd nutritrack/frontend
npm install
npm run dev     # Starts app on http://localhost:5173
```

## Features

| Feature | Description |
|---------|-------------|
| **Auth** | Register, Login, Logout, Forgot/Reset Password, JWT |
| **Profile** | Age, gender, height, weight, activity, fitness goal |
| **Calculators** | BMI, BMR/TDEE, Water intake |
| **Diet Planner** | Veg/Non-veg plans, meals, timings, reminders |
| **Recipes** | Browse, search, filter, favorites |
| **Nutrition Tracker** | Log meals, track macros, daily summary |
| **Water Tracker** | Daily goal, log intake, history |
| **Weight Tracker** | Log weight, chart, goal weight |
| **Habit Tracker** | Daily check-ins, streak counter |
| **Admin Panel** | Manage users, recipes, food database |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Request reset |
| GET | `/api/users/profile` | Get profile |
| POST | `/api/calculators/bmi` | Calculate BMI |
| CRUD | `/api/diet-plans` | Diet plans |
| CRUD | `/api/recipes` | Recipes |
| CRUD | `/api/nutrition` | Nutrition logs |
| CRUD | `/api/water` | Water logs |
| CRUD | `/api/weight` | Weight logs |
| CRUD | `/api/habits` | Habit tracking |
| Admin | `/api/admin/*` | Admin operations |

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, Recharts
- **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs
- **Database:** MongoDB

## License

MIT
