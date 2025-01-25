const router = require('express').Router();
const ChatController = require('../controller/chat'); // Chat uchun controller

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Foydalanuvchi ulanmoqda...', socket.id);

        // Foydalanuvchi xabar yuborganida
        socket.on('send_message', async (data) => {
            try {
                // sendMessage funksiyasini chaqirish
                ChatController.sendMessage(socket, data);
            } catch (error) {
                console.error('Xatolik yuz berdi:', error);
                socket.emit('error', { message: 'Xatolik yuz berdi' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Foydalanuvchi uzildi...', socket.id);
        });
    });

    return router;
};