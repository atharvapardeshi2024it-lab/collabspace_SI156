require('dotenv').config();
const rateLimit = require('express-rate-limit');
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const studyGroupRoutes = require('./routes/studyGroups');
const resourcesRoutes = require('./routes/resources');
const leaderboardRoutes = require('./routes/leaderboard');
const commentsRoutes = require('./routes/comments');
const messagesRoutes = require('./routes/messages');
const academicsRoutes = require('./routes/academics');
const notificationsRoutes = require('./routes/notifications');
const { errorHandler } = require('./middleware/errorHandler');

require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// CRITICAL FOR RAILWAY: Bind to 0.0.0.0 and use process.env.PORT
const PORT = process.env.PORT || 5000;

app.use(cors());

// Rate limiting
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, message: { success: false, message: "Too many requests" } });
app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Checks
app.get('/api/db-status', async (req, res) => {
  try {
    const pool = require('./config/db');
    await pool.query('SELECT 1');
    res.json({ success: true, status: 'connected' });
  } catch (err) {
    res.json({ success: false, status: 'disconnected', message: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🟢 CollabSpace API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/projects/:id/comments', commentsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/academics', academicsRoutes);

// Error Handling
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorHandler);

// CRITICAL CHANGE: Added '0.0.0.0' for Cloud Deployment
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});