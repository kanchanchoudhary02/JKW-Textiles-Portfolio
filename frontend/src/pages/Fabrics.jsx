import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, Search, X } from 'lucide-react'
import FabricCard from '../components/FabricCard'
import api from '../config/api'
import { FABRIC_CATEGORIES } from '../data/fabrics'

export default function Fabrics() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [active, setActive] = useState('All')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    setQuery(searchParams.get('search') || '')
    const cat = searchParams.get('category')
    if (cat && FABRIC_CATEGORIES.includes(cat)) setActive(cat)
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    api
      .get('/products', { params: { category: active, search: searchParams.get('search') || undefined, limit: 100 } })
      .then(({ data }) => {
        if (!cancelled) setProducts(data.products)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load fabrics. Please try again in a moment.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [active, searchParams])

  return (
    <>
      <section className="bg-cream pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="container max-w-container">
          <span className="eyebrow-slash">The Collection</span>
          <h1 className="display-heading text-[clamp(2.2rem,5.5vw,4.2rem)] mt-6 max-w-3xl">
            Explore Our Textile Collection
          </h1>
          <p className="text-ink-soft/70 text-base md:text-lg leading-relaxed max-w-xl mt-6">
            Browse a working selection of our range. Every fabric shown here is available in custom shades,
            widths and minimums — get in touch for a full shade card and swatch set.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-container">
          <form
            onSubmit={(e) => { e.preventDefault(); const value = query.trim(); navigate(`/fabrics${value ? `?search=${encodeURIComponent(value)}` : ''}`) }}
            className="mb-6 flex items-center gap-3 border border-ink/15 rounded-full px-4 py-2.5 max-w-xl bg-white"
          >
            <Search size={17} className="text-ink-soft/50" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fabrics, yarn dyed, cotton..." className="flex-1 outline-none text-sm bg-transparent" />
            {query && <button type="button" onClick={() => { setQuery(''); navigate('/fabrics') }} className="text-ink-soft/50 hover:text-ink"><X size={15} /></button>}
            <button type="submit" className="bg-ink text-white rounded-full px-4 py-1.5 text-xs">Search</button>
          </form>

          <div className="flex flex-wrap gap-3 mb-12 md:mb-16 border-b border-ink/10 pb-8">
            {FABRIC_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 ${
                  active === cat ? 'bg-ink text-white' : 'border border-ink/15 text-ink-soft/70 hover:border-ink/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-ink-soft/50 gap-3">
              <Loader2 size={22} className="animate-spin" />
              <p className="text-sm">Loading fabrics...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 text-ink-soft/60 gap-3 text-center">
              <AlertCircle size={22} className="text-coral" />
              <p className="text-sm max-w-sm">{error}</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 md:gap-x-6 gap-y-10 md:gap-y-12">
              {products.map((product, i) => (
                <FabricCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-ink-soft/60 text-sm py-20 text-center">
              No fabrics in this category yet — get in touch and we'll help you source it directly.
            </motion.p>
          )}
        </div>
      </section>
    </>
  )
}
