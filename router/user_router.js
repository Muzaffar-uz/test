const router = require('express').Router()
const Usercontroller = require('../controller/user_controller')
const {protect,role} = require('../middleware/auth-middleware')

;
router.get('/all',Usercontroller.getUser)
router.get('/allList',Usercontroller.getUserList)
router.post('/insert',Usercontroller.postUser); 
router.put('/updated/:id',Usercontroller.updateUser)
router.delete('/delete/:id',Usercontroller.deleteUser)
// router.post('/auth',Usercontroller.auth)



module.exports = router;