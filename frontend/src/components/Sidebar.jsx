import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Settings,
  X
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

const Sidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation()
  const navigation = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard
    },
    {
      name: 'Students',
      path: '/students',
      icon: Users
    },
    {
      name: 'Add Student',
      path: '/students/add',
      icon: GraduationCap
    }
  ]

  return (
    <>
      {mobileOpen && <div className='sidebar-overlay' onClick={onClose} />}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        {/* BRAND */}

        <div className='sidebar-brand'>
          <div className='brand-icon'>
            <GraduationCap size={24} />
          </div>

          <div>
            <h2>StudentHub</h2>
            <span>Management System</span>
          </div>

          <button
            type='button'
            className='mobile-close'
            onClick={onClose}
            aria-label='Close sidebar'
          >
            <X size={20} />
          </button>
        </div>

        {/* MAIN MENU */}

        <div className='sidebar-section'>
          <p className='sidebar-label'>MAIN MENU</p>

          <nav className='sidebar-nav'>
            {navigation.map(item => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={() => {
                    const isActive = location.pathname === item.path

                    return `sidebar-link ${isActive ? 'active' : ''}`
                  }}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* BOTTOM */}

        <div className='sidebar-bottom'>
          <NavLink
            to='/settings'
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>

          <div className='sidebar-user'>
            <div className='avatar'>A</div>

            <div>
              <strong>Administrator</strong>

              <span>System Admin</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
