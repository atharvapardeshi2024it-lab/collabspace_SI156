// controllers/studyGroupsController.js
const pool = require('../config/db');

// ── GET /api/study-groups ─────────────────────────────────
const getGroups = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    const where  = search ? 'WHERE sg.name LIKE ? OR sg.course_code LIKE ?' : '';
    const params = search ? [`%${search}%`, `%${search}%`] : [];

    const [groups] = await pool.query(
      `SELECT sg.*, u.first_name, u.last_name,
              COUNT(DISTINCT sgm.user_id) AS member_count
       FROM study_groups sg
       JOIN users u ON u.id = sg.owner_id
       LEFT JOIN study_group_members sgm ON sgm.group_id = sg.id
       ${where}
       GROUP BY sg.id
       ORDER BY sg.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    res.json({ success: true, data: groups });
  } catch (err) { next(err); }
};

// ── GET /api/study-groups/:id ─────────────────────────────
const getGroup = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT sg.*, u.first_name, u.last_name,
              COUNT(DISTINCT sgm.user_id) AS member_count
       FROM study_groups sg
       JOIN users u ON u.id = sg.owner_id
       LEFT JOIN study_group_members sgm ON sgm.group_id = sg.id
       WHERE sg.id = ? GROUP BY sg.id`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Group not found' });

    const [members] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.department, sgm.role, sgm.joined_at
       FROM study_group_members sgm JOIN users u ON u.id = sgm.user_id
       WHERE sgm.group_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...rows[0], members } });
  } catch (err) { next(err); }
};

// ── POST /api/study-groups ────────────────────────────────
const createGroup = async (req, res, next) => {
  try {
    const { name, course_code, description, tags, icon, meeting_freq, next_session, session_location, max_members } = req.body;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO study_groups
           (name, course_code, description, tags, icon, meeting_freq, next_session, session_location, owner_id, max_members)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, course_code || '', description || '', tags || '', icon || '📚',
         meeting_freq || 'Weekly', next_session || null, session_location || '',
         req.user.id, max_members || 15]
      );

      await conn.query(
        'INSERT INTO study_group_members (group_id, user_id, role) VALUES (?, ?, ?)',
        [result.insertId, req.user.id, 'owner']
      );

      await conn.query('UPDATE users SET points = points + 30 WHERE id = ?', [req.user.id]);
      await conn.commit();

      res.status(201).json({ success: true, message: 'Study group created!', id: result.insertId });
    } catch (e) { await conn.rollback(); throw e; }
    finally     { conn.release(); }
  } catch (err) { next(err); }
};

// ── POST /api/study-groups/:id/join ───────────────────────
const joinGroup = async (req, res, next) => {
  try {
    const [group] = await pool.query(
      `SELECT sg.id, sg.max_members, sg.is_open,
              COUNT(sgm.user_id) AS member_count
       FROM study_groups sg
       LEFT JOIN study_group_members sgm ON sgm.group_id = sg.id
       WHERE sg.id = ? GROUP BY sg.id`,
      [req.params.id]
    );
    if (!group.length) return res.status(404).json({ success: false, message: 'Group not found' });
    if (!group[0].is_open) return res.status(400).json({ success: false, message: 'Group is closed' });
    if (group[0].member_count >= group[0].max_members)
      return res.status(400).json({ success: false, message: 'Group is full' });

    await pool.query(
      'INSERT IGNORE INTO study_group_members (group_id, user_id, role) VALUES (?, ?, ?)',
      [req.params.id, req.user.id, 'member']
    );
    await pool.query('UPDATE users SET points = points + 10 WHERE id = ?', [req.user.id]);

    res.json({ success: true, message: 'Joined study group!' });
  } catch (err) { next(err); }
};

// ── DELETE /api/study-groups/:id/leave ───────────────────
const leaveGroup = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT role FROM study_group_members WHERE group_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(400).json({ success: false, message: 'You are not in this group' });
    if (rows[0].role === 'owner') return res.status(400).json({ success: false, message: 'Owner cannot leave' });

    await pool.query('DELETE FROM study_group_members WHERE group_id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Left study group' });
  } catch (err) { next(err); }
};

// ── DELETE /api/study-groups/:id ─────────────────────────
const deleteGroup = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT owner_id FROM study_groups WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Group not found' });
    if (rows[0].owner_id !== req.user.id) return res.status(403).json({ success: false, message: 'Only owner can delete' });

    await pool.query('DELETE FROM study_groups WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Group deleted' });
  } catch (err) { next(err); }
};

module.exports = { getGroups, getGroup, createGroup, joinGroup, leaveGroup, deleteGroup };
