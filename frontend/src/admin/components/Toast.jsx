import { useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null

  const isError = toast.type === 'error'

  return (
    <div className="fixed top-5 right-5 z-[999]">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm text-white ${
          isError ? 'bg-red-600' : 'bg-emerald-600'
        }`}
      >
        {isError ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
        {toast.message}
      </div>
    </div>
  )
}
