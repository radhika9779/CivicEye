require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB, sequelize } = require('./models');
const { initSocket } = require('./config/socket');

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

// Attach Socket.io to the same HTTP server
initSocket(httpServer);

async function start() {
  try {
    await connectDB();

    // Sync models (creates tables if they don't exist).
    // For a 48-hour hackathon this replaces formal migrations.
    await sequelize.sync();
    console.log('✅ Database models synced.');

    httpServer.listen(PORT, () => {
      console.log(`🚀 CivicEye server running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.io ready for real-time connections`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
