# VELoop – Referral & Gamification Platform

A modern full-stack referral and gamification platform designed to create an engaging user experience through referrals, rewards, tasks, XP, levels, and streak tracking.

The project combines a premium fintech-inspired frontend with a powerful backend system for authentication, referral management, task completion, and user progress tracking.

---

## Features

### Authentication

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- User Profile Management

### Referral System

- Unique Referral Code
- Referral Link Generation
- One-Click Copy Functionality
- Social Media Sharing
- Referral Progress Tracking
- Referral Statistics
- Reward Milestones

### Gamification System

- Task-Based Activities
- XP Rewards
- User Levels
- Daily Check-In
- Current Streak Tracking
- Longest Streak Tracking
- Task Difficulty Levels
- Task Completion Tracking

### User Interface

- Modern Fintech-Inspired Design
- Responsive Layout
- Dark Premium UI
- Smooth Animations
- Framer Motion Animations
- Interactive Reward Cards
- Referral Progress Visualization
- FAQ Section
- Mobile-Friendly Design

---

# Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- CSS Modules
- Framer Motion
- Lucide React
- Bootstrap 5

## Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcryptjs

---

# Project Structure

```text
veloop-referral-platform/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── tasks/
│   │   │   ├── Header/
│   │   │   ├── Hero/
│   │   │   ├── ReferralCard/
│   │   │   ├── RewardsSection/
│   │   │   └── ...
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ReferralPage.jsx
│   │   │   └── TasksPage.jsx
│   │   ├── styles/
│   │   └── utils/
│   │       └── api.js
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── server.js
│   ├── package.json
│   └── prisma.config.js
│
└── README.md

Author 
Divya Lawand