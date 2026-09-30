const API_URL = 'http://localhost:5000/api/auth'

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      email,
      password
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Login failed')
  }

  return data
}

export const getCurrentAdmin = async () => {
  const response = await fetch(`${API_URL}/me`, {
    credentials: 'include'
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Not authenticated')
  }

  return data
}

export const logoutAdmin = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include'
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Logout failed')
  }

  return data
}

export const changeAdminPassword = async (
  currentPassword,
  newPassword
) => {
  const response = await fetch(`${API_URL}/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      currentPassword,
      newPassword
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Password change failed')
  }

  return data
}