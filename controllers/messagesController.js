const pool = require('../config/db');

const getConversations = async (req, res, next) => {
  try {
    const [convos] = await pool.query(
      `SELECT DISTINCT 
        IF(m.sender_id = ?, m.receiver_id, m.sender_id) as other_user_id,
        u.first_name, u.last_name, u.avatar_url,
        MAX(m.created_at) as last_message_time,
        SUM(CASE WHEN m.receiver_id = ? AND m.is_read = 0 THEN 1 ELSE 0 END) as unread_count
       FROM messages m
       JOIN users u ON u.id = IF(m.sender_id = ?, m.receiver_id, m.sender_id)
       WHERE m.sender_id = ? OR m.receiver_id = ?
       GROUP BY other_user_id
       ORDER BY last_message_time DESC`,
      [req.user.id, req.user.id, req.user.id, req.user.id, req.user.id]
    );
    res.json({ success: true, data: convos });
  } catch (err) { next(err); }
};

const getMessages = async (req, res, next) => {
  try {
    const [messages] = await pool.query(
      `SELECT m.*, u.first_name, u.last_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE (m.sender_id = ? AND m.receiver_id = ?)
          OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.created_at ASC`,
      [req.user.id, req.params.userId, req.params.userId, req.user.id]
    );
    await pool.query(
      'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?',
      [req.params.userId, req.user.id]
    );
    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
};

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });
    await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [req.user.id, req.params.userId, message]
    );
    const { createNotification } = require("./notificationsController");
    await createNotification(req.params.userId, "message", "New Message", req.user.first_name + " sent you a message");
    res.json({ success: true, message: "Message sent!" });
  } catch (err) { next(err); }
};

const getUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, department, year, avatar_url FROM users WHERE id != ? LIMIT 20',
      [req.user.id]
    );
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

module.exports = { getConversations, getMessages, sendMessage, getUsers };
