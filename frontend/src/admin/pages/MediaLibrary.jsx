import { useEffect, useMemo, useState } from 'react'
import { Image as ImageIcon, Upload, RotateCcw } from 'lucide-react'
import api, { API_BASE_URL } from '../../config/api'
import AdminLayout from '../components/AdminLayout'
import Toast from '../components/Toast'
import { MEDIA_SLOTS } from '../../data/mediaSlots'

const FILE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')
const urlFor = (path) => path?.startsWith('http') ? path : `${FILE_ORIGIN}${path || ''}`

export default function MediaLibrary() {
  const [media, setMedia] = useState({})
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [toast, setToast] = useState(null)
  const [group, setGroup] = useState('All')

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/media/admin')
      setMedia(Object.fromEntries((data.media || []).map((item) => [item.key, item])))
    } catch { setToast({ type: 'error', message: 'Failed to load website images' }) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const groups = useMemo(() => ['All', ...Array.from(new Set(MEDIA_SLOTS.map((s) => s.group)))], [])
  const visibleSlots = group === 'All' ? MEDIA_SLOTS : MEDIA_SLOTS.filter((s) => s.group === group)

  async function upload(slot, file) {
    if (!file) return
    setBusy(slot.key)
    const fd = new FormData()
    fd.append('image', file)
    fd.append('label', slot.label)
    fd.append('group', slot.group)
    fd.append('alt', slot.alt || slot.label)
    try {
      const { data } = await api.post(`/media/${slot.key}`, fd)
      setMedia((prev) => ({ ...prev, [slot.key]: data.media }))
      setToast({ type: 'success', message: `${slot.label} updated` })
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Image upload failed' })
    } finally { setBusy('') }
  }

  async function reset(slot) {
    if (!media[slot.key]) return
    setBusy(slot.key)
    try {
      await api.delete(`/media/${slot.key}`)
      setMedia((prev) => { const next = { ...prev }; delete next[slot.key]; return next })
      setToast({ type: 'success', message: `${slot.label} reset to bundled image` })
    } catch { setToast({ type: 'error', message: 'Could not reset image' }) }
    finally { setBusy('') }
  }

  return (
    <AdminLayout>
      <div className="mb-6"><div className="flex items-center gap-3"><ImageIcon size={24} /><div><h1 className="font-bold text-2xl text-ink">Website Images</h1><p className="text-sm text-slate-500 mt-1">Replace homepage, about, testimonial and client-logo photos without editing code.</p></div></div></div>
      <div className="flex flex-wrap gap-2 mb-6">{groups.map((g) => <button key={g} onClick={() => setGroup(g)} className={`px-4 py-2 rounded-full text-sm ${group === g ? 'bg-ink text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>{g}</button>)}</div>
      {loading ? <p className="text-slate-400 text-sm">Loading images...</p> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{visibleSlots.map((slot) => { const current = media[slot.key]; const src = current?.url ? urlFor(current.url) : slot.fallback; const uploading = busy === slot.key; return <article key={slot.key} className="bg-white border border-slate-200 rounded-xl overflow-hidden"><div className="aspect-[4/3] bg-slate-100">{src ? <img src={src} alt={slot.alt || slot.label} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-400 text-sm">No image yet</div>}</div><div className="p-4"><div className="text-[11px] uppercase tracking-wider text-slate-400">{slot.group}</div><h2 className="font-semibold text-ink mt-1">{slot.label}</h2><div className="flex items-center gap-2 mt-4"><label className={`inline-flex items-center gap-2 bg-ink text-white rounded-lg px-3 py-2 text-xs cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}><Upload size={14} /> {uploading ? 'Uploading...' : 'Replace'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => { upload(slot, e.target.files?.[0]); e.target.value = '' }} /></label>{current && <button type="button" onClick={() => reset(slot)} disabled={uploading} className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 rounded-lg px-3 py-2 text-xs disabled:opacity-50"><RotateCcw size={14} /> Reset</button>}</div></div></article> })}</div>}
      <p className="text-xs text-slate-400 mt-6">Recommended: JPG, PNG or WEBP. Keep photos reasonably compressed for faster page loading.</p>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AdminLayout>
  )
}
