// controllers/resourcesController.js
const pool  = require('../config/db');
const path  = require('path');
const multer = require('multer');
const fs    = require('fs');

// ── Multer storage config ─────────────────────────────────
const uploadsDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `${Date.now()}-${req.user.id}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.png', '.jpg', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext) ? cb(null, true) : cb(new Error('File type not allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
});

// Export multer middleware so routes can use it
const uploadMiddleware = upload.single('file');

// ── GET /api/resources ────────────────────────────────────
const getResources = async (req, res, next) => {
  try {
    const { type, course_code, search, page = 1, limit = 20 } = req.query;
    const offset     = (page - 1) * limit;
    const conditions = [];
    const params     = [];

    if (type)        { conditions.push('r.type = ?');             params.push(type); }
    if (course_code) { conditions.push('r.course_code = ?');      params.push(course_code); }
    if (search)      { conditions.push('r.title LIKE ?');         params.push(`%${search}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [resources] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM resources r
       JOIN users u ON u.id = r.uploader_id
       ${where}
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    res.json({ success: true, data: resources });
  } catch (err) { next(err); }
};

// ── POST /api/resources ───────────────────────────────────
const createResource = async (req, res, next) => {
  try {
    const { title, type, course_code, description, external_url } = req.body;
    const file_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!file_url && !external_url) {
      return res.status(400).json({ success: false, message: 'Provide a file upload or an external URL' });
    }

    const [result] = await pool.query(
      `INSERT INTO resources (title, type, course_code, description, file_url, external_url, uploader_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, type, course_code || '', description || '', file_url, external_url || null, req.user.id]
    );

    // Award points for sharing a resource
    await pool.query('UPDATE users SET points = points + 20 WHERE id = ?', [req.user.id]);

    res.status(201).json({ success: true, message: 'Resource uploaded!', id: result.insertId });
  } catch (err) { next(err); }
};

// ── POST /api/resources/:id/download ─────────────────────
const trackDownload = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Resource not found' });

    await pool.query('UPDATE resources SET downloads = downloads + 1 WHERE id = ?', [req.params.id]);

    const resource = rows[0];
    if (resource.file_url) {
      return res.json({ success: true, url: resource.file_url });
    }
    res.json({ success: true, url: resource.external_url });
  } catch (err) { next(err); }
};

// ── DELETE /api/resources/:id ─────────────────────────────
const deleteResource = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Resource not found' });
    if (rows[0].uploader_id !== req.user.id)
      return res.status(403).json({ success: false, message: 'You can only delete your own resources' });

    // Delete file from disk if it exists
    if (rows[0].file_url) {
      const filePath = `.${rows[0].file_url}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool.query('DELETE FROM resources WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Resource deleted' });
  } catch (err) { next(err); }
};

module.exports = { getResources, createResource, trackDownload, deleteResource, uploadMiddleware };

// ── Avatar upload config ───────────────────────────────────
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const avatarDir = './uploads/avatars';
    if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${Date.now()}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Only images allowed'));
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

const avatarMiddleware = avatarUpload.single('avatar');

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const sharp = require('sharp');
    const outputPath = `./uploads/avatars/avatar-${req.user.id}.jpg`;

    // Resize to 200x200
    await sharp(req.file.path)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    // Delete original
    fs.unlinkSync(req.file.path);

    const avatarUrl = `/uploads/avatars/avatar-${req.user.id}.jpg`;

    // Update user in DB
    const pool = require('../config/db');
    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id]);

    res.json({ success: true, avatar_url: avatarUrl, message: 'Avatar updated!' });
  } catch (err) {
    next(err);
  }
};

module.exports.avatarMiddleware = avatarMiddleware;
module.exports.uploadAvatar = uploadAvatar;
