// routes/studyGroups.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/studyGroupsController');

router.get( '/',            ctrl.getGroups);
router.get( '/:id',         ctrl.getGroup);
router.post('/',            auth, ctrl.createGroup);
router.delete('/:id',       auth, ctrl.deleteGroup);
router.post('/:id/join',    auth, ctrl.joinGroup);
router.delete('/:id/leave', auth, ctrl.leaveGroup);

module.exports = router;
