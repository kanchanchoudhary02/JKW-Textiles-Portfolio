import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Image as ImageIcon, Pencil, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import api, { API_BASE_URL } from '../../config/api'
import AdminLayout from '../components/AdminLayout'

const FILE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')
const urlFor = (path) => path?.startsWith('http') ? path : `${FILE_ORIGIN}${path || ''}`

export default function CatalogGallery() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    api.get('/products/admin/all', { params: { page: 1, limit: 100 } })
      .then(({ data }) => setProducts(data.products || []))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category).filter(Boolean))], [products])

  const assets = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = []
    products.forEach((product) => {
      if (category !== 'All' && product.category !== category) return
      const colors = product.colors || []
      const seen = new Set()
      const add = (path, label, hex) => {
        if (!path || seen.has(path)) return
        seen.add(path)
        list.push({ path, label, hex, product })
      }
      product.images?.forEach((path, i) => add(path, `${product.name} · Photo ${i + 1}`, null))
      colors.forEach((color) => color.images?.forEach((path) => add(path, `${color.name} · ${product.name}`, color.hex)))
    })
    return q ? list.filter((item) => `${item.label} ${item.product.name} ${item.product.subcategory || ''}`.toLowerCase().includes(q)) : list
  }, [products, category, search])

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3"><ImageIcon size={24} /><div><h1 className="font-bold text-2xl text-ink">Catalog Gallery</h1><p className="text-sm text-slate-500 mt-1">Every supplied textile photo is a separate catalogue item, classified by fabric type + visible design.</p></div></div>
        </div>
        <Link to="/admin/products" className="inline-flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2.5 text-sm text-slate-700"><ExternalLink size={15} /> Manage Products</Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white flex-1 min-w-[220px]"><Search size={16} className="text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search colour, pattern or fabric..." className="outline-none text-sm flex-1" /></div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white">{categories.map((c) => <option key={c}>{c}</option>)}</select>
      </div>

      {loading ? <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-400">Loading catalogue photos...</div> : (
        <>
          <div className="flex items-center justify-between mb-4"><p className="text-sm text-slate-500">{assets.length} photo{assets.length === 1 ? '' : 's'} visible</p><p className="text-xs text-slate-400">Click Edit to change category, colour name or images.</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {assets.map((item) => (
              <article key={`${item.product._id}-${item.path}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden group">
                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                  <img src={urlFor(item.path)} alt={item.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  {item.hex && <span className="absolute top-2 right-2 w-7 h-7 rounded-full border-2 border-white shadow" style={{ backgroundColor: item.hex }} title={item.hex} />}
                </div>
                <div className="p-3"><p className="text-[11px] uppercase tracking-wider text-slate-400">{item.product.category} · {item.product.subcategory}</p><h2 className="font-medium text-sm text-slate-800 mt-1 line-clamp-2">{item.label}</h2><Link to={`/admin/products/edit/${item.product._id}`} className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-ink"><Pencil size={13} /> Edit item</Link></div>
              </article>
            ))}
          </div>
          {!assets.length && <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center text-sm text-slate-400">No catalogue photos match this filter.</div>}
        </>
      )}
    </AdminLayout>
  )
}
