import axios from 'axios'

// Set VITE_API_BASE_URL in your .env file, e.g. VITE_API_BASE_URL=http://localhost:5000/api
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL: API_BASE_URL })

// Attach the admin JWT (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jkw_auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If a protected request comes back 401, the token is invalid/expired — clear it
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jkw_auth_token')
      localStorage.removeItem('jkw_auth_user')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
