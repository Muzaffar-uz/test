const chat = require('../models/chat_models');
const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');  // socket.io ni import qilish
const { database } = require('../setting/db'); // Helper orqali ma'lumotlar bazasiga ulanish
const server = http.createServer(app);

let io; // Global o'zgaruvchi sifatida io saqlanadi

// Admin va foydalanuvchi o'rtasidagi chatni olish
exports.getChat = async (req, res) => {
    try {
        const { userId, adminId } = req.params;

        // SQL so'rov orqali chat tarixini olish
        const data = await chat.knex().raw(
            `
            SELECT * 
            FROM chat 
            WHERE (sender_id = ? AND recipient_id = ?)
               OR (sender_id = ? AND recipient_id = ?)
            ORDER BY created ASC;
            `,
            [userId, adminId, adminId, userId]
        );

        return res.status(200).json({ success: true, data: data[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server xatosi' });
    }
};
