const express = require('express')

const protect = require('../middleware/authMiddleware')

const {
  createStudentController,
  getStudentsController,
  getStudentController,
  updateStudentController,
  deleteStudentController,
  getStudentStatsController
} = require('../controllers/studentController')

const router = express.Router()

// ==========================================
// STUDENT ROUTES
// All student routes require admin login
// ==========================================

// IMPORTANT:
// /stats must come before /:id

// Get student statistics
// GET /api/students/stats
router.get('/stats', protect, getStudentStatsController)

// Create student
// POST /api/students
router.post('/', protect, createStudentController)

// Get all students
// GET /api/students
router.get('/', protect, getStudentsController)

// Get single student
// GET /api/students/:id
router.get('/:id', protect, getStudentController)

// Update student
// PUT /api/students/:id
router.put('/:id', protect, updateStudentController)

// Delete student
// DELETE /api/students/:id
router.delete('/:id', protect, deleteStudentController)

module.exports = router
