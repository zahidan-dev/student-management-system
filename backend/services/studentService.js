const Student = require('../models/Student')

/**
 * Student Service Layer
 *
 * This layer contains the business and database logic
 * related to students.
 *
 * Controllers should call these service methods instead
 * of directly interacting with the Student model.
 */

/**
 * Create a new student
 */
const createStudent = async studentData => {
  const student = await Student.create(studentData)

  return student
}

/**
 * Get a single student by MongoDB ObjectId
 */
const getStudentById = async studentId => {
  const student = await Student.findById(studentId).lean()

  return student
}

/**
 * Update an existing student
 */
const updateStudent = async (studentId, updateData) => {
  const student = await Student.findByIdAndUpdate(studentId, updateData, {
    new: true,
    runValidators: true
  }).lean()

  return student
}

/**
 * Delete a student
 */
const deleteStudent = async studentId => {
  const student = await Student.findByIdAndDelete(studentId).lean()

  return student
}

/**
 * Get students with:
 *
 * - Search
 * - Branch filtering
 * - Semester filtering
 * - CGPA range filtering
 * - Pagination
 * - Sorting
 */
const getStudents = async ({
  search,
  branch,
  semester,
  minCgpa,
  maxCgpa,
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc'
}) => {
  // ==========================================
  // BUILD QUERY
  // ==========================================

  const query = {}

  // ------------------------------------------
  // Search
  // ------------------------------------------

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        studentId: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        email: {
          $regex: search,
          $options: 'i'
        }
      }
    ]
  }

  // ------------------------------------------
  // Branch Filter
  // ------------------------------------------

  if (branch) {
    query.branch = branch
  }

  // ------------------------------------------
  // Semester Filter
  // ------------------------------------------

  if (semester !== undefined) {
    query.semester = Number(semester)
  }

  // ------------------------------------------
  // CGPA Range
  // ------------------------------------------

  if (minCgpa !== undefined || maxCgpa !== undefined) {
    query.cgpa = {}

    if (minCgpa !== undefined) {
      query.cgpa.$gte = Number(minCgpa)
    }

    if (maxCgpa !== undefined) {
      query.cgpa.$lte = Number(maxCgpa)
    }
  }

  // ==========================================
  // PAGINATION
  // ==========================================

  const currentPage = Math.max(Number(page) || 1, 1)

  const itemsPerPage = Math.min(Math.max(Number(limit) || 10, 1), 100)

  const skip = (currentPage - 1) * itemsPerPage

  // ==========================================
  // SORTING
  // ==========================================

  const allowedSortFields = [
    'studentId',
    'name',
    'email',
    'branch',
    'semester',
    'cgpa',
    'createdAt',
    'updatedAt'
  ]

  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'

  const safeSortOrder = sortOrder === 'asc' ? 1 : -1

  const sort = {
    [safeSortBy]: safeSortOrder
  }

  // ==========================================
  // DATABASE QUERIES
  // ==========================================

  const [students, totalStudents] = await Promise.all([
    Student.find(query).sort(sort).skip(skip).limit(itemsPerPage).lean(),

    Student.countDocuments(query)
  ])

  // ==========================================
  // PAGINATION METADATA
  // ==========================================

  const totalPages = Math.ceil(totalStudents / itemsPerPage)

  return {
    students,
    pagination: {
      currentPage,
      totalPages,
      totalStudents,
      limit: itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    },

    filters: {
      search: search || null,
      branch: branch || null,
      semester: semester !== undefined ? Number(semester) : null,

      minCgpa: minCgpa !== undefined ? Number(minCgpa) : null,

      maxCgpa: maxCgpa !== undefined ? Number(maxCgpa) : null,

      sortBy: safeSortBy,
      sortOrder: safeSortOrder === 1 ? 'asc' : 'desc'
    }
  }
}

/**
 * Get dashboard statistics
 */
const getStudentStats = async () => {
  const [
    totalStudents,
    averageCgpa,
    highestCgpa,
    lowestCgpa,
    branchDistribution,
    semesterDistribution
  ] = await Promise.all([
    // Total students
    Student.countDocuments(),

    // Average CGPA
    Student.aggregate([
      {
        $group: {
          _id: null,
          average: {
            $avg: '$cgpa'
          }
        }
      }
    ]),

    // Highest CGPA
    Student.findOne().sort({ cgpa: -1 }).select('name studentId cgpa').lean(),

    // Lowest CGPA
    Student.findOne().sort({ cgpa: 1 }).select('name studentId cgpa').lean(),

    // Students per branch
    Student.aggregate([
      {
        $group: {
          _id: '$branch',
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ]),

    // Students per semester
    Student.aggregate([
      {
        $group: {
          _id: '$semester',
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ])
  ])

  return {
    totalStudents,

    averageCgpa:
      averageCgpa.length > 0 ? Number(averageCgpa[0].average.toFixed(2)) : 0,

    highestCgpa: highestCgpa
      ? {
          studentId: highestCgpa.studentId,
          name: highestCgpa.name,
          cgpa: highestCgpa.cgpa
        }
      : null,

    lowestCgpa: lowestCgpa
      ? {
          studentId: lowestCgpa.studentId,
          name: lowestCgpa.name,
          cgpa: lowestCgpa.cgpa
        }
      : null,

    branchDistribution: branchDistribution.map(item => ({
      branch: item._id,
      count: item.count
    })),

    semesterDistribution: semesterDistribution.map(item => ({
      semester: item._id,
      count: item.count
    }))
  }
}

module.exports = {
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudents,
  getStudentStats
}
