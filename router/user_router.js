const router = require('express').Router()
const Usercontroller = require('../controller/user_controller')


;
router.get('/all',Usercontroller.getUser)
router.get('/all1',Usercontroller.getUser1)
router.post('/insert',Usercontroller.postUser); 
router.put('/updated/:id',Usercontroller.updetUser)
router.delete('/delete/:id',Usercontroller.delteUser)
// router.post('/auth',Usercontroller.auth)



module.exports = router;