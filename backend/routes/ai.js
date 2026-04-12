const express = require('express');
const { chat } = require('../controllers/aiController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 需要认证
router.use(authenticate);

// AI 聊天
router.post('/chat', chat);

module.exports = router;
