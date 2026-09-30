require('dotenv').config()

const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Admin = require('../models/Admin')

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL.toLowerCase()
    })

    if (existingAdmin) {
      console.log('Admin already exists.')
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      12
    )

    await Admin.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    })

    console.log('Admin account created successfully.')
    console.log(`Email: ${process.env.ADMIN_EMAIL}`)

    process.exit(0)
  } catch (error) {
    console.error('Admin seed failed:', error.message)
    process.exit(1)
  }
}

seedAdmin()