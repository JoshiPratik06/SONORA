import { formatSummary } from '../lib/format'

export default function PlaylistCard({ name, songs, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`w-full cursor-pointer rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-violet-400 ${
        active
          ? 'border-violet-400/20 bg-gradient-to-r from-violet-600/25 to-fuchsia-600/10 shadow-lg shadow-violet-950/20'
          : 'border-transparent bg-white/[0.025] hover:border-white/5 hover:bg-white/[0.05]'
      }`}
    >
      <span className="block truncate text-sm font-medium">{name}</span>
      <span className="mt-1 block text-xs text-slate-500">{formatSummary(songs)}</span>
    </button>
  )
}
