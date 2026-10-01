import { useSiteSettings } from '../context/SiteSettingsContext'

export default function Logo({ className = '' }) {
  const { media } = useSiteSettings()
  return (
    <img
      src={media?.logo?.url || '/logo/jkw-logo.png'}
      alt="JKW Textiles"
      className={`h-14 md:h-16 w-auto max-w-[180px] object-contain object-center ${className}`}
    />
  )
}
