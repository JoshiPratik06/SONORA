import { useState } from 'react'
import SongRow from './SongRow'
import Button from './ui/Button'
import EmptyState from './ui/EmptyState'
import { fieldClass } from './ui/Input'

export default function SongLibrary({ songs, query, onQueryChange, rowProps, onAdd }) {
  const [genre, setGenre] = useState('')

  const genres = [...new Set(songs.map((s) => s.genre))].sort()
  const text = query.trim().toLowerCase()
  const results = songs.filter(
    (s) =>
      (!genre || s.genre === genre) &&
      (s.title.toLowerCase().includes(text) || s.artist.toLowerCase().includes(text)),
  )

  const clear = () => {
    onQueryChange('')
    setGenre('')
  }

  return (
    <section className="rounded-2xl border border-white/5 bg-[#14121b]/90 p-4 shadow-xl shadow-black/10 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
            Your library
          </p>
          <h2 className="mt-1 text-xl font-bold">All Songs</h2>
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <span className="text-xs text-slate-500">
            {results.length} {results.length === 1 ? 'track' : 'tracks'}
          </span>
          <select
            aria-label="Filter by genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={`${fieldClass} w-40`}
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No results" message="No songs match your search and genre.">
            <Button variant="secondary" onClick={clear}>
              Clear filters
            </Button>
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/5 px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:grid-cols-[2.5rem_2.5rem_minmax(0,1fr)_auto]">
            <span />
            <span className="hidden sm:block" />
            <span>Title · Artist</span>
            <span className="pr-2">Duration</span>
          </div>
          <ul className="mt-2 space-y-1">
            {results.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                {...rowProps(song, 'library')}
                actions={
                  <Button
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => onAdd(song)}
                    aria-label={`Add ${song.title} to a playlist`}
                  >
                    + Add
                  </Button>
                }
              />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
