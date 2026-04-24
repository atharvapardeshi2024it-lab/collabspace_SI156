const pool = require('../config/db');

const getComments = async (req, res, next) => {
  try {
    const [comments] = await pool.query(
      `SELECT c.*, u.first_name, u.last_name, u.avatar_url
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.project_id = ?
       ORDER BY c.created_at DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: comments });
  } catch (err) { next(err); }
};

const addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ success: false, message: 'Comment is required' });
    await pool.query(
      'INSERT INTO comments (project_id, user_id, comment) VALUES (?, ?, ?)',
      [req.params.id, req.user.id, comment]
    );
    await pool.query('UPDATE users SET points = points + 5 WHERE id = ?', [req.user.id]);
    res.json({ success: true, message: 'Comment added!' });
  } catch (err) { next(err); }
};

const deleteComment = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM comments WHERE id = ? AND user_id = ?', [req.params.commentId, req.user.id]);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) { next(err); }
};

module.exports = { getComments, addComment, deleteComment };
