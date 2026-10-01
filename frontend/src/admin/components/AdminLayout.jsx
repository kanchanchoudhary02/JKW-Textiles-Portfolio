import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, MessageSquareText, LogOut, ExternalLink, Settings, Image, Images } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/leads', label: 'Leads', icon: MessageSquareText },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
  { to: '/admin/media', label: 'Website Images', icon: Image },
  { to: '/admin/catalog', label: 'Catalog Gallery', icon: Images },
]

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-ink text-white flex flex-col fixed inset-y-0 left-0">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-bold text-lg">JKW Textiles</p>
          <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-white text-ink font-medium' : 'text-white/70 hover:bg-white/10'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10"
          >
            <ExternalLink size={17} />
            View Website
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 text-left"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
          <span className="text-sm text-slate-500">
            Signed in as <span className="font-medium text-slate-800">{admin?.name}</span>
          </span>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
