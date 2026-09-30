import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to='/' replace />
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!email.trim() || !password) {
      toast.error('Please enter email and password')
      return
    }

    try {
      setLoading(true)

      await login(email.trim(), password)

      toast.success('Welcome back, Administrator!')
    } catch (error) {
      toast.error(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-page'>
      {/* LEFT BRAND PANEL */}

      <div className='login-brand-panel'>
        <div className='login-brand'>
          <div className='login-brand-icon'>
            <GraduationCap size={30} />
          </div>

          <div>
            <h1>StudentHub</h1>
            <span>Management System</span>
          </div>
        </div>

        <div className='login-brand-content'>
          <div className='login-shield'>
            <ShieldCheck size={25} />
          </div>

          <h2>
            Manage your students
            <br />
            with confidence.
          </h2>

          <p>
            A centralized administration platform for managing students,
            academic records, and performance.
          </p>
        </div>

        <div className='login-brand-footer'>
          <span>© 2026 StudentHub</span>
          <span>Secure Admin Portal</span>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}

      <div className='login-form-panel'>
        <div className='login-card'>
          <div className='login-mobile-brand'>
            <div className='login-brand-icon'>
              <GraduationCap size={25} />
            </div>

            <div>
              <strong>StudentHub</strong>
              <span>Management System</span>
            </div>
          </div>

          <div className='login-heading'>
            <span className='login-eyebrow'>ADMIN PORTAL</span>

            <h2>Welcome back</h2>

            <p>Sign in to access your StudentHub dashboard.</p>
          </div>

          <form className='login-form' onSubmit={handleSubmit}>
            {/* EMAIL */}

            <div className='login-field'>
              <label htmlFor='email'>Email address</label>

              <div className='login-input-wrapper'>
                <Mail size={18} />

                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder='admin@studenthub.com'
                  autoComplete='email'
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className='login-field'>
              <div className='login-label-row'>
                <label htmlFor='password'>Password</label>
              </div>

              <div className='login-input-wrapper'>
                <Lock size={18} />

                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder='Enter your password'
                  autoComplete='current-password'
                  disabled={loading}
                />

                <button
                  type='button'
                  className='password-toggle'
                  onClick={() => setShowPassword(previous => !previous)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}

            <button type='submit' className='login-submit' disabled={loading}>
              {loading ? (
                <>
                  <span className='login-spinner' />
                  Signing in...
                </>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>

          <div className='login-security'>
            <ShieldCheck size={16} />

            <span>
              Your connection is secured with administrator authentication.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
