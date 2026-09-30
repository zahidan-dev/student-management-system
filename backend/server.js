const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/authRoutes')
const connectDB = require('./config/db')
const studentRoutes = require('./routes/studentRoutes')

const errorMiddleware = require('./middleware/errorMiddleware')
const notFoundMiddleware = require('./middleware/notFoundMiddleware')

// Load environment variables
dotenv.config()

// Initialize Express
const app = express()

// Connect to MongoDB
connectDB()

// ================================
// GLOBAL MIDDLEWARE
// ================================

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  })
)

app.use(express.json({ limit: '10kb' }))

app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb'
  })
)

app.use(cookieParser())

// ================================
// HEALTH CHECK
// ================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management System API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

// ================================
// API ROUTES
// ================================

// Authentication
app.use('/api/auth', authRoutes)

// Students
app.use('/api/students', studentRoutes)

// ================================
// ROOT ROUTE
// ================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Student Management System API'
  })
})

// ================================
// 404 HANDLER
// ================================

app.use(notFoundMiddleware)

// ================================
// GLOBAL ERROR HANDLER
// ================================

app.use(errorMiddleware)

// ================================
// SERVER
// ================================

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log('')
  console.log('╔══════════════════════════════════════════╗')
  console.log('║     STUDENT MANAGEMENT SYSTEM API        ║')
  console.log('╠══════════════════════════════════════════╣')
  console.log(`║ Server: http://localhost:${PORT}         ║`)
  console.log(
    `║ Mode:   ${process.env.NODE_ENV || 'development'}                 ║`
  )
  console.log('╚══════════════════════════════════════════╝')
  console.log('')
})

// ================================
// GRACEFUL SHUTDOWN
// ================================

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')

  server.close(() => {
    console.log('Server closed.')
    process.exit(0)
  })
})
