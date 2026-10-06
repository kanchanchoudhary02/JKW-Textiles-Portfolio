import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { FABRICLORE_IMAGES } from '../data/fabricloreImages'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { imageVariantUrl } from '../utils/imageUrl'

const imageByLabel = (label = '') => {
  const l = label.toLowerCase()
  if (l.includes('hero —') || l.includes('hero ')) return { key: 'home-hero', fallback: '/home-gallery/home-textile-01.webp' }
  if (l === 'client headshot') return { key: 'home-client-portrait', fallback: '/home-gallery/home-textile-08.webp' }
  if (l.includes('client headshot — testimonial 1')) return { key: 'testimonial-1', fallback: '/home-gallery/home-textile-08.webp' }
  if (l.includes('client headshot — testimonial 2')) return { key: 'testimonial-2', fallback: '/home-gallery/home-textile-08.webp' }
  if (l.includes('client headshot — testimonial 3')) return { key: 'testimonial-3', fallback: '/home-gallery/home-textile-08.webp' }
  if (l.includes('client headshot — testimonial 4')) return { key: 'testimonial-4', fallback: FABRICLORE_IMAGES.brand1 }
  if (l.includes('client portrait — testimonial feature 1')) return { key: 'testimonial-feature-1', fallback: FABRICLORE_IMAGES.brand2 }
  if (l.includes('client portrait — testimonial feature 2')) return { key: 'testimonial-feature-2', fallback: FABRICLORE_IMAGES.brand4 }
  if (l.includes('facility') || l.includes('workshop')) return { key: 'about-facility', fallback: '/home-gallery/home-textile-04.webp' }
  if (l.includes('founder') || l.includes('owner portrait')) return { key: 'about-founder', fallback: '/home-gallery/home-textile-08.webp' }
  if (l.includes('sourcing consultant')) return { key: 'home-contact-consultant', fallback: '/home-gallery/home-textile-08.webp' }
  if (l.includes('dashboard') || l.includes('laptop')) return { key: 'home-smarter-dashboard', fallback: '/home-gallery/home-textile-09.webp' }
  if (l.includes('consultation') || l.includes('relationship manager')) return { key: 'home-smarter-consultation', fallback: '/home-gallery/home-textile-08.webp' }
  if (l.includes('finished printed fabric')) return { key: 'home-sourcing-finished', fallback: '/home-gallery/home-textile-02.webp' }
  if (l.includes('design sketch') || l.includes('swatch')) return { key: 'home-sourcing-swatch', fallback: '/home-gallery/home-textile-03.webp' }
  if (l.includes('flowing dyed fabric')) return { key: 'home-made-to-order-2', fallback: '/home-gallery/home-textile-06.webp' }
  if (l.includes('flowing fabric')) return { key: 'home-story-flowing', fallback: '/home-gallery/home-textile-06.webp' }
  if (l.includes('person holding fabric')) return { key: 'home-story-person', fallback: '/home-gallery/home-textile-02.webp' }
  if (l.includes('fabric roll') || l.includes('fabric stacks') || l.includes('greige')) return { key: 'home-sourcing-fabric-sourcing', fallback: '/home-gallery/home-textile-04.webp' }
  if (l.includes('weaving') || l.includes('loom')) return { key: 'home-sourcing-weaving', fallback: '/home-gallery/home-textile-01.webp' }
  if (l.includes('hanging dyed')) return { key: 'home-dyed-2', fallback: '/home-gallery/home-textile-04.webp' }
  if (l.includes('dyeing') || l.includes('dyed')) return { key: l.includes('dyed fabric') ? 'home-dyed-1' : 'home-sourcing-dyeing', fallback: '/home-gallery/home-textile-05.webp' }
  if (l.includes('quality inspection')) return { key: 'home-sourcing-quality', fallback: '/home-gallery/home-textile-03.webp' }
  if (l.includes('finishing') || l.includes('inspection')) return { key: 'home-sourcing-finishing', fallback: '/home-gallery/home-textile-07.webp' }
  if (l.includes('made to order')) return { key: 'home-made-to-order-1', fallback: '/home-gallery/home-textile-04.webp' }
  if (l.includes('texture close-up')) return { key: 'home-dyeable-2', fallback: '/home-gallery/home-textile-03.webp' }
  if (l.includes('dyeable')) return { key: 'home-dyeable-1', fallback: '/home-gallery/home-textile-10.webp' }
  return { key: null, fallback: null }
}

export default function ImagePlaceholder({
  label = 'Replace with photography',
  alt = label,
  className = '',
  dark = false,
  image = null,
  fallback = null,
  loading = 'lazy',
  fetchPriority = 'auto',
  width,
  height,
  sizes,
  srcSet,
  variant = 'section',
}) {
  const { media } = useSiteSettings()
  const [loadedSources, setLoadedSources] = useState(() => new Set())
  const [failedSources, setFailedSources] = useState(() => new Set())
  const mapping = imageByLabel(label)
  const src = image || media?.[mapping.key]?.url || mapping.fallback
  const fallbackSrc = fallback || mapping.fallback
  const requestedSrc = imageVariantUrl(src, variant)
  const fallbackVariantSrc = imageVariantUrl(fallbackSrc, variant)
  const displaySrc = failedSources.has(requestedSrc) ? fallbackVariantSrc : requestedSrc
  const displayFailed = !displaySrc || failedSources.has(displaySrc)

  if (!displayFailed) {
    return (
      <div className={`relative overflow-hidden ${dark ? 'bg-ink' : 'bg-cream-deep'} ${className}`} role="img" aria-label={label}>
        <img
          src={displaySrc}
          srcSet={failedSources.has(requestedSrc) ? undefined : srcSet}
          sizes={sizes}
          width={width}
          height={height}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={() => setLoadedSources((sources) => new Set(sources).add(displaySrc))}
          onError={() => setFailedSources((sources) => new Set(sources).add(displaySrc))}
          className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-700 hover:scale-[1.02] ${loadedSources.has(displaySrc) ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    )
  }

  const patternId = `weave-${label.replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <div className={`relative flex items-end justify-start overflow-hidden ${dark ? 'bg-ink' : 'bg-cream-deep'} ${className}`} role="img" aria-label={label}>
      <svg className="absolute inset-0 h-full w-full opacity-[0.3]" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0 0 L14 14 M14 0 L0 14" stroke={dark ? '#1A1A70' : '#D9C596'} strokeWidth="1" /></pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className={`absolute inset-0 ${dark ? 'bg-gradient-to-t from-ink/70 via-ink/10 to-transparent' : 'bg-gradient-to-t from-cream-deep/80 via-cream-deep/10 to-transparent'}`} />
      <div className={`relative z-10 flex items-center gap-2 p-4 md:p-5 ${dark ? 'text-white/60' : 'text-ink/50'}`}><ImageIcon size={15} strokeWidth={1.5} className="shrink-0" /><span className="font-sans text-[10px] md:text-[11px] uppercase tracking-wider leading-snug">{label}</span></div>
    </div>
  )
}
