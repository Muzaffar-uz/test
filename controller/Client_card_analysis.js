

// const axios = require('axios');
// const Client_card_analysis = require('../models/Client_card_analysisModels');

// const ATMOS_API_URL = "https://partner.atmos.uz/token"; // Token olish uchun
// const ATMOS_API_MOVEMENT_URL =  "; // Plastik harakatlar uchun"

// // Atmos API orqali token olish
// const getToken = async () => {
//     try {
//         const clientKey = ' kCUqutYODzBYNX8MifoyRnwSRqwa';
//         const clientSecret = 'Mna8KvGL8P3LZB63k6hc09Lvjr0a';
//         const base64Credentials = Buffer.from(`${clientKey}:${clientSecret}`).toString('base64');

//         const response = await axios.post(ATMOS_API_URL, null, {
//             headers: {
//                 'Authorization': `Basic ${base64Credentials}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         });

//         return response.data.access_token;
//     } catch (error) {
//         console.error("Token olishda xatolik:", error.response?.data || error.message);
//         throw new Error("Token olishda xatolik yuz berdi");
//     }
// };

// // Plastik harakatlarni tekshirish
// const checkPlasticMovement = async (namber_carta) => {
//     try {
//         const token = await getToken();
//         const response = await axios.post(ATMOS_API_MOVEMENT_URL, { namber_carta }, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         // API dan qaytgan natijani tekshirish (3 oylik harakati bor yoki yo‘qligini)
//         return response.data && response.data.transactions && response.data.transactions.length > 0;
//     } catch (error) {
//         console.error("Plastik harakatlarni olishda xatolik:", error.response?.data || error.message);
//         return false;
//     }
// };

// // Shartnoma qo‘shish
// exports.postAnalayis = async (req, res) => {
//     try {
//         const { Contract_amount, status, Payment_term, namber_carta, Expiration_date_cart } = req.body;

//         if (!Contract_amount || isNaN(Contract_amount) || typeof Contract_amount !== "number") {
//             return res.status(400).json({ success: false, message: "Contract_amount raqam bo‘lishi kerak" });
//         }

//         if (status !== 1 && status !== 0) {
//             return res.status(400).json({ success: false, message: "Status 1 yoki 0 bo‘lishi kerak" });
//         }

//         const validPaymentTerms = [4, 6, 12];
//         if (!validPaymentTerms.includes(Number(Payment_term))) {
//             return res.status(400).json({ success: false, message: "Payment_term 4, 6 yoki 12 bo‘lishi kerak" });
//         }

//         const cartNumber = String(namber_carta);
//         if (cartNumber.length !== 16 && cartNumber.length !== 19) {
//             return res.status(400).json({ success: false, message: "Namber_carta kartaning 16 yoki 19 raqamdan iborat bo‘lishi kerak" });
//         }

//         const expirationPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
//         if (!expirationPattern.test(Expiration_date_cart)) {
//             return res.status(400).json({ success: false, message: "Expiration_date_cart MM/YY formatida bo‘lishi kerak" });
//         }

//         // Plastik kartaning 3 oylik harakatini tekshirish
//         const hasTransactions = await checkPlasticMovement(namber_carta);

//         if (!hasTransactions) {
//             return res.status(400).json({ success: false, message: "So‘nggi 3 oyda kartada harakat yo‘q" });
//         }

//         // Agar harakat bo‘lsa, ma’lumotni bazaga qo‘shish
//         const newContract = await Client_card_analysis.query().insert({
//             Contract_amount,
//             status,
//             Payment_term,
//             namber_carta,
//             Expiration_date_cart
//         });

//         return res.status(201).json({ success: true, message: "Shartnoma yaratildi", data: newContract });

//     } catch (error) {
//         console.error("Xatolik:", error);
//         return res.status(500).json({ success: false, message: "Xatolik yuz berdi", error: error.message });
//     }
// };