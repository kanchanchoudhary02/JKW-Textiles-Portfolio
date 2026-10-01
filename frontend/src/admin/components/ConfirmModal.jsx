export default function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = true }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="font-semibold text-lg text-ink">{title}</h3>
        <p className="text-sm text-slate-500 mt-2">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-ink hover:bg-[#15155A]'}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
