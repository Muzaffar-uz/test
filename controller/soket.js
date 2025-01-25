const WebSocket = require('ws');
const chat = require('../models/chat_models'); // Chat modeli

const wss = new WebSocket.Server({ noServer: true }); // WebSocket serverni noServer rejimida yaratish

wss.on('connection', (ws) => {
    console.log('WebSocket foydalanuvchi ulandi.');

    ws.on('message', async (data) => {
        console.log(`Kelgan xabar: ${data}`);

        try {
            const { sender_id, recipient_id, message: messageText } = JSON.parse(data);

            // Xabarni bazaga yozish
            await chat.query().insert({
                sender_id,
                recipient_id,
                message: messageText
            });

            ws.send(JSON.stringify({ event: 'receive_message', data: { sender_id, recipient_id, message: messageText } }));
        } catch (err) {
            console.error(err);
            ws.send(JSON.stringify({ event: 'error', message: 'Xatolik yuz berdi.' }));
        }
    });

    ws.on('close', () => {
        console.log('WebSocket foydalanuvchi uzildi.');
    });
});

module.exports = { wss }; // WebSocket serverini eksport qilish