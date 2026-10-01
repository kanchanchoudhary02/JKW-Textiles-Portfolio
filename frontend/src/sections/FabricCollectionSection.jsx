import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Sparkle } from 'lucide-react'
import FabricCard from '../components/FabricCard'
import api from '../config/api'

export default function FabricCollectionSection() {
  const scrollerRef = useRef(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/products', { params: { featured: true, limit: 8 } })
      .then(({ data }) => {
        // Fall back to latest active products if nothing is marked featured yet
        if (data.products.length > 0) {
          setProducts(data.products)
        } else {
          return api.get('/products', { params: { limit: 8 } }).then((res) => setProducts(res.data.products))
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const scrollNext = () => {
    scrollerRef.current?.scrollBy({ left: 340, behavior: 'smooth' })
  }

  if (!loading && products.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div className="flex flex-col gap-4">
            <span className="eyebrow-slash flex items-center gap-2">
              <Sparkle size={14} className="text-gold" fill="currentColor" strokeWidth={0} />
              Yarn Dyed & Featured Fabrics
            </span>
            <h2 className="display-heading text-[clamp(1.8rem,4vw,3.2rem)] max-w-2xl">
              Yarn-Dyed Fabrics, Colour Stories & Custom Qualities.
            </h2>
            <p className="text-ink-soft/60 text-base max-w-md">
              Explore our yarn-dyed focus alongside selected dyed, printed and dyeable qualities — each shown with available colour options and photography.
            </p>
          </div>
          <Link to="/fabrics" className="pill-btn-outline shrink-0 w-fit">
            Explore Fabrics
            <span className="pill-icon"><ArrowUpRight size={16} strokeWidth={1.75} /></span>
          </Link>
        </div>

        {loading ? (
          <p className="text-ink-soft/50 text-sm">Loading fabrics...</p>
        ) : (
          <div className="relative">
            <div
              ref={scrollerRef}
              className="flex gap-5 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-5 px-5 md:mx-0 md:px-0"
              style={{ scrollbarWidth: 'none' }}
            >
              {products.map((product, i) => (
                <FabricCard
                  key={product._id}
                  product={product}
                  index={i}
                  className="snap-start w-[72vw] sm:w-[42vw] md:w-[30vw] lg:w-[23%]"
                />
              ))}
            </div>
            <button
              onClick={scrollNext}
              aria-label="Scroll to next fabrics"
              className="hidden md:flex absolute -bottom-2 right-0 translate-y-full w-12 h-12 rounded-full bg-ink text-white items-center justify-center hover:bg-gold transition-colors"
            >
              <ArrowRight size={18} strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
