import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import ImagePlaceholder from '../components/ImagePlaceholder'
import api from '../config/api'

export default function ContactSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)

    try {
      await api.post('/leads', {
        name: 'Homepage Visitor',
        email,
        message: 'Visitor requested a callback / sourcing support through the homepage Get in touch form.',
      })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'We could not send your request. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col gap-5"
          >
            <div className="w-40 h-48 md:w-44 md:h-52 rounded-[3rem] rounded-tl-none overflow-hidden bg-olive-deep">
              <ImagePlaceholder label="Contact — sourcing consultant portrait" dark className="h-full w-full" />
            </div>
            <p className="font-display italic text-base text-ink-soft/80 leading-snug max-w-[220px]">
              Got a collection in your head and no idea where to start with fabric? That's exactly what we're here for.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-8 lg:pl-10 flex flex-col gap-6"
          >
            <h2 className="font-display font-medium text-[clamp(1.8rem,3.6vw,2.8rem)] text-ink leading-tight">
              Reach out for sourcing support, custom orders, or any questions.
            </h2>
            <div className="flex items-start gap-2 text-ink-soft/70 text-sm">
              <span className="text-coral mt-0.5">&#10022;</span>
              Let our fabrics capture the beauty of your creations.
            </div>

            {sent ? (
              <div className="flex items-center gap-3 text-olive pt-2">
                <CheckCircle2 size={20} strokeWidth={1.75} />
                <span className="text-sm">Thanks — we've received your request and sent a confirmation email.</span>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-ink/20 pb-3 max-w-md mt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Get in touch — enter your email"
                    className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-soft/40 text-base"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    aria-label="Submit email"
                    className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center hover:bg-gold transition-colors shrink-0 disabled:opacity-60"
                  >
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </button>
                </form>
                {error && (
                  <div className="flex items-start gap-2 text-coral text-sm max-w-md">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="display-heading text-[clamp(2.6rem,7vw,5.6rem)]"
        >
          Contact Us
        </motion.h2>
      </div>
    </section>
  )
}
