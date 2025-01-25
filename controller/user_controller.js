const User = require("../models/user_models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secret = require("../config/config");

// Ma'lumot olish
exports.getUser = async (req, res) => {
    const user = await User.query().select("*");
    return res.status(200).json({ success: true, user: user });
};

// Foydalanuvchilar ro'yxatini olish
exports.getUser1 = async (req, res) => {
  try {
      const users = await User.query().select("id", "name", "role");
      return res.status(200).json({ success: true, user: users });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Server xatosi' });
  }
};

// foydalanuvchi qo'shish
exports.postUser = async (req, res) => {
    try {

      if (req.body.step == 1) {
        const user = await User.query().where('phone',req.body.phone).first()
        if(user){
            return res.status(404).json({success:false, err:'User already exists'})
        }
        await User.query().insert({
          phone: req.body.phone
        })
        const code = Math.floor((Math.random()+1)*10000)
        const d = new Date()
        const time = d.setMinutes(d.getMinutes()+5)
        await User.query().where('phone',req.body.phone).update({
            code: code,
            exp_code_time: time,
        })
      }
      
        //smsga kod yuborish

        if(req.body.step == 2){
          const user =  User.query().where('phone',req.body.phone).first()
          if(!User){
            return res.status(404).json({success:false, err: "user-notfound"})
          }
          if(user.code!= req.body.code){
            return res.status(400).json({success:false, err: "code-worng"})
          }
          if(user.exp_code_time < new Date().getMinutes()){
            return res.status(400).json({success:false, err:"time-error"})
          }
      return res.status(200).json({success:true, msg: "success"})
        }
        if(req.body.step == 3){
          if(!User){
            return res.status(404).json({success:false, err: "user-notfound"})
          }
          if(user.code!= req.body.code){
            return res.status(400).json({success:false, err: "code-worng"})
          }
          if(user.exp_code_time < new Date().getMinutes()){
            return res.status(400).json({success:false, err:"time-error"})
          }
          await User.query().update({
            name:req.body.name,
            surname:req.body,surname,
            code: null,
            exp_code_time: null,
          })
        }      
        if(req.body.step == 4){
          if(!User){
            return res.status(404).json({success:false, err: "user-notfound"})
          }
          await User.query.update({
            note:req.body.note,
            balance_$$: req.body.balance_$$,
            balance_sum:balance_sum,
            
          })
        }
        
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
}



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
