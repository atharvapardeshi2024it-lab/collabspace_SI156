const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { getNotifications, markAllRead } = require('../controllers/notificationsController');

router.get( '/',     auth, getNotifications);
router.put( '/read', auth, markAllRead);

module.exports = router;
