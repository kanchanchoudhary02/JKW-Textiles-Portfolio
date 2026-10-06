import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, Upload, Plus, Palette, Trash2 } from 'lucide-react'
import api, { API_BASE_URL } from '../../config/api'
import { imageVariantUrl } from '../../utils/imageUrl'
import AdminLayout from '../components/AdminLayout'
import Toast from '../components/Toast'

const CATEGORIES = ['Cotton', 'Linen', 'Rayon', 'Blended', 'Printed', 'Dyed', 'Yarn Dyed', 'Other']
const FILE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')
const EMPTY = { name: '', description: '', category: 'Dyed', subcategory: '', spec: '', sku: '', featured: false, status: 'active', tags: '' }
const newId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [existingMainImages, setExistingMainImages] = useState([])
  const [newMainFiles, setNewMainFiles] = useState([])
  const [colors, setColors] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    api.get(`/products/${id}`).then(({ data }) => {
      const p = data.product
      setForm({
        name: p.name || '', description: p.description || '', category: p.category || 'Dyed', subcategory: p.subcategory || '', spec: p.spec || '', sku: p.sku || '', featured: !!p.featured, status: p.status || 'active', tags: (p.tags || []).join(', '),
      })
      setExistingMainImages(p.images || [])
      setColors((p.colors || []).map((c) => ({ id: c._id || newId(), name: c.name || '', hex: c.hex || '#1A1A70', existingImages: c.images || [], newFiles: [] })))
    }).catch(() => setToast({ type: 'error', message: 'Failed to load fabric' })).finally(() => setLoading(false))
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function addMainFiles(files) {
    const selectedFiles = Array.from(files || [])
    setNewMainFiles((prev) => [...prev, ...selectedFiles].slice(0, 6 - existingMainImages.length))
  }

  function addColor() {
    setColors((prev) => [...prev, { id: newId(), name: '', hex: '#1A1A70', existingImages: [], newFiles: [] }])
  }

  function updateColor(id, patch) {
    setColors((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c))
  }

  function removeColor(id) {
    setColors((prev) => prev.filter((c) => c.id !== id))
  }

  function addColorFiles(id, files) {
    const selectedFiles = Array.from(files || [])
    setColors((prev) => prev.map((c) => {
      if (c.id !== id) return c
      const remaining = Math.max(0, 4 - c.existingImages.length - c.newFiles.length)
      return { ...c, newFiles: [...c.newFiles, ...selectedFiles].slice(0, remaining) }
    }))
  }

  function removeExistingMain(path) { setExistingMainImages((prev) => prev.filter((p) => p !== path)) }
  function removeNewMain(index) { setNewMainFiles((prev) => prev.filter((_, i) => i !== index)) }
  function removeExistingColorImage(colorId, path) { setColors((prev) => prev.map((c) => c.id === colorId ? { ...c, existingImages: c.existingImages.filter((p) => p !== path) } : c)) }
  function removeNewColorImage(colorId, index) { setColors((prev) => prev.map((c) => c.id === colorId ? { ...c, newFiles: c.newFiles.filter((_, i) => i !== index) } : c)) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return setToast({ type: 'error', message: 'Fabric name is required' })
    const invalidColor = colors.find((c) => !c.name.trim())
    if (invalidColor) return setToast({ type: 'error', message: 'Please enter a name for every colour' })

    setSaving(true)
    const fd = new FormData()
    fd.append('name', form.name.trim())
    fd.append('description', form.description)
    fd.append('category', form.category)
    fd.append('subcategory', form.subcategory)
    fd.append('spec', form.spec)
    fd.append('sku', form.sku)
    fd.append('featured', form.featured)
    fd.append('status', form.status)
    fd.append('tags', JSON.stringify(form.tags.split(',').map((x) => x.trim()).filter(Boolean)))
    fd.append('keepImages', JSON.stringify(existingMainImages))
    newMainFiles.forEach((file) => fd.append('mainImages', file))

    let colorFileIndex = 0
    const colorPayload = colors.map((color) => {
      const indexes = color.newFiles.map(() => colorFileIndex++)
      color.newFiles.forEach((file) => fd.append('colorImages', file))
      return { name: color.name.trim(), hex: color.hex, images: color.existingImages, newImageIndexes: indexes }
    })
    fd.append('colors', JSON.stringify(colorPayload))

    try {
      if (isEdit) await api.put(`/products/${id}`, fd)
      else await api.post('/products', fd)
      navigate('/admin/products')
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to save fabric' })
    } finally { setSaving(false) }
  }

  if (loading) return <AdminLayout><p className="text-slate-400 text-sm">Loading...</p></AdminLayout>

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4"><div><h1 className="font-bold text-2xl text-ink">{isEdit ? 'Edit Fabric' : 'Add Fabric'}</h1><p className="text-sm text-slate-500 mt-1">Portfolio catalogue only — no pricing is required.</p></div></div>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-5xl">
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-semibold text-ink mb-5">Fabric Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Fabric Name" name="name" value={form.name} onChange={handleChange} required />
            <Field label="SKU / Reference" name="sku" value={form.sku} onChange={handleChange} />
            <SelectField label="Fabric Type" name="category" value={form.category} onChange={handleChange} options={CATEGORIES} />
            <Field label="Design / Pattern" name="subcategory" value={form.subcategory} onChange={handleChange} />
            <Field label="Fabric + Design Specification" name="spec" value={form.spec} onChange={handleChange} />
            <Field label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} />
          </div>
          <label className="flex flex-col gap-1.5 mt-5"><span className="text-xs font-medium text-slate-500">Description</span><textarea name="description" rows={4} value={form.description} onChange={handleChange} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none" /></label>
          <div className="flex flex-wrap items-center gap-6 mt-5">
            <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Show on homepage</label>
            <SelectField label="Status" name="status" value={form.status} onChange={handleChange} options={['active', 'inactive']} inline />
          </div>
        </section>

        <ImageUploadSection title="Main Fabric Photos" hint="Use 1–6 photos. The first image becomes the main catalogue image." existing={existingMainImages} newFiles={newMainFiles} onAdd={addMainFiles} onRemoveExisting={removeExistingMain} onRemoveNew={removeNewMain} />

        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4 mb-5"><div><h2 className="font-semibold text-ink flex items-center gap-2"><Palette size={18} /> Available Colours</h2><p className="text-xs text-slate-500 mt-1">Each colour can have up to 4 photos. Visitors can select a colour and view its photos.</p></div><button type="button" onClick={addColor} className="inline-flex items-center gap-2 bg-ink text-white rounded-lg px-4 py-2.5 text-sm"><Plus size={16} /> Add Colour</button></div>
          {colors.length === 0 && <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-sm text-slate-400">No colours added yet. Add one to show colour options on the fabric detail page.</div>}
          <div className="space-y-5">
            {colors.map((color, colorIndex) => <ColorEditor key={color.id} color={color} index={colorIndex} onUpdate={updateColor} onRemove={removeColor} onAddFiles={addColorFiles} onRemoveExistingImage={removeExistingColorImage} onRemoveNewImage={removeNewColorImage} />)}
          </div>
        </section>

        <div className="flex gap-3"><button type="submit" disabled={saving} className="bg-ink hover:bg-[#15155A] disabled:opacity-60 text-white text-sm font-medium rounded-lg px-5 py-2.5">{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Fabric'}</button><button type="button" onClick={() => navigate('/admin/products')} className="border border-slate-200 text-slate-600 text-sm font-medium rounded-lg px-5 py-2.5">Cancel</button></div>
      </form>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AdminLayout>
  )
}

