// routes/projects.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/projectsController');

router.get( '/',          ctrl.getProjects);
router.get( '/:id',       ctrl.getProject);
router.post('/',          auth, ctrl.createProject);
router.put( '/:id',       auth, ctrl.updateProject);
router.delete('/:id',     auth, ctrl.deleteProject);
router.post('/:id/join',  auth, ctrl.joinProject);
router.delete('/:id/leave', auth, ctrl.leaveProject);

module.exports = router;
