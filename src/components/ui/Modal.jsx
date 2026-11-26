import { useEffect, useId, useRef } from 'react'
import Button from './Button'

// Native <dialog> gives focus trapping and Escape-to-close for free.
// Render it only while open.
export default function Modal({ title, onClose, children }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog.open) dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 id={titleId} className="min-w-0 text-lg font-semibold break-words">
          {title}
        </h2>
        <Button variant="ghost" icon onClick={onClose} aria-label="Close">
          ✕
        </Button>
      </div>
      {children}
    </dialog>
  )
}
