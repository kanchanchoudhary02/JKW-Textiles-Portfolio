import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, CheckCircle, Star, MessageSquareText } from 'lucide-react'
import api from '../../config/api'
import AdminLayout from '../components/AdminLayout'

const CARDS = [
  { key: 'totalProducts', label: 'Total Products', icon: Package, color: 'bg-blue-50 text-blue-600' },
  { key: 'activeProducts', label: 'Active Products', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
  { key: 'featuredProducts', label: 'Featured Products', icon: Star, color: 'bg-amber-50 text-amber-600' },
  { key: 'totalLeads', label: 'Total Leads', icon: MessageSquareText, color: 'bg-purple-50 text-purple-600' },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <h1 className="font-bold text-2xl text-ink mb-6">Dashboard</h1>

      {loading && <p className="text-slate-400 text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {CARDS.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-ink mt-3">{data.stats[key]}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-ink">Recent Products</h2>
                <Link to="/admin/products" className="text-xs text-slate-500 hover:text-slate-800">
                  View all
                </Link>
              </div>
              {data.recentProducts.length === 0 && <p className="text-sm text-slate-400">No products yet.</p>}
              <div className="flex flex-col gap-3">
                {data.recentProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 truncate max-w-[70%]">{p.name}</span>
                    <span className="text-slate-400">{p.colors?.length || 0} colours</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-ink">Recent Leads</h2>
                <Link to="/admin/leads" className="text-xs text-slate-500 hover:text-slate-800">
                  View all
                </Link>
              </div>
              {data.recentLeads.length === 0 && <p className="text-sm text-slate-400">No leads yet.</p>}
              <div className="flex flex-col gap-3">
                {data.recentLeads.map((l) => (
                  <div key={l._id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 truncate max-w-[70%]">{l.name}</span>
                    <span className="text-slate-400">{l.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
