const router = require('express').Router();
const userController = require('../controllers/userController')
const {auth} = require('../middleware/auth');
const { upload } = require('../middleware/multer');

router.post('/register', userController.registerUser)
router.post('/verify-email', userController.verifyEmail)
router.post('/login', userController.login)
router.get('/logout', auth, userController.logout)
router.put('/upload-avatar', auth, upload.single('avatar'), userController.uploadAvatar)
router.put('/update-user', auth, userController.updateUserDetails)
router.put('/forgot-password', userController.forgotPassword)
router.put('/verify-otp', userController.verifyOTP)
router.put('/reset-password', userController.resetPassword)
router.post('/refresh-access-token', userController.refreshAccessToken)
router.get('/user-details', auth, userController.userDetails)

module.exports = router