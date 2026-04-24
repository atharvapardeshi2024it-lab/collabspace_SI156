const pool = require('../config/db');

const getLeaderboard = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.department, u.year, 
              u.points, u.level, u.avatar_url,
              COUNT(DISTINCT pm.project_id) as project_count,
              COUNT(DISTINCT sgm.group_id) as group_count,
              COUNT(DISTINCT r.id) as resource_count
       FROM users u
       LEFT JOIN project_members pm ON pm.user_id = u.id
       LEFT JOIN study_group_members sgm ON sgm.user_id = u.id
       LEFT JOIN resources r ON r.uploader_id = u.id
       GROUP BY u.id
       ORDER BY u.points DESC
       LIMIT 10`
    );
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

module.exports = { getLeaderboard };
