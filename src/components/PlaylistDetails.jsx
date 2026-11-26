import SongRow from './SongRow'
import Button from './ui/Button'
import EmptyState from './ui/EmptyState'
import { formatSummary } from '../lib/format'

export default function PlaylistDetails({
  playlist,
  songs,
  rowProps,
  onRename,
  onDelete,
  onMove,
  onRemove,
  onBrowse,
}) {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold break-words">{playlist.name}</h2>
          <p className="text-sm text-slate-400">{formatSummary(songs)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onRename}>
            Rename
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      {songs.length === 0 ? (
        <EmptyState title="This playlist is empty" message="Add songs from the library.">
          <Button onClick={onBrowse}>Browse library</Button>
        </EmptyState>
      ) : (
        <ul className="space-y-1">
          {songs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              {...rowProps(song, playlist.id)}
              actions={
                <>
                  <Button
                    variant="ghost"
                    icon
                    disabled={index === 0}
                    onClick={() => onMove(song.id, -1)}
                    aria-label={`Move ${song.title} up`}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    icon
                    disabled={index === songs.length - 1}
                    onClick={() => onMove(song.id, 1)}
                    aria-label={`Move ${song.title} down`}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onRemove(song.id)}
                    aria-label={`Remove ${song.title}`}
                  >
                    Remove
                  </Button>
                </>
              }
            />
          ))}
        </ul>
      )}
    </section>
  )
}
