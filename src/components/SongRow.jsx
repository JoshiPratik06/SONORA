import Button from './ui/Button'
import { formatDuration } from '../lib/format'

// One row for both the library and playlists; `actions` is what differs.
export default function SongRow({ song, isCurrent, isPlaying, onPlay, actions, stackActions }) {
  const playing = isCurrent && isPlaying
  return (
    <li
      className={`flex items-center gap-x-3 gap-y-1 rounded-xl border border-transparent px-2.5 py-2 transition-colors sm:px-3 ${
        stackActions ? 'flex-wrap lg:flex-nowrap' : ''
      } ${
        isCurrent
          ? 'border-violet-400/10 bg-violet-500/10'
          : 'hover:border-white/5 hover:bg-white/[0.035]'
      }`}
    >
      <Button
        variant="ghost"
        icon
        className="rounded-full"
        onClick={onPlay}
        aria-label={`${playing ? 'Pause' : 'Play'} ${song.title}`}
      >
        {playing ? '❚❚' : '▶'}
      </Button>
      <span
        aria-hidden="true"
        className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/40 to-fuchsia-500/20 text-lg text-violet-200 sm:flex"
      >
        ♫
      </span>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isCurrent ? 'text-violet-200' : ''}`}>
          {song.title}
        </p>
        <p className="break-words text-xs text-slate-400">
          {song.artist} <span>· {song.genre}</span>
        </p>
      </div>
      <span className="shrink-0 text-xs tabular-nums text-slate-400">
        {formatDuration(song.duration)}
      </span>
      {/* Stacked actions get their own line below lg so titles keep their space. */}
      <div className={`flex shrink-0 justify-end gap-1 ${stackActions ? 'w-full lg:w-auto' : ''}`}>
        {actions}
      </div>
    </li>
  )
}
