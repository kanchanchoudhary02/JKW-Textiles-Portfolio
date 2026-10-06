import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, Search, X } from 'lucide-react'
import FabricCard from '../components/FabricCard'
import api from '../config/api'
import { FABRIC_CATEGORIES } from '../data/fabrics'

const PAGE_SIZE = 12

export default function Fabrics() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [active, setActive] = useState(() => {
    const category = searchParams.get('category')
    return FABRIC_CATEGORIES.includes(category) ? category : 'All'
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')
  const [loadMoreError, setLoadMoreError] = useState(false)
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const sentinelRef = useRef(null)
  const requestInProgress = useRef(false)
  const nextPage = useRef(2)
  const hasMoreRef = useRef(false)
  const queryVersion = useRef(0)
  const searchTerm = searchParams.get('search') || ''

  useEffect(() => {
    setQuery(searchTerm)
    const cat = searchParams.get('category')
    setActive(cat && FABRIC_CATEGORIES.includes(cat) ? cat : 'All')
  }, [searchParams, searchTerm])

  useEffect(() => {
    let cancelled = false
    const version = ++queryVersion.current
    requestInProgress.current = false
    nextPage.current = 2
    hasMoreRef.current = false
    setLoading(true)
    setError('')
    setLoadingMore(false)
    setHasMore(false)
    setLoadMoreError(false)
    setProducts([])

    api
      .get('/products', { params: { category: active, search: searchTerm || undefined, page: 1, limit: PAGE_SIZE } })
      .then(({ data }) => {
        if (!cancelled && version === queryVersion.current) {
          setProducts(data.products || [])
          const moreAvailable = (data.pagination?.pages || 1) > 1
          hasMoreRef.current = moreAvailable
          setHasMore(moreAvailable)
        }
      })
      .catch(() => {
        if (!cancelled && version === queryVersion.current) setError('Failed to load fabrics. Please try again in a moment.')
      })
      .finally(() => {
        if (!cancelled && version === queryVersion.current) setLoading(false)
      })

    return () => { cancelled = true }
  }, [active, searchTerm])

  const loadNextPage = useCallback(async (retry = false) => {
    if (loadMoreError && !retry) return
    if (requestInProgress.current || !hasMoreRef.current) return
    requestInProgress.current = true
    const version = queryVersion.current
    const page = nextPage.current
    setLoadingMore(true)
    setLoadMoreError(false)

    try {
      const { data } = await api.get('/products', {
        params: { category: active, search: searchTerm || undefined, page, limit: PAGE_SIZE },
      })
      if (version !== queryVersion.current) return
      setProducts((current) => [...current, ...(data.products || [])])
      nextPage.current = page + 1
      const moreAvailable = page < (data.pagination?.pages || page)
      hasMoreRef.current = moreAvailable
      setHasMore(moreAvailable)
    } catch {
      if (version === queryVersion.current) setLoadMoreError(true)
    } finally {
      if (version === queryVersion.current) {
        requestInProgress.current = false
        setLoadingMore(false)
      }
    }
  }, [active, loadMoreError, searchTerm])

  useEffect(() => {
    if (loading || !hasMore || !sentinelRef.current) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadNextPage() },
      { rootMargin: '400px 0px' }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, loadNextPage, products.length, loadingMore])

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
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 md:gap-x-6 gap-y-10 md:gap-y-12">
                {products.map((product, i) => (
                  <FabricCard key={product._id} product={product} index={i} loading={i < 4 ? 'eager' : 'lazy'} />
                ))}
              </div>
              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-10 text-ink-soft/50">
                  {loadingMore && <Loader2 size={20} className="animate-spin" aria-label="Loading more fabrics" />}
                  {loadMoreError && <button type="button" onClick={() => loadNextPage(true)} className="text-sm hover:text-ink">Could not load more fabrics. Try again.</button>}
                </div>
              )}
            </>
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
