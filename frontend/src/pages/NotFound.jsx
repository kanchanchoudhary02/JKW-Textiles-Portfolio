import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="pt-28 pb-32 md:pt-40 md:pb-40">
      <div className="container max-w-container flex flex-col items-center text-center gap-6">
        <span className="eyebrow-slash">Error 404</span>
        <h1 className="display-heading text-[clamp(2.4rem,6vw,5rem)]">Page Not Found</h1>
        <p className="text-ink-soft/65 text-base max-w-md">
          The page you're looking for may have been moved or no longer exists.
        </p>
        <Link to="/" className="pill-btn mt-4">
          Back to Home
          <span className="pill-icon"><ArrowUpRight size={16} strokeWidth={1.75} /></span>
        </Link>
      </div>
    </section>
  )
}
