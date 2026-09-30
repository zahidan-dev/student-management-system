const express = require('express')

const {
  login,
  getMe,
  logout,
  changePassword
} = require('../controllers/authController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)

router.get('/me', protect, getMe)
router.put('/change-password', protect, changePassword)

module.exports = router