require('dotenv').config();

const express = require('express');
const cors = require('cors');

const prisma = require('./config/prisma');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const referralRoutes = require('./routes/referralRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const taskRoutes = require('./routes/taskRoutes');

const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',')
      : '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: 'VELOOP backend is running',
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Backend is running but database is unavailable',
      database: 'disconnected',
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/tasks', taskRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use(errorMiddleware);

async function startServer() {
  try {
    await prisma.$connect();

    console.log('PostgreSQL connected successfully');

    app.listen(PORT, () => {
      console.log(`VELOOP backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

async function shutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);