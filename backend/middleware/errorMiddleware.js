/**
 * Global Error Handling Middleware
 *
 * Handles errors generated anywhere in the application
 * and returns a consistent JSON response.
 */

const errorMiddleware = (err, req, res, next) => {
  console.error('ERROR:', err)

  let statusCode = err.statusCode || 500

  let message = err.message || 'Internal Server Error'

  // ==========================================
  // MONGOOSE VALIDATION ERROR
  // ==========================================

  if (err.name === 'ValidationError') {
    statusCode = 400

    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }))

    return res.status(statusCode).json({
      success: false,
      message: 'Validation failed',
      errors
    })
  }

  // ==========================================
  // MONGOOSE DUPLICATE KEY ERROR
  // ==========================================

  if (err.code === 11000) {
    statusCode = 409

    const duplicateField = Object.keys(err.keyValue)[0]

    return res.status(statusCode).json({
      success: false,
      message: `${duplicateField} already exists`,
      field: duplicateField,
      value: err.keyValue[duplicateField]
    })
  }

  // ==========================================
  // INVALID MONGODB OBJECT ID
  // ==========================================

  if (err.name === 'CastError') {
    statusCode = 400

    message = `Invalid ${err.path}: ${err.value}`
  }

  // ==========================================
  // FINAL ERROR RESPONSE
  // ==========================================

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  })
}

module.exports = errorMiddleware
