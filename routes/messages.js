const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { getConversations, getMessages, sendMessage, getUsers } = require('../controllers/messagesController');

router.get( '/',          auth, getConversations);
router.get( '/users',     auth, getUsers);
router.get( '/:userId',   auth, getMessages);
router.post('/:userId',   auth, sendMessage);

module.exports = router;
