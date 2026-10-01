import { createContext, useContext, useEffect, useState } from 'react'
import api from '../../config/api'

const AuthContext = createContext(null)
const TOKEN_KEY = 'jkw_auth_token'
const USER_KEY = 'jkw_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const saved = localStorage.getItem(USER_KEY)
    if (token && saved) {
      try { setUser(JSON.parse(saved)) } catch { localStorage.removeItem(USER_KEY) }
      api.get('/auth/me').catch(() => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setUser(null) })
    }
    setLoading(false)
  }, [])

  async function login(email, password, accountType = 'user') {
    const { data } = await api.post('/auth/login', { email, password, accountType })
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const admin = user?.role === 'admin' || user?.role === 'superadmin' ? user : null
  return <AuthContext.Provider value={{ user, admin, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
