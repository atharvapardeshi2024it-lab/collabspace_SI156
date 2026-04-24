const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { getAcademics, addAssignment, updateAssignment } = require('../controllers/academicsController');

router.get( '/',               auth, getAcademics);
router.post('/assignment',     auth, addAssignment);
router.put( '/assignment/:id', auth, updateAssignment);

module.exports = router;
