const API_URL = 'http://localhost:5000/api/students'

// ======================================================
// COMMON RESPONSE HANDLER
// ======================================================

const handleResponse = async response => {
  let result

  try {
    result = await response.json()
  } catch {
    throw new Error('Server returned an invalid response.')
  }

  if (!response.ok) {
    throw new Error(result?.message || 'Something went wrong.')
  }

  return result
}

// ======================================================
// GET ALL STUDENTS
// ======================================================

export const getStudents = async ({
  search = '',
  branch = '',
  semester = '',
  minCgpa = '',
  maxCgpa = '',
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc'
} = {}) => {
  const params = new URLSearchParams()

  if (search.trim()) {
    params.append('search', search.trim())
  }

  if (branch) {
    params.append('branch', branch)
  }

  if (semester) {
    params.append('semester', semester)
  }

  if (minCgpa !== '') {
    params.append('minCgpa', minCgpa)
  }

  if (maxCgpa !== '') {
    params.append('maxCgpa', maxCgpa)
  }

  params.append('page', page)
  params.append('limit', limit)
  params.append('sortBy', sortBy)
  params.append('sortOrder', sortOrder)

  const url = `${API_URL}?${params.toString()}`

  const response = await fetch(url, {
    credentials: 'include'
  })

  return handleResponse(response)
}

// ======================================================
// GET SINGLE STUDENT
// ======================================================

export const getStudentById = async id => {
  if (!id) {
    throw new Error('Student ID is required.')
  }

  const response = await fetch(`${API_URL}/${id}`, {
    credentials: 'include'
  })

  return handleResponse(response)
}

// ======================================================
// CREATE STUDENT
// ======================================================

export const createStudent = async student => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(student)
  })

  return handleResponse(response)
}

// ======================================================
// UPDATE STUDENT
// ======================================================

export const updateStudent = async (id, student) => {
  if (!id) {
    throw new Error('Student ID is required.')
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(student)
  })

  return handleResponse(response)
}

// ======================================================
// DELETE STUDENT
// ======================================================

export const deleteStudent = async id => {
  if (!id) {
    throw new Error('Student ID is required.')
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })

  return handleResponse(response)
}

// ======================================================
// GET STUDENT STATISTICS
// ======================================================

export const getStudentStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    credentials: 'include'
  })

  return handleResponse(response)
}