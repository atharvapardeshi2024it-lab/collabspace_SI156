const express = require('express');
const router  = express.Router({ mergeParams: true });
const auth    = require('../middleware/auth');
const { getComments, addComment, deleteComment } = require('../controllers/commentsController');

router.get( '/',             getComments);
router.post('/',        auth, addComment);
router.delete('/:commentId', auth, deleteComment);

module.exports = router;
