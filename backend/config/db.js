const mongoose = require('mongoose')

/**
 * Connect application to MongoDB
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB Connected: ${connection.connection.host}`)
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message)

    // Stop application if database connection fails
    process.exit(1)
  }
}

module.exports = connectDB
