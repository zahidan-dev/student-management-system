const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    role: {
      type: String,
      enum: ['admin'],
      default: 'admin'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = mongoose.model('Admin', adminSchema)