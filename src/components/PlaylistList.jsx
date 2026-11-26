import PlaylistCard from './PlaylistCard'
import Button from './ui/Button'
import EmptyState from './ui/EmptyState'

export default function PlaylistList({ playlists, songsOf, activeId, onSelect, onCreate }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-semibold">Your playlists</h2>
        <Button onClick={onCreate}>+ New</Button>
      </div>
      {playlists.length === 0 ? (
        <EmptyState title="No playlists yet" message="Create one to start adding songs." />
      ) : (
        <ul className="space-y-2">
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
