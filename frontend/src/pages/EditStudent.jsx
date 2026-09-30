import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  getStudentById,
  updateStudent
} from '../services/studentService'

const initialForm = {
  studentId: '',
  name: '',
  email: '',
  mobile: '',
  branch: 'CSE',
  semester: 1,
  cgpa: ''
}

const EditStudent = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    let mounted = true

    const loadStudent = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getStudentById(id)
        const student = response?.data || response

        if (!mounted) return

        setFormData({
          studentId: student?.studentId || '',
          name: student?.name || '',
          email: student?.email || '',
          mobile: student?.mobile || '',
          branch: student?.branch || 'CSE',
          semester: student?.semester || 1,
          cgpa: student?.cgpa ?? ''
        })
      } catch (err) {
        console.error('Load student error:', err)

        if (!mounted) return

        const message =
          err?.message ||
          'Failed to load student information.'

        setError(message)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadStudent()

    return () => {
      mounted = false
    }
  }, [id])

  const handleChange = event => {
    const { name, value } = event.target

    setFormData(previous => ({
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

    const name = formData.name.trim()
    const email = formData.email.trim().toLowerCase()
    const mobile = formData.mobile.trim()
    const semester = Number(formData.semester)
    const cgpa = Number(formData.cgpa)

    /* Frontend validation */

    if (name.length < 2) {
      setError('Please enter a valid student name.')
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
      setError(
        'Please enter a valid 10-digit Indian mobile number.'
      )
      return
    }

    if (semester < 1 || semester > 8) {
      setError('Please select a valid semester.')
      return
    }

    if (
      Number.isNaN(cgpa) ||
      cgpa < 0 ||
      cgpa > 10
    ) {
      setError('CGPA must be between 0 and 10.')
      return
    }

    try {
      setSaving(true)

      await updateStudent(id, {
        studentId: formData.studentId,
        name,
        email,
        mobile,
        branch: formData.branch,
        semester,
        cgpa
      })

      toast.success(
        'Student updated successfully!'
      )

      navigate('/students')
    } catch (err) {
      console.error('Update student error:', err)

      const message =
        err?.message ||
        'Failed to update student.'

      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  /* ======================================================
     LOADING
     ====================================================== */

  if (loading) {
    return (
      <div className="page-state">

        <Loader2
          size={30}
          className="spin"
        />

        <p>
          Loading student information...
        </p>

      </div>
    )
  }

  /* ======================================================
     PAGE
     ====================================================== */

  return (
    <div className="form-page">

      {/* BACK */}

      <button
        type="button"
        className="back-link-button"
        onClick={() => navigate('/students')}
        disabled={saving}
      >
        <ArrowLeft size={16} />
        Back to Students
      </button>


      {/* HEADER */}

      <div className="form-page-header">

        <div>

          <p className="page-eyebrow">
            STUDENT MANAGEMENT
          </p>

          <h1>
            Edit Student
          </h1>

          <p>
            Update personal, academic and contact
            information.
          </p>

        </div>

      </div>


      {/* FORM */}

      <form
        className="professional-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            PERSONAL INFORMATION
            ================================================= */}

        <section className="form-card">

          <div className="form-card-header">

            <div className="form-icon">
              <User size={20} />
            </div>

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Basic identification and contact details
              </p>

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="form-alert error">

              <AlertCircle size={17} />

              <span>
                {error}
              </span>

            </div>
          )}


          <div className="form-grid">

            {/* STUDENT ID */}

            <div className="form-group">

              <label htmlFor="studentId">
                Student ID
              </label>

              <input
                id="studentId"
                name="studentId"
                value={formData.studentId}
                disabled
              />

              <small>
                Student ID cannot be changed.
              </small>

            </div>


            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name <span>*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                autoComplete="name"
                maxLength={100}
                required
                disabled={saving}
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                <Mail size={14} />
                Email Address <span>*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                autoComplete="email"
                maxLength={150}
                required
                disabled={saving}
              />

            </div>


            {/* MOBILE */}

            <div className="form-group">

              <label htmlFor="mobile">
                <Phone size={14} />
                Mobile Number <span>*</span>
              </label>

              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                inputMode="numeric"
                maxLength={10}
                required
                disabled={saving}
              />

              <small>
                Enter a valid 10-digit mobile number.
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            ACADEMIC INFORMATION
            ================================================= */}

        <section className="form-card">

          <div className="form-card-header">

            <div className="form-icon">
              <GraduationCap size={20} />
            </div>

            <div>

              <h2>
                Academic Information
              </h2>

              <p>
                Course and performance details
              </p>

            </div>

          </div>


          <div className="form-grid">

            {/* BRANCH */}

            <div className="form-group">

              <label htmlFor="branch">
                <BookOpen size={14} />
                Branch <span>*</span>
              </label>

              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="CSE">
                  Computer Science & Engineering
                </option>

                <option value="IT">
                  Information Technology
                </option>

                <option value="EXTC">
                  Electronics & Telecommunication
                </option>

                <option value="Mechanical">
                  Mechanical Engineering
                </option>

                <option value="Civil">
                  Civil Engineering
                </option>

                <option value="Electrical">
                  Electrical Engineering
                </option>
              </select>

            </div>


            {/* SEMESTER */}

            <div className="form-group">

              <label htmlFor="semester">
                <GraduationCap size={14} />
                Semester <span>*</span>
              </label>

              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                disabled={saving}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(
                  semester => (
                    <option
                      key={semester}
                      value={semester}
                    >
                      Semester {semester}
                    </option>
                  )
                )}
              </select>

            </div>


            {/* CGPA */}

            <div className="form-group">

              <label htmlFor="cgpa">
                <GraduationCap size={14} />
                CGPA <span>*</span>
              </label>

              <input
                id="cgpa"
                name="cgpa"
                type="number"
                value={formData.cgpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.01"
                placeholder="8.50"
                required
                disabled={saving}
              />

              <small>
                CGPA must be between 0 and 10.
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            ACTIONS
            ================================================= */}

        <div className="form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/students')}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >

            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={17} />

                Save Changes
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  )
}

export default EditStudent