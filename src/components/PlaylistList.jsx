import PlaylistCard from './PlaylistCard'
import Button from './ui/Button'

export default function PlaylistList({ playlists, songsOf, activeId, onSelect, onCreate }) {
  return (
    <div className="space-y-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Your playlists
        </h2>
        <Button
          className="min-h-8 rounded-full px-3 text-xs"
          onClick={onCreate}
        >
          + New
        </Button>
      </div>
      {playlists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-3 py-4">
          <p className="text-sm font-medium text-slate-300">No playlists yet</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Create one to start adding songs.
          </p>
        </div>
      ) : (
        <ul className="space-y-1">
          {playlists.map((p) => (
            <li key={p.id}>
              <PlaylistCard
                name={p.name}
                songs={songsOf(p)}
                active={p.id === activeId}
                onClick={() => onSelect(p.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
