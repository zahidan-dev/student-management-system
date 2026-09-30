import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Settings from './pages/Settings'

import { AuthProvider } from './context/AuthContext'

import ProtectedRoute from './components/ProtectedRoute'

import Layout from './components/Layout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import EditStudent from './pages/EditStudent'

function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Login */}
          <Route path='/login' element={<Login />} />

          {/* Protected Application */}
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Layout />}>
              {/* Dashboard */}
              <Route index element={<Dashboard />} />

              {/* Students */}
              <Route path='students' element={<Students />} />

              {/* Add Student */}
              <Route path='students/add' element={<AddStudent />} />

              {/* Edit Student */}
              <Route path='students/edit/:id' element={<EditStudent />} />

              <Route path='settings' element={<Settings />} />
            </Route>
          </Route>

          {/* Unknown Route */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
