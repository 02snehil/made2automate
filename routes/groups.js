
//../routes/group.js

const express = require('express');
const { createGroup, joinGroup } = require('../controllers/groupController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/create', auth, createGroup);
router.post('/:groupId/join', auth, joinGroup);

module.exports = router;
