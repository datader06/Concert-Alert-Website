
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { startCronJobs } = require('./cron/concertAlerts');
const { authMiddleware, errorHandler } = require('./middleware/auth');

// Routes
const authRoutes = require('./routes/authRoutes');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes'); // NEW: Stage 2
const concertRoutes = require('./routes/concertRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes); // NEW: Stage 2
app.use('/api/concerts', concertRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║     🎵 SPOTIFY CLONE BACKEND 🎵         ║
╠══════════════════════════════════════════╣
║ Server running on port: ${PORT.toString().padEnd(23)}║
║ Environment: ${(process.env.NODE_ENV || 'development').padEnd(25)}║
║ Database: SQLite (local)                ║
╚══════════════════════════════════════════╝
  `);

  // Start cron jobs
  startCronJobs();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
