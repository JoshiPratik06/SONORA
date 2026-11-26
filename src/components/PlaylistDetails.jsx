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
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-violet-300/10 bg-gradient-to-br from-[#29183b] via-[#1b1525] to-[#121019] p-5 shadow-xl shadow-black/20 sm:p-7">
        <div className="absolute -right-12 -top-14 size-52 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="hidden size-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/50 to-fuchsia-500/20 text-5xl text-white shadow-lg shadow-black/20 sm:flex">
            ♫
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
              Playlist
            </p>
            <h2 className="mt-1 break-words text-2xl font-bold sm:text-3xl">{playlist.name}</h2>
            <p className="mt-1 text-sm text-slate-300">{formatSummary(songs)}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="border border-white/10 bg-white/5 hover:bg-white/10"
              onClick={onRename}
            >
              Rename
            </Button>
            <Button variant="danger" className="bg-rose-500/80 hover:bg-rose-500" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#14121b]/90 p-5">
          <EmptyState title="This playlist is empty" message="Add songs from the library.">
            <Button onClick={onBrowse}>Browse library</Button>
          </EmptyState>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#14121b]/90 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-semibold">Tracks</h3>
            <span className="text-xs text-slate-500">{songs.length} in this playlist</span>
          </div>
          <ul className="space-y-1">
            {songs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                {...rowProps(song, playlist.id)}
                stackActions
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
        </div>
      )}
    </section>
  )
}
