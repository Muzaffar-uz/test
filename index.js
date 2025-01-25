const express = require('express');
const http = require('http');
const WebSocket = require('ws'); // Toza WebSocket kutubxonasi
const bodyParser = require('body-parser');
const cors = require('cors');

const {database} = require('./setting/db'); // Helper orqali ma'lumotlar bazasiga ulanish

const app = express();
const server = http.createServer(app);
const socketIO = require('socket.io')
// WebSocket serverni HTTP server bilan ulash
const wss = new WebSocket.Server({ server });
const chat = require('./models/chat_models');

// Middleware'lar
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// WebSocket ulanishi
wss.on('connection', (ws) => {
    console.log('WebSocket foydalanuvchi ulandi.');

    // Xabarni qabul qilish
    ws.on('message', async (data) => {
        console.log(`Kelgan xabar: ${data}`);

        try {
            // Xabarni JSON formatida tahlil qilish
            const { sender_id, recipient_id, message: messageText } = JSON.parse(data);  // messageText deb nomlaganimizga e'tibor bering
            console.log(`Yuboruvchi ID: ${sender_id}, Qabul qiluvchi ID: ${recipient_id}, Xabar: ${messageText}`);

            // Xabarni ma'lumotlar bazasiga yozish
            await chat.query().insert({
                sender_id,
                recipient_id,
                message: messageText  // Bu yerda ham `message`ni `messageText`ga almashtiramiz
            });

            // Yuborilgan xabarni qaytarish
            const chatMessage = {
                sender_id,
                recipient_id,
                message: messageText,  // messageText ishlatiladi
            };

            // Xabarni yuboruvchi va qabul qiluvchiga yuborish
            ws.send(JSON.stringify({ event: 'receive_message', data: chatMessage }));

        } catch (err) {
            console.error(err);
            ws.send(JSON.stringify({ event: 'error', message: 'Xatolik yuz berdi' }));
        }
    });

    // Ulanishni uzish
    ws.on('close', () => {
        console.log('WebSocket foydalanuvchi uzildi.');
    });
});
// Routerlarni ulash
const UserRouter = require('./router/user_router');
const ChatRouter = require('./router/chat_router'); // Faqat REST uchun
app.use('/user', UserRouter);
app.use('/chat', ChatRouter);

// HTTP va WebSocket serverni ishga tushirish
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`HTTP va WebSocket server ${PORT}-portda ishlamoqda.`);
});