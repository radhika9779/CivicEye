const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const issuesRoutes = require('./routes/issues.routes');
const adminRoutes = require('./routes/admin.routes');
const safetyRoutes = require('./routes/safety.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

// ---- Global middleware ----
app.use(
  helmet({
    crossOriginResourcePolicy: false, // allow uploaded photos to be loaded cross-origin by the client
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded photos statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---- Health check ----
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CivicEye API is running', timestamp: new Date().toISOString() });
});

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/users', usersRoutes);

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ---- Global error handler ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err.message && err.message.includes('Only JPEG')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
