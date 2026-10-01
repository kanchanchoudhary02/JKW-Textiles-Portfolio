import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { Lock, Mail, ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user?.role === 'admin' || user?.role === 'superadmin') return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const account = await login(email, password, 'admin')
      if (account?.role === 'admin' || account?.role === 'superadmin') navigate('/admin/dashboard')
      else setError('Admin access is required.')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin login credentials.')
    } finally { setLoading(false) }
  }

  return <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-10 relative overflow-hidden">
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-white/10" />
    <motion.div animate={{ y: [0, 18, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-48 -left-32 w-96 h-96 rounded-full bg-white/[0.025] blur-2xl" />
    <div className="w-full max-w-md relative">
      <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-5 transition-colors"><ArrowLeft size={15} /> Back to website</Link>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-2xl p-7 md:p-8">
        <div className="flex items-center justify-between mb-7"><div><h1 className="font-bold text-2xl text-ink">JKW Textiles</h1><p className="text-sm text-slate-500 mt-1">Admin Panel</p></div><ShieldCheck className="text-ink" size={25} /></div>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input icon={Mail} label="Admin Email" type="email" value={email} onChange={setEmail} placeholder="admin@example.com" />
          <div className="flex flex-col gap-1.5"><span className="text-xs font-medium text-slate-500">Password</span><div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-slate-400"><Lock size={16} className="text-slate-400" /><input required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 outline-none text-sm" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="text-slate-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
          <button type="submit" disabled={loading} className="mt-2 bg-ink hover:bg-[#15155A] disabled:opacity-60 text-white text-sm font-medium rounded-lg py-3 transition-all hover:-translate-y-0.5">{loading ? 'Please wait...' : 'Sign In to Admin'}</button>
        </form>
        <p className="text-[11px] text-slate-400 mt-4 text-center">Admin access is restricted to authorized staff accounts.</p>
      </motion.div>
    </div>
  </div>
}

function Input({ icon: Icon, label, type = 'text', value, onChange, placeholder }) {
  return <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-slate-500">{label}</span><div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-slate-400"><Icon size={16} className="text-slate-400" /><input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 outline-none text-sm" placeholder={placeholder} /></div></label>
}
