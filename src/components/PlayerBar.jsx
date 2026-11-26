import Button from './ui/Button'
import { formatDuration } from '../lib/format'

export default function PlayerBar({ song, isPlaying, elapsed, onToggle, onNext, onPrevious }) {
  const progress = song ? (elapsed / song.duration) * 100 : 0
  return (
    <footer
      aria-label="Now playing"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-800 bg-slate-900 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="h-1 bg-slate-800">
        <div className="h-full bg-violet-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-2 px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{song ? song.title : 'Nothing playing'}</p>
          <p className="truncate text-sm text-slate-400">
            {song ? song.artist : 'Pick a song to start'}
          </p>
        </div>
        {song && (
          <span className="hidden text-sm text-slate-400 tabular-nums sm:block">
            {formatDuration(elapsed)} / {formatDuration(song.duration)}
          </span>
        )}
        <Button variant="ghost" icon disabled={!song} onClick={onPrevious} aria-label="Previous">
          ⏮︎
        </Button>
        <Button icon disabled={!song} onClick={onToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '❚❚' : '▶'}
        </Button>
        <Button variant="ghost" icon disabled={!song} onClick={onNext} aria-label="Next">
          ⏭︎
        </Button>
      </div>
    </footer>
  )
}
