export default function Marquee({ items, variant = 'coral', speed = 'normal' }) {
  const anim = speed === 'slow' ? 'animate-marqueeSlow' : 'animate-marquee'
  const styles = {
    coral: 'bg-white text-coral border-y border-ink/8',
    dark: 'bg-ink text-white',
  }
  return (
    <div className={`relative w-full overflow-hidden py-5 md:py-6 ${styles[variant]}`}>
      <div className={`flex w-max ${anim}`}>
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="font-display font-bold text-lg md:text-2xl px-6 whitespace-nowrap">
              {item}
            </span>
            <span className="text-lg opacity-70">&#10022;</span>
          </div>
        ))}
      </div>
    </div>
  )
}
