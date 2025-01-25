const chat = require('../models/chat_models');

// Admin va foydalanuvchi o'rtasidagi chatni olish
exports.getChat = async (req, res) => {
    try {
        const { userId, adminId } = req.params;

        // SQL so'rov orqali chat tarixini olish
        const data = await chat.knex().raw(
            `
            SELECT * 
            FROM messages 
            WHERE (sender_id = ? AND recipient_id = ?)
               OR (sender_id = ? AND recipient_id = ?)
            ORDER BY created_at ASC;
            `,
            [userId, adminId, adminId, userId]
        );

        return res.status(200).json({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server xatosi' });
    }
};

let io; // Global o'zgaruvchi sifatida io saqlanadi

exports.initSocket = (_io) => {
    io = _io;

    // Har bir foydalanuvchi ulanishi
    io.on('connection', (socket) => {
        console.log('Foydalanuvchi ulanmoqda...', socket.id);

        // Foydalanuvchi ID'sini aniqlash va saqlash
        socket.on('identify', (user_id) => {
            console.log(`Foydalanuvchi ID: ${userId} socket bilan bog'landi`);
            socket.user_id = user_id; // Foydalanuvchi ID'sini socketga saqlaymiz
        });

        // Xabar yuborish
        socket.on('send_message', async (data) => {
            const { sender_id, recipient_id, message } = data;

            try {
                // Bazaga yozish
                const query = `
                    INSERT INTO chat (sender_id, recipient_id, message) 
                    VALUES (?, ?, ?)
                `;
                const result = await chat.knex().raw(query, [sender_id, recipient_id, message]);

                // Jo‘natilgan xabarni yuborish
                const chatMessage = {
                    id: result[0].insert_id,
                    sender_id,
                    recipient_id,
                    message,
                    
                };

                // O'ziga xabarni qaytarish
                socket.emit('receive_message', chatMessage);

                // Qabul qiluvchiga xabarni yuborish
                const recipientSocket = Array.from(io.sockets.sockets.values()).find(
                    (s) => s.user_id == recipient_id
                );

                if (recipientSocket) {
                    recipientSocket.emit('receive_message', chatMessage);
                }
            } catch (err) {
                console.error(err);
                socket.emit('error', { message: 'Xatolik yuz berdi' });
            }
        });

        // Ulanishni uzish
        socket.on('disconnect', () => {
            console.log('Foydalanuvchi uzildi...', socket.id);
        });
    });
};