const { Server } = require('socket.io');

let io = null;

/**
 * Initialize Socket.io on top of the HTTP server.
 * Sets up connection handling and exposes a singleton `io` instance
 * so controllers elsewhere in the app can emit events via getIO().
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Clients can identify themselves as admin to join the admin room,
    // which is where SOS alerts and issue updates are broadcast for dashboards.
    socket.on('join_admin', () => {
      socket.join('admin_room');
      console.log(`🛡️  Socket ${socket.id} joined admin_room`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Returns the active Socket.io instance so controllers/services
 * can emit events without circular-importing server.js.
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket(httpServer) first.');
  }
  return io;
}

module.exports = { initSocket, getIO };
