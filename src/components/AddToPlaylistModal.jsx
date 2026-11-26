import Button from './ui/Button'
import Modal from './ui/Modal'

export default function AddToPlaylistModal({ song, playlists, onAdd, onCreate, onClose }) {
  return (
    <Modal title={`Add "${song.title}"`} onClose={onClose}>
      {playlists.length === 0 ? (
        <p className="text-sm text-slate-300">You have no playlists yet.</p>
      ) : (
        <ul className="max-h-64 space-y-2 overflow-y-auto">
          {playlists.map((p) => {
            const added = p.songIds.includes(song.id)
            return (
              <li key={p.id} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                <Button
                  variant="secondary"
                  disabled={added}
                  onClick={() => onAdd(p.id)}
                  aria-label={added ? `Already in ${p.name}` : `Add to ${p.name}`}
                >
                  {added ? 'Added ✓' : 'Add'}
                </Button>
              </li>
            )
          })}
        </ul>
      )}
      <div className="mt-4 flex justify-between gap-2">
        <Button variant="ghost" onClick={onCreate}>
          + New playlist
        </Button>
        <Button onClick={onClose}>Done</Button>
      </div>
    </Modal>
  )
}
