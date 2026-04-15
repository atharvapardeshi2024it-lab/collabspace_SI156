require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const http     = require('http');
const { Server } = require('socket.io');

const authRoutes        = require('./routes/auth');
const projectsRoutes    = require('./routes/projects');
const studyGroupRoutes  = require('./routes/studyGroups');
const resourcesRoutes   = require('./routes/resources');
const notificationsRoutes = require('./routes/notifications');
const academicsRoutes   = require('./routes/academics');
const { errorHandler }  = require('./middleware/errorHandler');

require('./config/db');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 5000;

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- STATIC FILES (IMPORTANT) ---------------- */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, "public")));

// ✅ ROOT ROUTE (THIS FIXES YOUR ERROR)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ---------------- API ROUTES ---------------- */
app.get('/api/stats', async (req, res) => {
  try {
    const pool = require('./config/db');
    const [[users]]   = await pool.query('SELECT COUNT(*) as count FROM users');
    const [[projects]] = await pool.query('SELECT COUNT(*) as count FROM projects');
    const [[groups]]  = await pool.query('SELECT COUNT(*) as count FROM study_groups');
    const [[resources]] = await pool.query('SELECT COUNT(*) as count FROM resources');

    res.json({
      success: true,
      users: users.count,
      projects: projects.count,
      groups: groups.count,
      resources: resources.count
    });
  } catch (err) {
    res.json({ success: false });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🟢 CollabSpace API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth',         authRoutes);
app.use('/api/projects',     projectsRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/resources',    resourcesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/academics',    academicsRoutes);

/* ---------------- SOCKET.IO ---------------- */
const onlineUsers = {};

function getStudyBotReply(msg) {
  const m = msg.toLowerCase();

  if (m.includes("hello") || m.includes("hi"))
    return "👋 Hello! How can I help you today?";
  if (m.includes("project"))
    return "💻 Check the Projects page for active projects you can join!";
  if (m.includes("study") || m.includes("group"))
    return "📚 Visit Study Groups page to find or create study groups!";
  if (m.includes("resource") || m.includes("notes"))
    return "📄 Check Resources page for notes, videos and previous papers!";
  if (m.includes("exam") || m.includes("test"))
    return "🎯 Good luck with your exam!";
  if (m.includes("help"))
    return "🤖 I can help with: projects, study groups, resources!";

  return "🤔 Try asking about projects or study groups!";
}

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join_room', ({ room, username }) => {
    socket.join(room);
    onlineUsers[socket.id] = { username, room };

    io.to(room).emit('user_joined', {
      username,
      message: `${username} joined the chat`,
      time: new Date().toISOString()
    });

    const roomUsers = Object.values(onlineUsers)
      .filter(u => u.room === room)
      .map(u => u.username);

    io.to(room).emit('online_users', roomUsers);
  });

  socket.on('send_message', ({ room, username, message }) => {
    io.to(room).emit('receive_message', {
      username,
      message,
      time: new Date().toISOString()
    });

    setTimeout(() => {
      io.to(room).emit('receive_message', {
        username: '🤖 StudyBot',
        message: getStudyBotReply(message),
        time: new Date().toISOString()
      });
    }, 1000);
  });

  socket.on('disconnect', () => {
    const user = onlineUsers[socket.id];

    if (user) {
      const { username, room } = user;
      delete onlineUsers[socket.id];

      io.to(room).emit('user_left', {
        username,
        message: `${username} left the chat`,
        time: new Date().toISOString()
      });

      const roomUsers = Object.values(onlineUsers)
        .filter(u => u.room === room)
        .map(u => u.username);

      io.to(room).emit('online_users', roomUsers);
    }
  });
});

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

/* ---------------- ERROR HANDLER ---------------- */
app.use(errorHandler);

/* ---------------- START SERVER ---------------- */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});