function ImagePreview({ file, alt, className }) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setSrc(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return src ? <img src={src} alt={alt} loading="lazy" decoding="async" className={className} /> : <div className={`${className} bg-slate-100`} />
}

function ImageUploadSection({ title, hint, existing, newFiles, onAdd, onRemoveExisting, onRemoveNew }) {
  const canAdd = existing.length + newFiles.length < 6
  return <section className="bg-white border border-slate-200 rounded-xl p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold text-ink">{title}</h2><p className="text-xs text-slate-500 mt-1">{hint}</p></div>{canAdd && <label className="inline-flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-slate-500"><Upload size={15} /> Upload<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={(e) => { const files = Array.from(e.target.files || []); e.target.value = ''; onAdd(files) }} /></label>}</div><div className="flex flex-wrap gap-3 mt-5">{existing.map((path) => <div key={path} className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200"><img src={imageVariantUrl(`${FILE_ORIGIN}${path}`, 'section')} alt="" loading="lazy" decoding="async" width={112} height={112} className="w-full h-full object-cover" /><button type="button" onClick={() => onRemoveExisting(path)} className="absolute top-1 right-1 bg-ink text-white rounded-full p-1"><X size={12} /></button></div>)}{newFiles.map((file, idx) => <div key={`${file.name}-${idx}`} className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200"><ImagePreview file={file} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => onRemoveNew(idx)} className="absolute top-1 right-1 bg-ink text-white rounded-full p-1"><X size={12} /></button></div>)}</div></section>
}

