const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

// WebSocket serverni import qilish
const { wss } = require('./controller/soket');

// Routerlarni import qilish
const UserRouter = require('./router/user_router');
const ChatRouter = require('./router/chat_router');

const app = express();
const server = http.createServer(app); // HTTP server yaratish

// Middleware'lar
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routerlarni ulash
app.use('/user', UserRouter);
app.use('/chat', ChatRouter);

// WebSocketni HTTP server bilan ulash
server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);

    if (pathname === '/chat') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy(); // Noto'g'ri yo'nalish bo'lsa, ulanishni uzish
    }
});

// Serverni ishga tushirish
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} da ishlayapti`);
});