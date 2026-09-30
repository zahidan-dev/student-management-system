const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.studenthub_token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const admin = await Admin.findById(decoded.id).select(
      '-password'
    )

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found.'
      })
    }

    req.admin = admin

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session.'
    })
  }
}

module.exports = protect