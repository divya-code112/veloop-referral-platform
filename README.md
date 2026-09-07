🚀 VELoop Referral Platform

A modern full-stack referral and gamification platform built with React, Node.js, Express.js, PostgreSQL, and Prisma.

The platform allows users to register, authenticate, generate referral links, track referrals, complete gamified tasks, earn XP, increase their level, maintain streaks, and unlock rewards.

✨ Features
🔐 Authentication & User Management
User Registration
Secure Login Authentication
JWT-based Authorization
Password Security
Protected Routes
User Profile Management
🔗 Referral System
Unique Referral Code Generation
Personalized Referral Links
Referral Tracking
Referral Progress Monitoring
Copy Referral Code and Link
Social Media Sharing Options
🎮 Gamification System
Complete Tasks and Earn XP
User Level System
XP Progress Tracking
Task Difficulty Levels
Daily Check-in Tasks
Current Streak Tracking
Longest Streak Tracking
Completed Task Tracking
🏆 Rewards System
Referral Milestones
Reward Progress Tracking
Locked and Unlocked Rewards
Reward Timeline
Referral Statistics
🎨 Modern User Interface
Premium Dark-Themed UI
Responsive Design
Smooth Animations using Framer Motion
Interactive Task Cards
Gamification Dashboard
Mobile-Friendly Layout
Modern Glassmorphism Effects
🛠️ Tech Stack
Frontend
React.js
Vite
React Router DOM
Axios
Framer Motion
Lucide React
CSS Modules
Backend
Node.js
Express.js
PostgreSQL
Prisma ORM
JWT Authentication
bcryptjs
📁 Project Structure
veloop-referral-platform/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── FAQ/
│   │   │   ├── Footer/
│   │   │   ├── Header/
│   │   │   ├── Hero/
│   │   │   ├── ReferralCard/
│   │   │   ├── ReferralProgress/
│   │   │   ├── ReferralRules/
│   │   │   ├── RewardsSection/
│   │   │   ├── RewardTimeline/
│   │   │   ├── ShareButtons/
│   │   │   ├── StatsSection/
│   │   │   └── tasks/
│   │   │
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ReferralPage.jsx
│   │   │   └── TasksPage.jsx
│   │   │
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
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
│   ├── prisma.config.js
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
⚙️ Installation and Setup
1. Clone the Repository
git clone https://github.com/divya-code112/veloop-referral-platform.git

Navigate to the project:

cd veloop-referral-platform
💻 Frontend Setup

Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will run on:

http://localhost:5173
⚙️ Backend Setup

Open another terminal and navigate to the backend folder:

cd backend

Install dependencies:

npm install

Create a .env file based on .env.example.

Example:

DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_secret_key"
PORT=5000
🗄️ Database Setup

Generate the Prisma Client:

npx prisma generate

Run database migrations:

npx prisma migrate dev

Start the backend server:

npm run dev

The backend API will run on:

http://localhost:5000
🔌 API Configuration

The frontend communicates with the backend using Axios.

Example API base URL:

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

JWT tokens are automatically attached to authenticated API requests.

📡 API Modules

The backend includes the following API modules:

Module	Description
Authentication	User registration and login
Users	User profile management
Referrals	Referral code and referral tracking
Tasks	Gamified tasks and task completion
Rewards	Reward and milestone management
🎮 Gamification Flow
User Registration
       │
       ▼
Complete Activities
       │
       ▼
Earn XP
       │
       ▼
Increase Level
       │
       ▼
Maintain Daily Streak
       │
       ▼
Track Referral Progress
       │
       ▼
Unlock Rewards
🔐 Environment Variables

Create a .env file inside the backend directory.

DATABASE_URL=
JWT_SECRET=
PORT=5000

⚠️ Never commit your actual .env file to GitHub.

📱 Responsive Design

The platform is optimized for:

Desktop
Laptop
Tablet
Mobile Devices
🚀 Deployment

The project can be deployed using:

Frontend
Vercel
Backend
Render
Railway
Other Node.js hosting platforms
Database
PostgreSQL Cloud Database
🔮 Future Improvements
Email Verification
Password Reset
Admin Dashboard
Referral Analytics
Leaderboard System
Notification System
Additional Gamification Features
Reward Redemption System
Production Database Deployment
👩‍💻 Author

Divya Lawand

Full Stack Developer

GitHub: divya-code112
📄 License

This project is created for educational and portfolio purposes.
