const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')
const Admin = require('../models/Admin')

const COOKIE_NAME = 'studenthub_token'

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/'
})

const createToken = adminId => {
  return jwt.sign(
    { id: adminId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  )
}

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    })
  }

  const admin = await Admin.findOne({
    email: email.trim().toLowerCase()
  }).select('+password')

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    })
  }

  const passwordMatches = await bcrypt.compare(
    password,
    admin.password
  )

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    })
  }

  const token = createToken(admin._id.toString())

  res.cookie(
    COOKIE_NAME,
    token,
    getCookieOptions()
  )

  return res.json({
    success: true,
    message: 'Login successful.',
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  })
})

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.admin
  })
})

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  })

  res.json({
    success: true,
    message: 'Logged out successfully.'
  })
})

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current and new password are required.'
    })
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must contain at least 8 characters.'
    })
  }

  const admin = await Admin.findById(req.admin._id).select(
    '+password'
  )

  const matches = await bcrypt.compare(
    currentPassword,
    admin.password
  )

  if (!matches) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect.'
    })
  }

  admin.password = await bcrypt.hash(newPassword, 12)

  await admin.save()

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  res.json({
    success: true,
    message: 'Password changed successfully. Please log in again.'
  })
})

module.exports = {
  login,
  getMe,
  logout,
  changePassword
}