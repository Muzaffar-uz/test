const User = require("../models/user_models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secret = require("../config/config");

//  Barcha foydalanuvchilarni olish
exports.getUser = async (req, res) => {
    try {
        const users = await User.query().select("*");
        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error" });
    }
};

// Foydalanuvchilar ro'yxatini olish (faqat id, name, role)
exports.getUserList = async (req, res) => {
    try {
        const users = await User.query().select("id", "name", "role");
        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

//  Foydalanuvchi qo'shish (registratsiya)
exports.postUser = async (req, res) => {
    try {
        const { phone, step, code, name, lastname, password } = req.body;

        if (step === 1) {
            const existingUser = await User.query().where("phone", phone).first();
            if (existingUser) {
                return res.status(409).json({ success: false, err: "User already exists" });
            }

            await User.query().insert({ phone });
            const verificationCode = Math.floor((Math.random() + 1) * 10000);
            const expirationTime = Date.now() + 5 * 60 * 1000; // 5 daqiqa

            await User.query().where("phone", phone).update({
                code: verificationCode,
                exp_code_time: expirationTime,
            });

            return res.status(200).json({ success: true, msg: "Verification code sent" });
        }

        if (step === 2) {
            const user = await User.query().where("phone", phone).first();
            if (!user) {
                return res.status(404).json({ success: false, err: "User not found" });
            }
            if (user.code !== code) {
                return res.status(400).json({ success: false, err: "Wrong code" });
            }
            if (user.exp_code_time < Date.now()) {
                return res.status(400).json({ success: false, err: "Code expired" });
            }

            return res.status(200).json({ success: true, msg: "Code verified" });
        }

        if (step === 3) {
            const user = await User.query().where("phone", phone).first();
            if (!user) {
                return res.status(404).json({ success: false, err: "User not found" });
            }

            await User.query().where("phone", phone).update({
                name,
                lastname,
                code: null,
                exp_code_time: null,
            });

            return res.status(200).json({ success: true, msg: "User info updated" });
        }

        if (step === 4) {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            await User.query().where("phone", phone).update({ password: hashedPassword });

            return res.status(200).json({ success: true, msg: "Password set successfully" });
        }

        return res.status(400).json({ success: false, err: "Invalid step" });

    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error" });
    }
};

//  Foydalanuvchini yangilash
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.query().where("id", id).first();

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        await User.query().where("id", id).update({
            name: req.body.name,
            role: req.body.role,
            email: req.body.email,
            phone: req.body.phone,
            login: req.body.login,
            updated_at: new Date(),
        });

        return res.status(200).json({ success: true, msg: "User updated" });

    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error" });
    }
};

//  Foydalanuvchini o‘chirish
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.query().where("id", id).first();

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        await User.query().where("id", id).delete();
        return res.status(200).json({ success: true, msg: "User deleted" });

    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error" });
    }
};

//  Login (autentifikatsiya)
exports.auth = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await User.query().where("login", login).first();

        if (!user) {
            return res.status(404).json({ success: false, err: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, err: "Invalid login or password" });
        }

        const payload = { id: user.id };
        const token = jwt.sign(payload, secret, { expiresIn: "1d" });

        return res.status(200).json({ success: true, token });

    } catch (error) {
        return res.status(500).json({ success: false, error: "Server error" });
    }
};