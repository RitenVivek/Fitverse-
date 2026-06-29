# 🏋️ FitVerse

> **AI-Powered Full-Stack Fitness Tracking & Wellness Platform**

FitVerse is a production-ready full-stack fitness tracking application built using the MERN Stack with Dockerized deployment, MongoDB Atlas, GitHub Actions CI/CD, and Python-based Machine Learning support.

---

## 🌐 Live Demo

**Live Application**

https://fitverse-mnki.onrender.com

> **Note**
>
> This application is deployed on Render's Free Tier.
>
> The first request after inactivity may take **30–60 seconds** while the server wakes up.

---

# 📖 Overview

FitVerse helps users manage and improve their fitness journey through an intuitive web application.

Users can:

* Create an account securely
* Track workouts
* Manage diet plans
* Monitor fitness progress
* View personalized dashboards
* Use an ML-ready backend for future intelligent recommendations

The application follows modern backend architecture and production deployment practices.

---

# ✨ Features

### Authentication

* JWT Authentication
* Secure Password Hashing
* Protected Routes

### Fitness

* Workout Tracking
* Diet Management
* Progress Tracking
* User Dashboard

### Backend

* REST API
* MongoDB Atlas
* Mongoose ODM
* Helmet Security
* Rate Limiting
* CORS Protection

### Machine Learning

* Python Integration
* NumPy
* Scikit-learn
* ML Module Ready

### DevOps

* Docker
* GitHub Actions
* Render Deployment
* Production Environment Variables

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* React Router
* Chart.js

## Backend

* Node.js
* Express.js
* JWT
* Helmet
* Morgan
* Express Validator

## Database

* MongoDB Atlas
* Mongoose

## Machine Learning

* Python
* NumPy
* Scikit-learn

## DevOps

* Docker
* GitHub Actions
* Render

---

# 🏗 Architecture

```
                React + Vite
                     │
                     ▼
             Express REST API
                     │
     ┌───────────────┼────────────────┐
     │               │                │
     ▼               ▼                ▼
Authentication   MongoDB Atlas   Python ML
     │
     ▼
 User Dashboard
```

---

# 📁 Project Structure

```
FitVerse
│
├── backend
│   ├── config
│   ├── middleware
│   ├── ml
│   ├── models
│   ├── routes
│   ├── tests
│   └── server.js
│
├── frontend
│   ├── src
│   ├── public
│   ├── dist
│   └── vite.config.js
│
├── .github
│   └── workflows
│
├── Dockerfile
├── .dockerignore
├── README.md
└── .gitignore
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/RitenVivek/Fitverse-.git

cd Fitverse-
```

---

## Install Backend

```bash
cd backend

npm install
```

---

## Install Frontend

```bash
cd ../frontend

npm install
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d
```

---

# 🐳 Docker

Build

```bash
docker build -t fitverse .
```

Run

```bash
docker run -p 10000:10000 fitverse
```

---

# ⚙ CI/CD

GitHub Actions automatically:

* Installs dependencies
* Runs Backend Tests
* Runs Frontend Tests
* Validates every push
* Helps maintain deployment stability

---

# 🔒 Security

* Helmet
* Rate Limiting
* JWT Authentication
* Password Hashing
* Protected API Routes
* Environment Variables

---

# 🚀 Deployment

**Platform**

Render

**Database**

MongoDB Atlas

**Containerization**

Docker

---

# 🛣 Roadmap

* AI Workout Recommendation Engine
* AI Diet Recommendation System
* Wearable Device Integration
* Smart Calorie Prediction
* Mobile Application
* Push Notifications
* Exercise Recommendation Engine
* Advanced Analytics Dashboard

---

# 📌 Current Status

**Version**

v1.0.0

**Status**

✅ Production Ready

---

# 👨‍💻 Developer

**Riten Vivek**

GitHub

https://github.com/RitenVivek

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
