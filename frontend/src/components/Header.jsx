import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  User
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const menuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

  const handleLogout = async () => {
    try {
      setLogoutLoading(true)

      await logout()

      toast.success('Logged out successfully')

      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Logout failed')
    } finally {
      setLogoutLoading(false)
      setMenuOpen(false)
    }
  }

  const adminName = admin?.name || 'Administrator'
  const adminEmail =
    admin?.email || 'admin@studenthub.com'

  const avatarLetter =
    adminName.charAt(0).toUpperCase()

  return (
    <header className="top-header">

      {/* SEARCH */}

      <div className="header-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search anything..."
        />
      </div>

      {/* ACTIONS */}

      <div className="header-actions">

        {/* NOTIFICATIONS */}

        <button
          type="button"
          className="icon-button"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="notification-dot" />
        </button>

        {/* ADMIN MENU */}

        <div
          className="header-user-wrapper"
          ref={menuRef}
        >

          <button
            type="button"
            className="header-user"
            onClick={() =>
              setMenuOpen(previous => !previous)
            }
            aria-expanded={menuOpen}
          >

            <div className="avatar">
              {avatarLetter}
            </div>

            <div className="header-user-info">
              <strong>
                {adminName}
              </strong>

              <span>
                Administrator
              </span>
            </div>

            <ChevronDown
              size={16}
              className={`header-chevron ${
                menuOpen ? 'open' : ''
              }`}
            />

          </button>

          {/* DROPDOWN */}

          {menuOpen && (
            <div className="admin-dropdown">

              <div className="dropdown-profile">

                <div className="dropdown-avatar">
                  {avatarLetter}
                </div>

                <div>
                  <strong>
                    {adminName}
                  </strong>

                  <span>
                    {adminEmail}
                  </span>
                </div>

              </div>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/settings')
                }}
              >
                <Settings size={17} />

                <span>
                  Settings
                </span>
              </button>

              <button
                type="button"
                className="dropdown-item dropdown-logout"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                <LogOut size={17} />

                <span>
                  {logoutLoading
                    ? 'Logging out...'
                    : 'Logout'}
                </span>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  )
}

export default Header