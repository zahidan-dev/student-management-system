import { useEffect, useState } from 'react'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react'

import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { getStudents, deleteStudent } from '../services/studentService'

const Students = () => {
  const [students, setStudents] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')

  const [searchQuery, setSearchQuery] = useState('')

  const [branch, setBranch] = useState('')

  const [semester, setSemester] = useState('')

  const [minCgpa, setMinCgpa] = useState('')

  const [maxCgpa, setMaxCgpa] = useState('')

  const [sortBy, setSortBy] = useState('createdAt')

  const [sortOrder, setSortOrder] = useState('desc')

  const [page, setPage] = useState(1)

  const [limit] = useState(10)

  const [deletingId, setDeletingId] = useState(null)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNextPage: false,
    hasPreviousPage: false
  })

  const loadStudents = async () => {
    try {
      setLoading(true)

      const params = {
        page,
        limit,
        sortBy,
        sortOrder
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }

      if (branch) {
        params.branch = branch
      }

      if (semester) {
        params.semester = semester
      }

      if (minCgpa) {
        params.minCgpa = minCgpa
      }

      if (maxCgpa) {
        params.maxCgpa = maxCgpa
      }
      const response = await getStudents(params)

      setStudents(Array.isArray(response?.data) ? response.data : [])

      setPagination(
        response?.pagination || {
          currentPage: page,
          totalPages: 1,
          totalStudents: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      )
    } catch (error) {
      console.error(error)

      toast.error(error.message || 'Failed to load students.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [page, sortBy, sortOrder, branch, semester, minCgpa, maxCgpa])

  const handleSearch = event => {
    if (event.key === 'Enter') {
      setSearchQuery(search.trim())
      setPage(1)
    }
  }
  const handleDelete = async id => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this student? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      setDeletingId(id)

      await deleteStudent(id)

      toast.success('Student deleted successfully.')

      if (students.length === 1 && page > 1) {
        setPage(previous => previous - 1)
      } else {
        await loadStudents()
      }
    } catch (error) {
      console.error(error)

      toast.error(error.message || 'Failed to delete student.')
    } finally {
      setDeletingId(null)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setBranch('')
    setSemester('')
    setMinCgpa('')
    setMaxCgpa('')
    setSortBy('createdAt')
    setSortOrder('desc')
    setPage(1)
  }

  return (
    <div>
      {/* PAGE HEADER */}

      <div className='students-page-header'>
        <div>
          <p className='page-eyebrow'>STUDENT MANAGEMENT</p>

          <h1>Students</h1>

          <p>Manage, search and organize student records.</p>
        </div>

        <Link to='/students/add' className='primary-button'>
          <Plus size={17} />
          Add Student
        </Link>
      </div>

      {/* FILTER CARD */}

      <div className='filters-card'>
        <div className='filters-top'>
          <div className='filter-title'>
            <SlidersHorizontal size={17} />

            <span>Search & Filters</span>
          </div>

          <button className='clear-button' onClick={clearFilters}>
            Clear filters
          </button>
        </div>

        <div className='filters-grid'>
          {/* SEARCH */}

          <div className='search-input-wrapper'>
            <Search size={17} />

            <input
              type='text'
              placeholder='Search by name, ID or email...'
              value={search}
              onChange={event => setSearch(event.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* BRANCH */}

          <select
            value={branch}
            onChange={event => {
              setBranch(event.target.value)
              setPage(1)
            }}
          >
            <option value=''>All Branches</option>

            <option value='CSE'>CSE</option>

            <option value='IT'>IT</option>

            <option value='EXTC'>EXTC</option>

            <option value='Mechanical'>Mechanical</option>

            <option value='Civil'>Civil</option>

            <option value='Electrical'>Electrical</option>
          </select>

          {/* SEMESTER */}

          <select
            value={semester}
            onChange={event => {
              setSemester(event.target.value)
              setPage(1)
            }}
          >
            <option value=''>All Semesters</option>

            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>

          {/* SORT */}

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={event => {
              const [field, order] = event.target.value.split('-')

              setSortBy(field)
              setSortOrder(order)
              setPage(1)
            }}
          >
            <option value='createdAt-desc'>Newest First</option>

            <option value='name-asc'>Name A-Z</option>

            <option value='name-desc'>Name Z-A</option>

            <option value='cgpa-desc'>Highest CGPA</option>

            <option value='cgpa-asc'>Lowest CGPA</option>
          </select>
        </div>

        {/* ADVANCED CGPA */}

        <div className='advanced-filter-row'>
          <div>
            <label>Minimum CGPA</label>

            <input
              type='number'
              min='0'
              max='10'
              step='0.01'
              placeholder='0'
              value={minCgpa}
              onChange={event => {
                setMinCgpa(event.target.value)
                setPage(1)
              }}
            />
          </div>

          <div>
            <label>Maximum CGPA</label>

            <input
              type='number'
              min='0'
              max='10'
              step='0.01'
              placeholder='10'
              value={maxCgpa}
              onChange={event => {
                setMaxCgpa(event.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>
      </div>

      {/* TABLE CARD */}

      <div className='students-table-card'>
        <div className='table-header'>
          <div>
            <h3>Student Records</h3>

            <p>{pagination.totalStudents || 0} students found</p>
          </div>

          <div className='table-sort'>
            <ArrowUpDown size={15} />

            <span>
              Sorted by{' '}
              {sortBy === 'cgpa' ? 'CGPA' : sortBy === 'name' ? 'Name' : 'Date'}
            </span>
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className='table-loading'>
            <div className='loading-spinner' />
            <p>Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          /* EMPTY */

          <div className='empty-state'>
            <div className='empty-icon'>
              <Search size={25} />
            </div>

            <h3>No students found</h3>

            <p>Try changing your search or filters.</p>

            <button onClick={clearFilters} className='secondary-button'>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* TABLE */}

            <div className='table-wrapper'>
              <table className='professional-table'>
                <thead>
                  <tr>
                    <th>Student</th>

                    <th>Contact</th>

                    <th>Branch</th>

                    <th>Semester</th>

                    <th>CGPA</th>

                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map(student => (
                    <tr key={student._id}>
                      <td>
                        <div className='student-cell'>
                          <div className='student-avatar'>
                            {student.name?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{student.name}</strong>

                            <span>{student.studentId}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className='contact-cell'>
                          <span>{student.email}</span>

                          <small>{student.mobile}</small>
                        </div>
                      </td>

                      <td>
                        <span className='branch-badge'>{student.branch}</span>
                      </td>

                      <td>
                        <span className='semester-badge'>
                          Sem {student.semester}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`cgpa-badge ${
                            Number(student.cgpa) >= 8.5
                              ? 'excellent'
                              : Number(student.cgpa) >= 7
                              ? 'good'
                              : 'average'
                          }`}
                        >
                          {student.cgpa}
                        </span>
                      </td>

                      <td>
                        <div className='action-buttons'>
                          <Link
                            to={`/students/edit/${student._id}`}
                            className='action-button edit'
                            title='Edit student'
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            type='button'
                            className='action-button delete'
                            title='Delete student'
                            onClick={() => handleDelete(student._id)}
                            disabled={deletingId === student._id}
                          >
                            {deletingId === student._id ? (
                              <span className='delete-spinner' />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className='pagination'>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <div className='pagination-buttons'>
                <button
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage(previous => previous - 1)}
                >
                  <ChevronLeft size={17} />
                </button>

                <span className='page-number'>{pagination.currentPage}</span>

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(previous => previous + 1)}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Students
