# ⚡ FitVerse — AI-Powered Fitness Tracking Platform

A full-stack MERN (MongoDB, Express, React, Node.js) fitness tracking web application with **real ML-powered insights** using Python + scikit-learn.

![FitVerse](https://img.shields.io/badge/FitVerse-AI%20Fitness-00d4ff?style=for-the-badge)
![MERN](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![ML](https://img.shields.io/badge/ML-scikit--learn-orange?style=for-the-badge)

---

## 🚀 Features

### Core Modules
- **JWT Authentication** — Secure signup/login/logout with bcrypt password hashing
- **Dashboard** — Real-time tracking of calories, weight, steps, water intake, sleep, mood
- **Diet Planner** — Full CRUD + AI-generated meal plans based on user goals
- **Workout Logger** — Log exercises with categories, sets, reps, duration
- **Progress Analytics** — Interactive Chart.js charts for all metrics
- **User Profile** — BMI/BMR/TDEE calculations, goal management

### 🤖 AI / ML Features (Python + scikit-learn)
- **Weight Prediction** — Linear Regression model predicting future weight based on historical data
- **Calorie Recommendation** — ML-trained model for personalized calorie & macro targets
- **AI Fitness Insights** — Dynamic insights like:
  - "You may reach target weight in 30 days"
  - "Consistency dropped this week"
  - "Great deficit! On track for weight loss"
  - Hydration and step analysis

### UI/UX
- Futuristic dark glassmorphism design
- Ambient animated background orbs
- Responsive sidebar navigation
- Modal forms with validation
- Toast notifications
- Google Fonts (Inter + JetBrains Mono)

---

## 📁 Project Structure

```
Fitverse-/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               # JWT auth middleware
│   │   ├── validate.js           # Express-validator middleware
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema + BMI/BMR/TDEE methods
│   │   ├── DailyLog.js           # Daily fitness log schema
│   │   ├── DietPlan.js           # Diet plan + meal items schema
│   │   ├── Workout.js            # Workout + exercises schema
│   │   └── WeightEntry.js        # Weight history schema
│   ├── routes/
│   │   ├── auth.js               # POST /signup, /login, GET /me
│   │   ├── user.js               # PUT /profile, GET /metrics
│   │   ├── dashboard.js          # Daily log CRUD, history, summary
│   │   ├── diet.js               # Diet CRUD + AI generation
│   │   ├── workouts.js           # Workout CRUD
│   │   ├── progress.js           # Weight tracking + chart data
│   │   └── ml.js                 # ML predictions + insights
│   ├── ml/
│   │   ├── weight_predictor.py   # scikit-learn Linear Regression
│   │   ├── calorie_recommender.py # ML calorie recommendation
│   │   └── requirements.txt      # Python dependencies
│   ├── server.js                 # Express entry point
│   ├── package.json
│   ├── .env                      # Environment variables
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── DashboardLayout.jsx  # Sidebar + layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx         # Login / Signup
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── DietPlanner.jsx      # Diet management
│   │   │   ├── Workouts.jsx         # Workout logger
│   │   │   ├── Progress.jsx         # Charts & analytics
│   │   │   ├── AIInsights.jsx       # ML insights panel
│   │   │   └── Profile.jsx          # User profile
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.jsx                  # Router + providers
│   │   ├── main.jsx                 # React entry
│   │   └── index.css                # Design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (or a MongoDB Atlas URI)
- **Python 3.8+** with pip (for ML features)

### 1. Clone & Navigate
```bash
git clone <repo-url>
cd Fitverse-
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure Environment
Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitverse
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Python ML Setup (Optional but recommended)
```bash
cd backend/ml
pip install -r requirements.txt
```

> **Note:** If Python/scikit-learn is not available, the app automatically falls back to JavaScript-based calculations. Everything still works!

### 5. Frontend Setup
```bash
cd frontend
npm install
```

### 6. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Open in Browser
Navigate to `http://localhost:3000`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/metrics` | Get BMI/BMR/TDEE |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/dashboard/log` | Create/update daily log |
| GET | `/api/dashboard/today` | Get today's log |
| GET | `/api/dashboard/history?days=30` | Get log history |
| GET | `/api/dashboard/summary` | Weekly/monthly stats |

### Diet Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/diet` | List all plans |
| POST | `/api/diet` | Create plan |
| GET | `/api/diet/active` | Get active plan |
| POST | `/api/diet/generate` | AI-generate plan |
| PUT | `/api/diet/:id` | Update plan |
| DELETE | `/api/diet/:id` | Delete plan |
| POST | `/api/diet/:id/meal` | Add meal item |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | List workouts |
| POST | `/api/workouts` | Log workout |
| DELETE | `/api/workouts/:id` | Delete workout |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/progress/weight` | Log weight |
| GET | `/api/progress/weight?days=90` | Weight history |
| GET | `/api/progress/charts?days=30` | Chart data |

### ML / AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ml/predict-weight` | Weight prediction (Linear Regression) |
| GET | `/api/ml/insights` | AI fitness insights |
| GET | `/api/ml/calorie-recommendation` | Calorie & macro recommendation |

---

## 🧠 ML Architecture

### Weight Prediction
- **Algorithm:** scikit-learn `LinearRegression`
- **Input:** Historical weight entries (date, weight)
- **Output:** 90-day weekly weight predictions, trend, R² confidence, days-to-target
- **Fallback:** JavaScript linear interpolation if Python unavailable

### Calorie Recommendation
- **Algorithm:** scikit-learn `LinearRegression` trained on nutritional science data
- **Input:** Age, height, weight, gender, activity level, goal
- **Output:** BMR, TDEE, recommended calories, macro split (protein/carbs/fats)
- **Fallback:** Mifflin-St Jeor equation in JavaScript

### Fitness Insights Engine
- Analyzes weekly logging consistency
- Compares calorie intake vs TDEE
- Tracks weight trends toward target
- Monitors hydration and activity levels

---

## 🛡️ Security
- Passwords hashed with **bcrypt** (12 rounds)
- JWT tokens with configurable expiration
- Express-validator input validation
- Auth middleware on all protected routes
- CORS configured
- MongoDB injection prevention via Mongoose

---

## 📄 License
MIT