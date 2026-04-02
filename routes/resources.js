// routes/resources.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { uploadMiddleware, getResources, createResource, trackDownload, deleteResource }
  = require('../controllers/resourcesController');

router.get( '/',             getResources);
router.post('/',             auth, uploadMiddleware, createResource);
router.post('/:id/download', auth, trackDownload);
router.delete('/:id',        auth, deleteResource);

module.exports = router;

const { avatarMiddleware, uploadAvatar } = require('../controllers/resourcesController');
router.post('/avatar', auth, avatarMiddleware, uploadAvatar);
