const pool = require('../config/db');

const getAcademics = async (req, res, next) => {
  try {
    const [courses] = await pool.query(
      `SELECT c.*, uc.grade
       FROM courses c
       JOIN user_courses uc ON uc.course_id = c.id
       WHERE uc.user_id = ?`,
      [req.user.id]
    );

    const [assignments] = await pool.query(
      `SELECT a.*, c.code, c.name as course_name
       FROM assignments a
       JOIN courses c ON c.id = a.course_id
       WHERE a.user_id = ?
       ORDER BY a.due_date ASC`,
      [req.user.id]
    );

    const [peers] = await pool.query(
      `SELECT DISTINCT u.id, u.first_name, u.last_name, u.department, u.year,
              COUNT(DISTINCT uc2.course_id) as common_courses
       FROM user_courses uc1
       JOIN user_courses uc2 ON uc2.course_id = uc1.course_id AND uc2.user_id != uc1.user_id
       JOIN users u ON u.id = uc2.user_id
       WHERE uc1.user_id = ?
       GROUP BY u.id
       ORDER BY common_courses DESC
       LIMIT 5`,
      [req.user.id]
    );

    res.json({ success: true, data: { courses, assignments, peers } });
  } catch (err) { next(err); }
};

const addAssignment = async (req, res, next) => {
  try {
    const { course_id, title, due_date } = req.body;
    await pool.query(
      'INSERT INTO assignments (user_id, course_id, title, due_date) VALUES (?, ?, ?, ?)',
      [req.user.id, course_id, title, due_date]
    );
    res.json({ success: true, message: 'Assignment added!' });
  } catch (err) { next(err); }
};

const updateAssignment = async (req, res, next) => {
  try {
    const { status, grade } = req.body;
    await pool.query(
      'UPDATE assignments SET status = ?, grade = ? WHERE id = ? AND user_id = ?',
      [status, grade, req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Assignment updated!' });
  } catch (err) { next(err); }
};

module.exports = { getAcademics, addAssignment, updateAssignment };
