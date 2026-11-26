import { useMemo, useState } from 'react'
import AddToPlaylistModal from './components/AddToPlaylistModal'
import ConfirmModal from './components/ConfirmModal'
import PlayerBar from './components/PlayerBar'
import PlaylistDetails from './components/PlaylistDetails'
import PlaylistFormModal from './components/PlaylistFormModal'
import PlaylistList from './components/PlaylistList'
import SongLibrary from './components/SongLibrary'
import Button from './components/ui/Button'
import EmptyState from './components/ui/EmptyState'
import { usePlayer } from './hooks/usePlayer'
import { usePlaylists } from './hooks/usePlaylists'
import { useSongs } from './hooks/useSongs'

export default function App() {
  const { songs, status, retry } = useSongs()
  const store = usePlaylists()
  const { playlists } = store

  // 'library', 'playlists' (list screen on phones) or a playlist id
  const [view, setView] = useState('library')
  // null, or { type: 'create' | 'rename' | 'delete' | 'add', ... }
  const [modal, setModal] = useState(null)
  const closeModal = () => setModal(null)

  const songsById = useMemo(() => new Map(songs.map((s) => [s.id, s])), [songs])
  // Playlists store only ids; unknown ids are skipped.
  const songsOf = (playlist) => playlist.songIds.map((id) => songsById.get(id)).filter(Boolean)

  const player = usePlayer((source) => {
    if (source === 'library') return songs
    const playlist = playlists.find((p) => p.id === source)
    return playlist ? songsOf(playlist) : []
  })

  const selected = playlists.find((p) => p.id === view)

  const rowProps = (song, source) => ({
    isCurrent: player.song?.id === song.id && player.source === source,
    isPlaying: player.isPlaying,
    onPlay: () => player.play(song.id, source),
  })

  const handleCreate = (name) => {
    const id = store.create(name)
    // Opened from "add song": put the song in the new playlist and stay put.
    if (modal.song) {
      store.addSong(id, modal.song.id)
      setModal({ type: 'add', song: modal.song })
    } else {
      setView(id)
      closeModal()
    }
  }

  const handleDelete = () => {
    if (player.source === selected.id) player.stop()
    store.remove(selected.id)
    setView('playlists')
    closeModal()
  }

  const handleRemove = (songId) => {
    if (player.source === selected.id && player.song?.id === songId) player.stop()
    store.removeSong(selected.id, songId)
  }

  const tab = (target, label, active) => (
    <Button
      variant={active ? 'primary' : 'secondary'}
      className="flex-1"
      aria-current={active ? 'page' : undefined}
      onClick={() => setView(target)}
    >
      {label}
    </Button>
  )

  let content
  if (status === 'loading') {
    content = (
      <div role="status" className="py-16 text-center text-slate-400">
        <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />
        Loading songs…
      </div>
    )
  } else if (status === 'error') {
    content = (
      <EmptyState title="Could not load songs" message="Check your connection and try again.">
        <Button onClick={retry}>Retry</Button>
      </EmptyState>
    )
  } else if (selected) {
    content = (
      <PlaylistDetails
        playlist={selected}
        songs={songsOf(selected)}
        rowProps={rowProps}
        onRename={() => setModal({ type: 'rename' })}
        onDelete={() => setModal({ type: 'delete' })}
        onMove={(songId, dir) => store.moveSong(selected.id, songId, dir)}
        onRemove={handleRemove}
        onBrowse={() => setView('library')}
      />
    )
  } else {
    // On md+ the 'playlists' view has the sidebar, so show the library here.
    content = (
      <div className={view === 'playlists' ? 'hidden md:block' : ''}>
        <SongLibrary
          songs={songs}
          rowProps={rowProps}
          onAdd={(song) => setModal({ type: 'add', song })}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-28">
      <header className="mb-4">
        <h1 className="text-xl font-bold">
          <span className="text-violet-400">♫</span> Playlist Manager
        </h1>
        <nav className="mt-3 flex gap-2 md:hidden">
          {tab('library', 'Library', view === 'library')}
          {tab('playlists', `Playlists (${playlists.length})`, view !== 'library')}
        </nav>
      </header>

      <div className="md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        {/* Phones: its own screen. Tablet and desktop: a permanent sidebar. */}
        <aside className={`${view === 'playlists' ? 'block' : 'hidden'} md:block`}>
          <Button
            variant={selected ? 'secondary' : 'primary'}
            className="mb-4 hidden w-full md:inline-flex"
            onClick={() => setView('library')}
          >
            Song library
          </Button>
          {/* Wait for songs so counts and durations are never shown as zero. */}
          {status === 'ready' && (
            <PlaylistList
              playlists={playlists}
              songsOf={songsOf}
              activeId={selected?.id}
              onSelect={setView}
              onCreate={() => setModal({ type: 'create' })}
            />
          )}
        </aside>
        <main className="min-w-0">{content}</main>
      </div>

      <PlayerBar
        song={player.song}
        isPlaying={player.isPlaying}
        elapsed={player.elapsed}
        onToggle={player.toggle}
        onNext={player.next}
        onPrevious={player.previous}
      />

      {modal?.type === 'create' && (
        <PlaylistFormModal
          playlists={playlists}
          onSubmit={handleCreate}
          onClose={modal.song ? () => setModal({ type: 'add', song: modal.song }) : closeModal}
        />
      )}
      {modal?.type === 'rename' && selected && (
        <PlaylistFormModal
          playlists={playlists}
          playlist={selected}
          onSubmit={(name) => {
            store.rename(selected.id, name)
            closeModal()
          }}
          onClose={closeModal}
        />
      )}
      {modal?.type === 'delete' && selected && (
        <ConfirmModal
          title="Delete playlist?"
          message={`"${selected.name}" will be permanently deleted.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onClose={closeModal}
        />
      )}
      {modal?.type === 'add' && (
        <AddToPlaylistModal
          song={modal.song}
          playlists={playlists}
          onAdd={(id) => store.addSong(id, modal.song.id)}
          onCreate={() => setModal({ type: 'create', song: modal.song })}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
