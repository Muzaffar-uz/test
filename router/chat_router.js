
const router = require('express').Router()
const ChatController = require('../controller/chat'); // Chat uchun controller

router.get('/all/:userId/:adminId',ChatController.getChat)



module.exports = router;