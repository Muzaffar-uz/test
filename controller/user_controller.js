const User = require("../models/user_models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secret = require("../config/config");

// Ma'lumot olish
exports.getUser = async (req, res) => {
    const user = await User.query().select("*");
    return res.status(200).json({ success: true, user: user });
};

// foydalanuvchi qo'shish
exports.postUser = async (req, res) => {
    try {
<<<<<<< HEAD
        const user = await User.query().where("phone", req.body.phone).first();

        console.log(req.body);
        if (user) {
            return res
                .status(400)
                .json({ success: false, error: "Foydalanuvchi mavjud" });
        }

        // Parolni hashlash (agar ishlatmoqchi bo'lsangiz)
        // const salt = await bcrypt.genSaltSync(12);
        // const password = await bcrypt.hashSync(req.body.password, salt);
        // Foydalanuvchini qo'shish
        await User.query().insert({
            name: req.body.name,
            role: req.body.role,
            email: req.body.email,
            // Agar parolni hash qilmoqchi bo'lsangiz, yuqoridagi "password" o'rniga hash qilingan qiymatni qo'ying
            // password: req.body.password,
            phone: req.body.phone,
            login: req.body.login,
        });

        
        // Muvaffaqiyatli javob
        return res
            .status(201)
            .json({ success: true, message: "Foydalanuvchi yaratildi" });
    } catch (error) {
        // Xatolik yuz berganda javob
        console.error("Xatolik:", error.message);
        return res
            .status(500)
            .json({ success: false, error: "Ichki server xatosi" });
    }
};
=======
      // Telefon raqami bo'yicha foydalanuvchini qidirish
      const user = await User.query().where("phone", req.body.phone).first();
  
      if (user) {
        return res.status(400).json({ success: false, error: "Foydalanuvchi mavjud" });
      }
  
      // Parolni hashlash (agar ishlatmoqchi bo'lsangiz)
      // const salt = await bcrypt.genSaltSync(12);
      // const password = await bcrypt.hashSync(req.body.password, salt);
  
      // Foydalanuvchini qo'shish
      await User.query().insert({
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
        // Agar parolni hash qilmoqchi bo'lsangiz, yuqoridagi "password" o'rniga hash qilingan qiymatni qo'ying
        // password: req.body.password, 
        phone: req.body.phone,
        login: req.body.login,
      });
  
      // Muvaffaqiyatli javob
      return res.status(201).json({ success: true, message: "Foydalanuvchi yaratildi" });
    } catch (error) {
      // Xatolik yuz berganda javob
      console.error("Xatolik:", error.message);
      return res.status(500).json({ success: false, error: "Ichki server xatosi" });
    }
  };


>>>>>>> 5e57d95 (man)
// fodalanuvchini yangilash paramsda
exports.updetUser = async (req, res) => {
    const d = new Date();

    await User.query().where("id", req.params.id).update({
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        login: req.body.login,
        created: d,
    });
    return res
        .status(200)
        .json({ success: true, msg: "foydalanuvchi o/'zgartirldi" });
};

// foydalanuvchini o'chirish
exports.delteUser = async (req, res) => {
    await User.query().where("id", req.params.id).delete();
    return res
        .status(200)
        .json({ success: true, msg: "foydalanuvchi o'chirildi" });
};

// foydalanuvchi atarizatsiyasi
// exports.auth = async (req, res) => {
//   const user = await User.query().where("login", req.body.login).first();
//   if (!user) {
// return res.status(404).json({ success: false, err: "user-not-found" });
//   }
//   const checkPassword = await bcrypt.compareSync(
// req.body.password,
// user.password
//   )
//   if (!checkPassword) {
// return res.status(400).json({ success: false, err: "login-or-password-fail" });
//   }
//   const payload = { id: user.id };
//
//   const token = await jwt.sign(payload, secret, { expiresIn: "1d" });
//   return res.status(200).json({ success: true, token: token });
// };
//
