import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Star } from 'lucide-react'
import api, { API_BASE_URL } from '../../config/api'
import { imageVariantUrl } from '../../utils/imageUrl'
import AdminLayout from '../components/AdminLayout'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'

const CATEGORIES = ['All', 'Cotton', 'Linen', 'Rayon', 'Blended', 'Printed', 'Dyed', 'Yarn Dyed', 'Other']
const STATUSES = ['All', 'active', 'inactive']
const FILE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export default function Products() {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1 })
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  async function load(page = 1) {
    setLoading(true)
    try {
      const { data } = await api.get('/products/admin/all', {
        params: { search, category, status, page, limit: 10 },
      })
      setProducts(data.products)
      setPagination(data.pagination)
    } catch {
      setToast({ type: 'error', message: 'Failed to load products' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, status])

  async function handleDelete() {
    try {
      await api.delete(`/products/${deleteTarget._id}`)
      setToast({ type: 'success', message: 'Product deleted successfully' })
      setDeleteTarget(null)
      load(pagination.page)
    } catch {
      setToast({ type: 'error', message: 'Failed to delete product' })
      setDeleteTarget(null)
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl text-ink">Products</h1>
        <Link
          to="/admin/products/add"
          className="flex items-center gap-2 bg-ink hover:bg-[#15155A] text-white text-sm font-medium rounded-lg px-4 py-2.5"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white flex-1 min-w-[200px]">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="outline-none text-sm flex-1"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Colours</th>
              <th className="text-left px-4 py-3">Photos</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Featured</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="text-center py-8 text-slate-400">Loading...</td></tr>
            )}
            {!loading && products.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-slate-400">No products found.</td></tr>
            )}
            {products.map((p) => (
              <tr key={p._id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  {p.images?.[0] ? (
                    <img src={imageVariantUrl(`${FILE_ORIGIN}${p.images[0]}`, 'card')} alt={p.name} loading="lazy" decoding="async" width={48} height={48} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100" />
                  )}
                </td>
                <td className="px-4 py-3 text-slate-800 font-medium max-w-[220px] truncate">{p.name}</td>
                <td className="px-4 py-3 text-slate-500">{p.category}{p.subcategory ? ` / ${p.subcategory}` : ''}</td>
                <td className="px-4 py-3 text-slate-600">{p.colors?.length || 0}</td>
                <td className="px-4 py-3 text-slate-600">{new Set([...(p.images || []), ...(p.colors || []).flatMap((c) => c.images || [])]).size}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.featured && <Star size={16} className="text-amber-500 fill-amber-500" />}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/products/edit/${p._id}`} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => setDeleteTarget(p)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => load(p)}
              className={`w-8 h-8 rounded-lg text-sm ${p === pagination.page ? 'bg-ink text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AdminLayout>
  )
}
