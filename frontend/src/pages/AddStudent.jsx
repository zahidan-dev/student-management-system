import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

import { createStudent } from '../services/studentService'

const initialForm = {
  studentId: '',
  name: '',
  email: '',
  mobile: '',
  branch: 'CSE',
  semester: 1,
  cgpa: ''
}

const AddStudent = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = event => {
    const { name, value } = event.target

    setForm(previous => ({
      ...previous,
      [name]: value
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')

    const studentId = form.studentId.trim().toUpperCase()
    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    const mobile = form.mobile.trim()
    const semester = Number(form.semester)
    const cgpa = Number(form.cgpa)

    // Frontend validation
    if (studentId.length < 2) {
      setError('Please enter a valid Student ID.')
      return
    }

    if (name.length < 2) {
      setError('Please enter the student name.')
      return
    }

    if (!email) {
      setError('Please enter the student email address.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    if (semester < 1 || semester > 8) {
      setError('Please select a valid semester.')
      return
    }

    if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      setError('CGPA must be between 0 and 10.')
      return
    }

    try {
      setLoading(true)

      await createStudent({
        studentId,
        name,
        email,
        mobile,
        branch: form.branch,
        semester,
        cgpa
      })

      toast.success('Student created successfully!')

      navigate('/students')
    } catch (err) {
      console.error('Create student error:', err)

      const message = err?.message || 'Failed to create student.'

      setError(message)

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='form-page'>
      {/* BACK */}

      <button
        type='button'
        className='back-link-button'
        onClick={() => navigate('/students')}
        disabled={loading}
      >
        <ArrowLeft size={16} />
        Back to Students
      </button>

      {/* PAGE HEADER */}

      <div className='form-page-header'>
        <div>
          <p className='page-eyebrow'>STUDENT MANAGEMENT</p>

          <h1>Add Student</h1>

          <p>
            Create a new student record with personal and academic information.
          </p>
        </div>
      </div>

      {/* FORM */}

      <form className='professional-form' onSubmit={handleSubmit}>
        {/* =================================================
            PERSONAL INFORMATION
            ================================================= */}

        <section className='form-card'>
          <div className='form-card-header'>
            <div className='form-icon'>
              <User size={20} />
            </div>

            <div>
              <h2>Personal Information</h2>

              <p>Basic identification and contact details</p>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className='form-alert error'>
              <AlertCircle size={17} />

              <span>{error}</span>
            </div>
          )}

          <div className='form-grid'>
            {/* STUDENT ID */}

            <div className='form-group'>
              <label htmlFor='studentId'>
                Student ID <span>*</span>
              </label>

              <input
                id='studentId'
                name='studentId'
                type='text'
                placeholder='e.g. STU2026A01'
                value={form.studentId}
                onChange={handleChange}
                autoComplete='off'
                maxLength={30}
                required
                disabled={loading}
              />

              <small>Student ID must be unique.</small>
            </div>

            {/* NAME */}

            <div className='form-group'>
              <label htmlFor='name'>
                Full Name <span>*</span>
              </label>

              <input
                id='name'
                name='name'
                type='text'
                placeholder='e.g. Rahul Verma'
                value={form.name}
                onChange={handleChange}
                autoComplete='name'
                maxLength={100}
                required
                disabled={loading}
              />
            </div>

            {/* EMAIL */}

            <div className='form-group'>
              <label htmlFor='email'>
                <Mail size={14} />
                Email Address <span>*</span>
              </label>

              <input
                id='email'
                name='email'
                type='email'
                placeholder='student@example.com'
                value={form.email}
                onChange={handleChange}
                autoComplete='email'
                maxLength={150}
                required
                disabled={loading}
              />
            </div>

            {/* MOBILE */}

            <div className='form-group'>
              <label htmlFor='mobile'>
                <Phone size={14} />
                Mobile Number <span>*</span>
              </label>

              <input
                id='mobile'
                name='mobile'
                type='tel'
                placeholder='9876543210'
                value={form.mobile}
                onChange={handleChange}
                inputMode='numeric'
                maxLength={10}
                required
                disabled={loading}
              />

              <small>Enter a valid 10-digit mobile number.</small>
            </div>
          </div>
        </section>

        {/* =================================================
            ACADEMIC INFORMATION
            ================================================= */}

        <section className='form-card'>
          <div className='form-card-header'>
            <div className='form-icon'>
              <GraduationCap size={20} />
            </div>

            <div>
              <h2>Academic Information</h2>

              <p>Course, semester and academic performance</p>
            </div>
          </div>

          <div className='form-grid'>
            {/* BRANCH */}

            <div className='form-group'>
              <label htmlFor='branch'>
                <BookOpen size={14} />
                Branch <span>*</span>
              </label>

              <select
                id='branch'
                name='branch'
                value={form.branch}
                onChange={handleChange}
                disabled={loading}
              >
                <option value='CSE'>Computer Science & Engineering</option>

                <option value='IT'>Information Technology</option>

                <option value='EXTC'>Electronics & Telecommunication</option>

                <option value='Mechanical'>Mechanical Engineering</option>

                <option value='Civil'>Civil Engineering</option>

                <option value='Electrical'>Electrical Engineering</option>
              </select>
            </div>

            {/* SEMESTER */}

            <div className='form-group'>
              <label htmlFor='semester'>
                <GraduationCap size={14} />
                Semester <span>*</span>
              </label>

              <select
                id='semester'
                name='semester'
                value={form.semester}
                onChange={handleChange}
                disabled={loading}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(semester => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </div>

            {/* CGPA */}

            <div className='form-group'>
              <label htmlFor='cgpa'>
                <GraduationCap size={14} />
                CGPA <span>*</span>
              </label>

              <input
                id='cgpa'
                name='cgpa'
                type='number'
                min='0'
                max='10'
                step='0.01'
                placeholder='e.g. 8.50'
                value={form.cgpa}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <small>Enter a value between 0 and 10.</small>
            </div>
          </div>
        </section>

        {/* =================================================
            ACTIONS
            ================================================= */}

        <div className='form-actions'>
          <button
            type='button'
            className='secondary-button'
            onClick={() => navigate('/students')}
            disabled={loading}
          >
            Cancel
          </button>

          <button type='submit' className='primary-button' disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={17} className='spin' />
                Creating...
              </>
            ) : (
              <>
                <Save size={17} />
                Create Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStudent
