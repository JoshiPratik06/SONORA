export default function EmptyState({ title, message, children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 px-4 py-10 text-center">
      <p className="font-medium">{title}</p>
      {message && <p className="mt-1 text-sm text-slate-400">{message}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
