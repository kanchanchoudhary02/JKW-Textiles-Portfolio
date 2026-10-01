import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import api from '../../config/api'
import AdminLayout from '../components/AdminLayout'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'

const STATUSES = ['New', 'Contacted', 'Converted', 'Closed']
const STATUS_COLORS = {
  New: 'bg-blue-50 text-blue-600',
  Contacted: 'bg-amber-50 text-amber-600',
  Converted: 'bg-emerald-50 text-emerald-600',
  Closed: 'bg-slate-100 text-slate-500',
}

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/leads', { params: { status: statusFilter, limit: 50 } })
      setLeads(data.leads)
    } catch {
      setToast({ type: 'error', message: 'Failed to load leads' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  async function updateStatus(leadId, status) {
    try {
      await api.put(`/leads/${leadId}`, { status })
      setLeads((prev) => prev.map((l) => (l._id === leadId ? { ...l, status } : l)))
      setToast({ type: 'success', message: 'Lead updated successfully' })
    } catch {
      setToast({ type: 'error', message: 'Failed to update lead' })
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/leads/${deleteTarget._id}`)
      setLeads((prev) => prev.filter((l) => l._id !== deleteTarget._id))
      setToast({ type: 'success', message: 'Lead deleted successfully' })
    } catch {
      setToast({ type: 'error', message: 'Failed to delete lead' })
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-ink">Leads</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="All">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Message</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="text-center py-8 text-slate-400">Loading...</td></tr>}
            {!loading && leads.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-slate-400">No leads found.</td></tr>}
            {leads.map((l) => (
              <tr key={l._id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 text-slate-800 font-medium">{l.name}</td>
                <td className="px-4 py-3 text-slate-500">{l.email}</td>
                <td className="px-4 py-3 text-slate-500">{l.phone || '—'}</td>
                <td className="px-4 py-3 text-slate-500 max-w-[260px] truncate" title={l.message}>{l.message}</td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <select
                    value={l.status}
                    onChange={(e) => updateStatus(l._id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs border-0 outline-none ${STATUS_COLORS[l.status]}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setDeleteTarget(l)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Lead"
        message={`Are you sure you want to delete the enquiry from "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AdminLayout>
  )
}
