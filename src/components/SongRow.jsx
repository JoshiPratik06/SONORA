import Button from './ui/Button'
import { formatDuration } from '../lib/format'

// One row for both the library and playlists; `actions` is what differs.
export default function SongRow({ song, isCurrent, isPlaying, onPlay, actions }) {
  const playing = isCurrent && isPlaying
  return (
    <li
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-2 py-2 sm:flex-nowrap ${
        isCurrent ? 'bg-violet-950/60' : 'hover:bg-slate-900'
      }`}
    >
      <Button
        variant="secondary"
        icon
        onClick={onPlay}
        aria-label={`${playing ? 'Pause' : 'Play'} ${song.title}`}
      >
        {playing ? '❚❚' : '▶'}
      </Button>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium ${isCurrent ? 'text-violet-300' : ''}`}>{song.title}</p>
        <p className="truncate text-sm text-slate-400">
          {song.artist} · {song.genre}
        </p>
      </div>
      <span className="text-sm text-slate-400 tabular-nums">{formatDuration(song.duration)}</span>
      {/* Wraps onto its own line on phones so titles keep their space. */}
      <div className="flex w-full justify-end gap-1 sm:w-auto">{actions}</div>
    </li>
  )
}
