const mongoose = require('mongoose')

const asyncHandler = require('../utils/asyncHandler')

const {
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudents,
  getStudentStats
} = require('../services/studentService')

/*
|--------------------------------------------------------------------------
| Allowed Student Fields
|--------------------------------------------------------------------------
|
| We never directly pass the entire req.body to the service.
| This prevents unwanted fields from being written into MongoDB.
|
*/

const ALLOWED_FIELDS = [
  'studentId',
  'name',
  'email',
  'mobile',
  'branch',
  'semester',
  'cgpa'
]

/*
|--------------------------------------------------------------------------
| Helper: Pick Only Allowed Fields
|--------------------------------------------------------------------------
*/

const pickStudentFields = (body = {}) => {
  return Object.keys(body).reduce((filteredData, key) => {
    if (ALLOWED_FIELDS.includes(key)) {
      filteredData[key] = body[key]
    }

    return filteredData
  }, {})
}

/*
|--------------------------------------------------------------------------
| Helper: Validate MongoDB ObjectId
|--------------------------------------------------------------------------
*/

const validateObjectId = id => {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid student ID format')

    error.statusCode = 400

    throw error
  }
}

/*
|--------------------------------------------------------------------------
| CREATE STUDENT
|--------------------------------------------------------------------------
|
| POST /api/students
|
*/

const createStudentController = asyncHandler(async (req, res) => {
  const studentData = pickStudentFields(req.body)

  /*
   * Make sure the request actually contains data.
   */

  if (Object.keys(studentData).length === 0) {
    const error = new Error('Student data is required')

    error.statusCode = 400

    throw error
  }

  const student = await createStudent(studentData)

  return res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: student
  })
})

/*
|--------------------------------------------------------------------------
| GET ALL STUDENTS
|--------------------------------------------------------------------------
|
| GET /api/students
|
| Supports:
|
| search
| branch
| semester
| minCgpa
| maxCgpa
| page
| limit
| sortBy
| sortOrder
|
*/

const getStudentsController = asyncHandler(async (req, res) => {
  const {
    search,
    branch,
    semester,
    minCgpa,
    maxCgpa,
    page,
    limit,
    sortBy,
    sortOrder
  } = req.query

  /*
   * Validate semester if supplied
   */

  if (semester !== undefined) {
    const semesterNumber = Number(semester)

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      const error = new Error('Semester must be an integer between 1 and 8')

      error.statusCode = 400

      throw error
    }
  }

  /*
   * Validate minimum CGPA
   */

  if (minCgpa !== undefined) {
    const minCgpaNumber = Number(minCgpa)

    if (
      Number.isNaN(minCgpaNumber) ||
      minCgpaNumber < 0 ||
      minCgpaNumber > 10
    ) {
      const error = new Error('minCgpa must be a number between 0 and 10')

      error.statusCode = 400

      throw error
    }
  }

  /*
   * Validate maximum CGPA
   */

  if (maxCgpa !== undefined) {
    const maxCgpaNumber = Number(maxCgpa)

    if (
      Number.isNaN(maxCgpaNumber) ||
      maxCgpaNumber < 0 ||
      maxCgpaNumber > 10
    ) {
      const error = new Error('maxCgpa must be a number between 0 and 10')

      error.statusCode = 400

      throw error
    }
  }

  /*
   * Make sure minimum CGPA is not greater
   * than maximum CGPA.
   */

  if (
    minCgpa !== undefined &&
    maxCgpa !== undefined &&
    Number(minCgpa) > Number(maxCgpa)
  ) {
    const error = new Error('minCgpa cannot be greater than maxCgpa')

    error.statusCode = 400

    throw error
  }

  /*
   * Validate page
   */

  if (page !== undefined) {
    const pageNumber = Number(page)

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      const error = new Error('Page must be a positive integer')

      error.statusCode = 400

      throw error
    }
  }

  /*
   * Validate limit
   */

  if (limit !== undefined) {
    const limitNumber = Number(limit)

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      const error = new Error('Limit must be between 1 and 100')

      error.statusCode = 400

      throw error
    }
  }

  /*
   * Validate sort order
   */

  if (
    sortOrder !== undefined &&
    !['asc', 'desc'].includes(String(sortOrder).toLowerCase())
  ) {
    const error = new Error('sortOrder must be either asc or desc')

    error.statusCode = 400

    throw error
  }

  /*
   * Call service layer
   */

  const result = await getStudents({
    search: search?.trim(),
    branch: branch?.trim(),
    semester,
    minCgpa,
    maxCgpa,
    page,
    limit,
    sortBy,
    sortOrder: sortOrder?.toLowerCase()
  })

  return res.status(200).json({
    success: true,
    message: 'Students fetched successfully',
    data: result.students,
    pagination: result.pagination,
    filters: result.filters
  })
})

/*
|--------------------------------------------------------------------------
| GET SINGLE STUDENT
|--------------------------------------------------------------------------
|
| GET /api/students/:id
|
*/

const getStudentController = asyncHandler(async (req, res) => {
  const { id } = req.params

  validateObjectId(id)

  const student = await getStudentById(id)

  if (!student) {
    const error = new Error('Student not found')

    error.statusCode = 404

    throw error
  }

  return res.status(200).json({
    success: true,
    message: 'Student fetched successfully',
    data: student
  })
})

/*
|--------------------------------------------------------------------------
| UPDATE STUDENT
|--------------------------------------------------------------------------
|
| PUT /api/students/:id
|
*/

const updateStudentController = asyncHandler(async (req, res) => {
  const { id } = req.params

  validateObjectId(id)

  const studentData = pickStudentFields(req.body)

  if (Object.keys(studentData).length === 0) {
    const error = new Error('At least one valid student field is required')

    error.statusCode = 400

    throw error
  }

  const student = await updateStudent(id, studentData)

  if (!student) {
    const error = new Error('Student not found')

    error.statusCode = 404

    throw error
  }

  return res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data: student
  })
})

/*
|--------------------------------------------------------------------------
| DELETE STUDENT
|--------------------------------------------------------------------------
|
| DELETE /api/students/:id
|
*/

const deleteStudentController = asyncHandler(async (req, res) => {
  const { id } = req.params

  validateObjectId(id)

  const student = await deleteStudent(id)

  if (!student) {
    const error = new Error('Student not found')

    error.statusCode = 404

    throw error
  }

  return res.status(200).json({
    success: true,
    message: 'Student deleted successfully',
    data: {
      deletedStudent: {
        id: student._id,
        studentId: student.studentId,
        name: student.name
      }
    }
  })
})

/*
|--------------------------------------------------------------------------
| STUDENT STATISTICS
|--------------------------------------------------------------------------
|
| GET /api/students/stats
|
*/

const getStudentStatsController = asyncHandler(async (req, res) => {
  const stats = await getStudentStats()

  return res.status(200).json({
    success: true,
    message: 'Student statistics fetched successfully',
    data: stats
  })
})

/*
|--------------------------------------------------------------------------
| EXPORT CONTROLLERS
|--------------------------------------------------------------------------
*/

module.exports = {
  createStudentController,
  getStudentsController,
  getStudentController,
  updateStudentController,
  deleteStudentController,
  getStudentStatsController
}
