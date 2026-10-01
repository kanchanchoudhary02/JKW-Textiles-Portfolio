import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '../config/api'

const initialState = { name: '', email: '', phone: '', company: '', message: '' }

export default function ContactForm() {
  const [searchParams] = useSearchParams()
  const [values, setValues] = useState(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const productId = searchParams.get('product')
      await api.post('/leads', { ...values, ...(productId ? { product: productId } : {}) })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center gap-4 py-16 border border-ink/10 rounded-2xl"
      >
        <CheckCircle2 size={40} strokeWidth={1.25} className="text-gold" />
        <h3 className="font-display font-bold text-2xl text-ink">Thank you</h3>
        <p className="text-ink-soft/65 text-sm max-w-xs">
          Your requirement has been received. Our team will get back to you shortly.
        </p>
        <button onClick={() => { setValues(initialState); setSubmitted(false) }} className="link-underline text-sm text-gold mt-2">
          Submit another enquiry
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="flex items-center gap-2 bg-coral/10 text-coral text-sm rounded-xl px-4 py-3">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Name" name="name" value={values.name} onChange={handleChange} required />
        <Field label="Email" name="email" type="email" value={values.email} onChange={handleChange} required />
        <Field label="Phone" name="phone" type="tel" value={values.phone} onChange={handleChange} />
        <Field label="Company" name="company" value={values.company} onChange={handleChange} />
      </div>
      <Field label="Requirement / Message" name="message" as="textarea" rows={5} value={values.message} onChange={handleChange} required />
      <button type="submit" disabled={submitting} className="pill-btn self-start mt-2 disabled:opacity-60">
        {submitting ? 'Sending...' : 'Send Enquiry'}
        <span className="pill-icon"><ArrowUpRight size={16} strokeWidth={1.75} /></span>
      </button>
    </form>
  )
}

function Field({ label, name, type = 'text', as = 'input', rows, value, onChange, required }) {
  const Component = as
  return (
    <label className="flex flex-col gap-2.5">
      <span className="text-[11px] uppercase tracking-[0.08em] text-ink-soft/55 font-medium">
        {label} {required && <span className="text-coral">*</span>}
      </span>
      <Component
        type={as === 'input' ? type : undefined}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-transparent border-b border-ink/20 py-2.5 text-ink placeholder:text-ink-soft/30 focus:border-gold outline-none transition-colors duration-300 resize-none text-[15px]"
      />
    </label>
  )
}
