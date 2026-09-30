import { useState } from 'react'
import toast from 'react-hot-toast'
import { Lock, LogOut, User } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import {
  changeAdminPassword
} from '../services/authService'

const Settings = () => {
  const { admin, logout } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [loading, setLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] =
    useState(false)

  const handlePasswordChange = async event => {
    event.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields')
      return
    }

    if (newPassword.length < 8) {
      toast.error(
        'New password must contain at least 8 characters'
      )
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      setLoading(true)

      const response =
        await changeAdminPassword(
          currentPassword,
          newPassword
        )

      toast.success(
        response.message ||
          'Password changed successfully'
      )

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Backend clears the authentication cookie
      // after password change.
      window.location.href = '/login'
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLogoutLoading(true)

      await logout()

      toast.success('Logged out successfully')

      window.location.href = '/login'
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            ACCOUNT
          </span>

          <h1>Settings</h1>

          <p>
            Manage your administrator account and security.
          </p>
        </div>
      </div>

      {/* ADMIN PROFILE */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-icon">
            <User size={20} />
          </div>

          <div>
            <h2>Administrator Profile</h2>

            <p>
              Your StudentHub administrator information.
            </p>
          </div>
        </div>

        <div className="settings-profile">

          <div className="settings-avatar">
            {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>

          <div>
            <h3>
              {admin?.name || 'Administrator'}
            </h3>

            <p>
              {admin?.email || 'admin@studenthub.com'}
            </p>

            <span className="role-badge">
              {admin?.role || 'admin'}
            </span>
          </div>

        </div>

      </div>

      {/* CHANGE PASSWORD */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <Lock size={20} />
          </div>

          <div>
            <h2>Change Password</h2>

            <p>
              Update your administrator password.
            </p>
          </div>

        </div>

        <form
          className="settings-form"
          onSubmit={handlePasswordChange}
        >

          <div className="form-group">
            <label>
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={event =>
                setCurrentPassword(
                  event.target.value
                )
              }
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label>
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={event =>
                setNewPassword(
                  event.target.value
                )
              }
              placeholder="Minimum 8 characters"
            />
          </div>

          <div className="form-group">
            <label>
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={event =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? 'Updating...'
              : 'Update Password'}
          </button>

        </form>

      </div>

      {/* LOGOUT */}

      <div className="settings-card danger-card">

        <div className="settings-card-header">

          <div className="settings-icon danger-icon">
            <LogOut size={20} />
          </div>

          <div>
            <h2>Logout</h2>

            <p>
              Sign out from the StudentHub admin account.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
          disabled={logoutLoading}
        >
          <LogOut size={18} />

          {logoutLoading
            ? 'Logging out...'
            : 'Logout'}
        </button>

      </div>

    </div>
  )
}

export default Settings