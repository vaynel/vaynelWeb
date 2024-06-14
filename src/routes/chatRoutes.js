const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/', chatController.getIndex);

router.get('/room', (req, res) => {
    res.render('chat/chatroom', { csrfToken: req.csrfToken() });
});

module.exports = router;