function ColorEditor({ color, index, onUpdate, onRemove, onAddFiles, onRemoveExistingImage, onRemoveNewImage }) {
  const total = color.existingImages.length + color.newFiles.length
  return <div className="border border-slate-200 rounded-xl p-5">
    <div className="flex items-start justify-between gap-4"><div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3 flex-1"><Field label={`Colour ${index + 1} Name`} value={color.name} onChange={(e) => onUpdate(color.id, { name: e.target.value })} /><label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-slate-500">Swatch Colour</span><div className="flex gap-2"><input type="color" value={color.hex} onChange={(e) => onUpdate(color.id, { hex: e.target.value })} className="h-10 w-12 p-1 border border-slate-200 rounded-lg bg-white" /><input value={color.hex} onChange={(e) => onUpdate(color.id, { hex: e.target.value })} className="border border-slate-200 rounded-lg px-2 py-2 text-xs w-full" /></div></label></div><button type="button" onClick={() => onRemove(color.id)} className="text-slate-400 hover:text-red-600 p-1" title="Remove colour"><Trash2 size={17} /></button></div>
    <div className="flex flex-wrap gap-3 mt-4">{color.existingImages.map((path) => <div key={path} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200"><img src={imageVariantUrl(`${FILE_ORIGIN}${path}`, 'section')} alt={color.name} loading="lazy" decoding="async" width={96} height={96} className="w-full h-full object-cover" /><button type="button" onClick={() => onRemoveExistingImage(color.id, path)} className="absolute top-1 right-1 bg-ink text-white rounded-full p-1"><X size={11} /></button></div>)}{color.newFiles.map((file, idx) => <div key={`${file.name}-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200"><ImagePreview file={file} alt={color.name} className="w-full h-full object-cover" /><button type="button" onClick={() => onRemoveNewImage(color.id, idx)} className="absolute top-1 right-1 bg-ink text-white rounded-full p-1"><X size={11} /></button></div>)}{total < 4 && <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs cursor-pointer hover:border-slate-500"><Upload size={18} /> Add photo<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={(e) => { const files = Array.from(e.target.files || []); e.target.value = ''; onAddFiles(color.id, files) }} className="hidden" /></label>}</div>
    <p className="text-[11px] text-slate-400 mt-3">{total}/4 photos</p>
  </div>
}

function Field({ label, name, type = 'text', value = '', onChange, required }) { return <label className="flex flex-col gap-1.5"><span className="text-xs font-medium text-slate-500">{label}{required && <span className="text-red-500"> *</span>}</span><input type={type} name={name} value={value ?? ''} onChange={onChange} required={required} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400" /></label> }
function SelectField({ label, name, value, onChange, options, inline = false }) { return <label className={`flex ${inline ? 'items-center gap-2' : 'flex-col gap-1.5'}`}><span className="text-xs font-medium text-slate-500">{label}</span><select name={name} value={value} onChange={onChange} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white">{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label> }
