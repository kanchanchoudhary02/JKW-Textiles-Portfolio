import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GitCompare, Share2, Palette } from 'lucide-react'
import ImagePlaceholder from './ImagePlaceholder'
import { FABRICLORE_FABRIC_IMAGES } from '../data/fabricloreImages'
import { API_BASE_URL } from '../config/api'

const FILE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export default function FabricCard({ product, index = 0, className = '', loading = 'lazy' }) {
  const uploadedImage = product.images?.[0] ? `${FILE_ORIGIN}${product.images[0]}` : null
  const fallbackImage = FABRICLORE_FABRIC_IMAGES[index % FABRICLORE_FABRIC_IMAGES.length]

  return (
    <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.08 }} className={`group flex flex-col shrink-0 ${className}`}>
      <Link to={`/fabrics/${product.slug || product._id}`} className="block">
        <div className="img-zoom relative aspect-[4/5] w-full rounded-2xl overflow-hidden">
          <ImagePlaceholder
            label={`${product.name} — swatch photography`}
            image={uploadedImage || fallbackImage}
            fallback={fallbackImage}
            variant="card"
            loading={loading}
            fetchPriority={index === 0 && loading === 'eager' ? 'high' : 'auto'}
            width={480}
            height={600}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 42vw, 72vw"
            className="h-full w-full"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <span className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-ink"><GitCompare size={15} strokeWidth={1.75} /></span>
            <span className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-ink"><Share2 size={15} strokeWidth={1.75} /></span>
          </div>
          {product.colors?.length > 0 && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 z-10">
              <span className="bg-white/95 rounded-full px-3 py-1.5 text-[11px] font-medium text-ink inline-flex items-center gap-1.5">
                <Palette size={12} /> {product.colors.length} colours
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="pt-4 flex flex-col gap-2">
        <Link to={`/fabrics/${product.slug || product._id}`} className="font-medium text-[15px] text-ink leading-snug hover:text-gold transition-colors">{product.name}</Link>
        <p className="text-ink-soft/55 text-[13px]">{product.spec || product.subcategory || product.category}</p>
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 py-1">
            {product.tags.map((tag) => <span key={tag} className="text-[11px] border border-ink/12 rounded-full px-3 py-1 text-ink-soft/70">{tag}</span>)}
          </div>
        )}
        <Link to={`/fabrics/${product.slug || product._id}`} className="mt-1 w-full text-center bg-cream hover:bg-gold hover:text-white transition-colors rounded-full py-3 text-[14px] font-medium text-ink">View Fabric</Link>
      </div>
    </motion.div>
  )
}
