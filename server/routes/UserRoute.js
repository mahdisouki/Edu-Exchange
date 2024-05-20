const router = require("express").Router()
const userCtrl = require ('../controllers/UserCtrl')
const auth = require('../middelware/auth')

router.post('/register',userCtrl.register)
router.post('/login',userCtrl.login)
router.get('/infor', auth , userCtrl.getUser)
router.delete('/deleteusers/:id' , userCtrl.deleteUser)  
router.put('/block/:id' , userCtrl.block)
module.exports = router