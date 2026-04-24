const pool = require('../config/db');

// ── GET /api/notifications ─────────────────────────────────
const getNotifications = async (req, res, next) => {
  try {
    const [notifications] = await pool.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    );
    const [[{ unread }]] = await pool.query(
      'SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    );
    res.json({ success: true, data: notifications, unread });
  } catch (err) { next(err); }
};

// ── PUT /api/notifications/read ────────────────────────────
const markAllRead = async (req, res, next) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
};

// ── Helper: create notification ────────────────────────────
const createNotification = async (userId, type, title, message) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
      [userId, type, title, message]
    );
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

module.exports = { getNotifications, markAllRead, createNotification };
