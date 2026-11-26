import { useState } from 'react'
import SongRow from './SongRow'
import Button from './ui/Button'
import EmptyState from './ui/EmptyState'
import Input, { fieldClass } from './ui/Input'

export default function SongLibrary({ songs, rowProps, onAdd }) {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')

  const genres = [...new Set(songs.map((s) => s.genre))].sort()
  const text = query.trim().toLowerCase()
  const results = songs.filter(
    (s) =>
      (!genre || s.genre === genre) &&
      (s.title.toLowerCase().includes(text) || s.artist.toLowerCase().includes(text)),
  )

  const clear = () => {
    setQuery('')
    setGenre('')
  }

  return (
    <section>
      <h2 className="text-2xl font-bold">Song library</h2>
      <div className="my-4 flex flex-col gap-2 sm:flex-row">
        <Input
          label="Search songs"
          hideLabel
          type="search"
          placeholder="Search by title or artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <select
          aria-label="Filter by genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className={`${fieldClass} sm:w-44`}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      {results.length === 0 ? (
        <EmptyState title="No results" message="No songs match your search and genre.">
          <Button variant="secondary" onClick={clear}>
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <ul className="space-y-1">
          {results.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              {...rowProps(song, 'library')}
              actions={
                <Button
                  variant="ghost"
                  onClick={() => onAdd(song)}
                  aria-label={`Add ${song.title} to a playlist`}
                >
                  + Add
                </Button>
              }
            />
          ))}
        </ul>
      )}
    </section>
  )
}
