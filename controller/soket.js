const WebSocket = require('ws');
const chat = require('../models/chat_models'); // Chat modeli
const fs = require('fs'); // Faylni saqlash uchun
const path = require('path'); // Fayl yo‘li uchun

const wss = new WebSocket.Server({ noServer: true }); // WebSocket server

wss.on('connection', (ws) => {
    console.log('WebSocket foydalanuvchi ulandi.');

    ws.on('message', async (data) => {
        console.log(`Kelgan xabar: ${data}`);

        try {
            const parsedData = JSON.parse(data);
            const { sender_id, recipient_id, message, file, fileType } = parsedData;

            let filePath = null;

            // Agar fayl bo'lsa, uni serverga saqlaymiz
            if (file && fileType) {
                const fileBuffer = Buffer.from(file, 'base64'); // Faylni dekod qilish
                const fileName = `${Date.now()}_${sender_id}${path.extname(fileType)}`;
                const uploadPath = path.join(__dirname, '../uploads/', fileName);

                fs.writeFileSync(uploadPath, fileBuffer); // Faylni saqlash
                filePath = `uploads/${fileName}`; // Fayl yo‘lini bazaga saqlaymiz
            }

            // Xabarni bazaga yozish
            const newMessage = await chat.query().insert({
                sender_id,
                recipient_id,
                message,
                file_path: filePath, // Fayl bor bo‘lsa, yo‘lini saqlaymiz
                
            });

            // Xabarni mijozlarga jo‘natish
            ws.send(JSON.stringify({
                event: 'receive_message',
                data: {
                    sender_id,
                    recipient_id,
                    message,
                    file_path: filePath
                }
            }));
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