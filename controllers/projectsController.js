// controllers/projectsController.js
const pool = require('../config/db');

// ── GET /api/projects ─────────────────────────────────────
// Query params: ?category=&status=&search=&page=&limit=
const getProjects = async (req, res, next) => {
  try {
    const { category, status, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params     = [];

    if (category) { conditions.push('p.category = ?');       params.push(category); }
    if (status)   { conditions.push('p.status = ?');         params.push(status);   }
    if (search)   { conditions.push('p.title LIKE ?');       params.push(`%${search}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [projects] = await pool.query(
      `SELECT p.*,
              u.first_name, u.last_name,
              COUNT(DISTINCT pm.user_id) AS member_count
       FROM projects p
       JOIN users u ON u.id = p.owner_id
       LEFT JOIN project_members pm ON pm.project_id = p.id
       ${where}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM projects p ${where}`, params
    );

    res.json({ success: true, data: projects, total, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
};

// ── GET /api/projects/:id ─────────────────────────────────
const getProject = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.first_name, u.last_name,
              COUNT(DISTINCT pm.user_id) AS member_count
       FROM projects p
       JOIN users u ON u.id = p.owner_id
       LEFT JOIN project_members pm ON pm.project_id = p.id
       WHERE p.id = ?
       GROUP BY p.id`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Project not found' });

    // Fetch members
    const [members] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.department, u.year, pm.role, pm.joined_at
       FROM project_members pm JOIN users u ON u.id = pm.user_id
       WHERE pm.project_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...rows[0], members } });
  } catch (err) { next(err); }
};

// ── POST /api/projects ────────────────────────────────────
const createProject = async (req, res, next) => {
  try {
    const { title, description, category, tags, icon, status, max_members } = req.body;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO projects (title, description, category, tags, icon, status, owner_id, max_members)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, category, tags || '', icon || '💻', status || 'Planning', req.user.id, max_members || 10]
      );

      // Auto-add owner as member
      await conn.query(
        'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
        [result.insertId, req.user.id, 'owner']
      );

      // Award points for creating a project
      await conn.query('UPDATE users SET points = points + 50 WHERE id = ?', [req.user.id]);

      await conn.commit();
      res.status(201).json({ success: true, message: 'Project created!', id: result.insertId });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (err) { next(err); }
};

// ── PUT /api/projects/:id ─────────────────────────────────
const updateProject = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT owner_id FROM projects WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Project not found' });
    if (rows[0].owner_id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Only the owner can edit this project' });

    const { title, description, category, tags, icon, status, max_members, is_open } = req.body;
    await pool.query(
      `UPDATE projects SET title=?, description=?, category=?, tags=?, icon=?, status=?, max_members=?, is_open=?
       WHERE id = ?`,
      [title, description, category, tags, icon, status, max_members, is_open, req.params.id]
    );
    res.json({ success: true, message: 'Project updated' });
  } catch (err) { next(err); }
};

// ── DELETE /api/projects/:id ──────────────────────────────
const deleteProject = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT owner_id FROM projects WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Project not found' });
    if (rows[0].owner_id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Only the owner can delete this project' });

    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
};

// ── POST /api/projects/:id/join ───────────────────────────
const joinProject = async (req, res, next) => {
  try {
    const [project] = await pool.query(
      `SELECT p.id, p.max_members, p.is_open,
              COUNT(pm.user_id) AS member_count
       FROM projects p
       LEFT JOIN project_members pm ON pm.project_id = p.id
       WHERE p.id = ?
       GROUP BY p.id`,
      [req.params.id]
    );
    if (!project.length) return res.status(404).json({ success: false, message: 'Project not found' });

    const proj = project[0];
    if (!proj.is_open) return res.status(400).json({ success: false, message: 'Project is closed for new members' });
    if (proj.member_count >= proj.max_members)
      return res.status(400).json({ success: false, message: 'Project is full' });

    await pool.query(
      'INSERT IGNORE INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
      [req.params.id, req.user.id, 'member']
    );
    // Award 10 points for joining
    // Send notification to project owner
    const { createNotification } = require("../controllers/notificationsController");
    const [[ownerData]] = await pool.query("SELECT owner_id, title FROM projects WHERE id = ?", [req.params.id]);
    if (ownerData) {
      await createNotification(ownerData.owner_id, "join", "👥 New member!", `${req.user.first_name} ${req.user.last_name} joined your project: ${ownerData.title}`);
    }
    await pool.query('UPDATE users SET points = points + 10 WHERE id = ?', [req.user.id]);

    res.json({ success: true, message: 'Joined project successfully!' });
  } catch (err) { next(err); }
};

// ── DELETE /api/projects/:id/leave ────────────────────────
const leaveProject = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(400).json({ success: false, message: 'You are not in this project' });
    if (rows[0].role === 'owner') return res.status(400).json({ success: false, message: 'Owner cannot leave. Delete the project instead.' });

    await pool.query('DELETE FROM project_members WHERE project_id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Left project' });
  } catch (err) { next(err); }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, joinProject, leaveProject };
