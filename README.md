# 🏋️ FitVerse

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Python](https://img.shields.io/badge/Python-3.12-yellow?logo=python)
![NumPy](https://img.shields.io/badge/NumPy-Scientific%20Computing-013243?logo=numpy)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Machine%20Learning-F7931E?logo=scikitlearn)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?logo=githubactions)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render)
![Version](https://img.shields.io/badge/Version-v1.0.0-success)
![License](https://img.shields.io/badge/License-Proprietary-red)

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_FitVerse-00C853?style=for-the-badge)](https://fitverse-mnki.onrender.com)

> **AI-Powered Full-Stack Fitness Tracking & Wellness Platform**

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

## 🔐 Environment Variables

FitVerse uses environment variables for configuration.
An example configuration file is already included:

```text
backend/.env.example
```

Copy it to create your local environment file:

```bash
cp backend/.env.example backend/.env
```

Then replace the placeholder values in `.env` with your own:
* MongoDB Atlas connection string
* JWT secret
* Any other required credentials

> **Note:** Never commit your actual `.env` file to GitHub. Only commit `.env.example`.

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

## 📄 License

This project is proprietary software.

See the [LICENSE](LICENSE) file for details.

---

# 👨‍💻 Developer

**Riten Vivek**
GitHub: https://github.com/RitenVivek

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
