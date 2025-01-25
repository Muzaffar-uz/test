
const router = require('express').Router()
const ChatController = require('../controller/chat'); // Chat uchun controller

router.get('/all',ChatController.getChat)



module.exports = router;