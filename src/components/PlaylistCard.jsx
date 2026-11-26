import { formatSummary } from '../lib/format'

export default function PlaylistCard({ name, songs, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`w-full cursor-pointer rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-violet-400 ${
        active ? 'border-violet-500 bg-violet-950/60' : 'border-slate-800 bg-slate-900 hover:border-slate-600'
      }`}
    >
      <span className="block truncate font-medium">{name}</span>
      <span className="block text-sm text-slate-400">{formatSummary(songs)}</span>
    </button>
  )
}
