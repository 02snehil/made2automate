const express = require('express');
const { getMessages } = require('../controllers/messageController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/:groupId', auth, getMessages);

module.exports = router;
