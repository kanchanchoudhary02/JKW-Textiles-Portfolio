import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Palette, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import api, { API_BASE_URL } from '../config/api'

const FILE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')
const toUrl = (path) => (path?.startsWith('http') ? path : `${FILE_ORIGIN}${path || ''}`)

export default function FabricDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [activeColor, setActiveColor] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product)
        setActiveColor(null)
        setActiveImage(0)
      })
      .catch(() => setError('Fabric not found.'))
      .finally(() => setLoading(false))
  }, [slug])

  const gallery = useMemo(() => {
    if (!product) return []
    if (activeColor !== null && product.colors?.[activeColor]?.images?.length) return product.colors[activeColor].images
    return product.images?.length ? product.images : (product.colors?.[0]?.images || [])
  }, [product, activeColor])

  useEffect(() => { setActiveImage(0) }, [activeColor])

  if (loading) return <section className="container max-w-container py-24 text-ink-soft/60">Loading fabric...</section>
  if (error || !product) return <section className="container max-w-container py-24"><p className="text-ink-soft/60">{error || 'Fabric not found.'}</p><Link to="/fabrics" className="pill-btn mt-5">Back to Fabrics</Link></section>

  const selected = activeColor !== null ? product.colors?.[activeColor] : null
  const image = gallery[activeImage]

  return (
    <>
      <section className="bg-cream py-8 md:py-12">
        <div className="container max-w-container">
          <Link to="/fabrics" className="inline-flex items-center gap-2 text-sm text-ink-soft/60 hover:text-ink"><ArrowLeft size={15} /> Back to Fabrics</Link>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container max-w-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] rounded-[28px] overflow-hidden bg-cream border border-ink/8">
              {image ? <img src={toUrl(image)} alt={`${product.name}${selected ? ` - ${selected.name}` : ''}`} className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center text-ink-soft/50">No image uploaded</div>}
            </div>
            {gallery.length > 1 && <div className="grid grid-cols-5 gap-3 mt-3">{gallery.map((img, i) => <button key={`${img}-${i}`} onClick={() => setActiveImage(i)} className={`aspect-square rounded-xl overflow-hidden border-2 ${i === activeImage ? 'border-gold' : 'border-ink/8'}`}><img src={toUrl(img)} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" /></button>)}</div>}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="eyebrow-slash">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}</span>
            <h1 className="display-heading text-[clamp(2rem,5vw,4rem)]">{product.name}</h1>
            {product.spec && <p className="text-ink-soft/60">{product.spec}</p>}
            {product.description && <p className="text-ink-soft/75 leading-relaxed">{product.description}</p>}

            {product.colors?.length > 0 && (
              <div className="pt-4 border-t border-ink/10">
                <div className="flex items-center gap-2 mb-4"><Palette size={17} className="text-gold" /><span className="font-medium text-ink">Available Colours</span></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.colors.map((color, i) => (
                    <button key={color._id || `${color.name}-${i}`} onClick={() => setActiveColor(i)} className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${activeColor === i ? 'border-gold ring-1 ring-gold/30' : 'border-ink/10 hover:border-ink/30'}`}>
                      <span className="w-10 h-10 rounded-lg overflow-hidden border border-black/10 shrink-0 bg-white">{color.images?.[0] ? <img src={toUrl(color.images[0])} alt={color.name} className="w-full h-full object-cover" /> : <span className="block w-full h-full" style={{ backgroundColor: color.hex }} />}</span>
                      <span className="text-xs font-medium text-ink leading-tight">{color.name}</span>
                    </button>
                  ))}
                </div>
                {selected && <p className="text-xs text-ink-soft/55 mt-3">Showing {selected.name} — {selected.images?.length || 0} photo(s).</p>}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-3">
              <div className="flex items-center gap-2 text-sm text-ink-soft/70"><CheckCircle2 size={16} className="text-gold" /> Portfolio / sourcing catalogue</div>
              <Link to={`/contact?product=${product._id}`} className="pill-btn w-fit">Enquire About This Fabric <span className="pill-icon"><ArrowUpRight size={16} /></span></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
