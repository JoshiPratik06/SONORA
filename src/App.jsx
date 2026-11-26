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
import Input from './components/ui/Input'
import { usePlayer } from './hooks/usePlayer'
import { usePlaylists } from './hooks/usePlaylists'
import { useSongs } from './hooks/useSongs'

export default function App() {
  const { songs, status, retry } = useSongs()
  const store = usePlaylists()
  const { playlists } = store
  const [view, setView] = useState('library')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const closeModal = () => setModal(null)

  const songsById = useMemo(() => new Map(songs.map((s) => [s.id, s])), [songs])
  const songsOf = (playlist) => playlist.songIds.map((id) => songsById.get(id)).filter(Boolean)

  const player = usePlayer((source) => {
    if (source === 'library') return songs
    const playlist = playlists.find((p) => p.id === source)
    return playlist ? songsOf(playlist) : []
  })

  const selected = playlists.find((p) => p.id === view)
  const greeting =
    new Date().getHours() < 12
      ? 'Good morning'
      : new Date().getHours() < 17
        ? 'Good afternoon'
        : 'Good evening'

  const rowProps = (song, source) => ({
    isCurrent: player.song?.id === song.id && player.source === source,
    isPlaying: player.isPlaying,
    onPlay: () => player.play(song.id, source),
  })

  const handleCreate = (name) => {
    const id = store.create(name)
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

  const mobileTab = (target, label, active) => (
    <Button
      variant={active ? 'primary' : 'secondary'}
      className="flex-1"
      aria-current={active ? 'page' : undefined}
      onClick={() => setView(target)}
    >
      {label}
    </Button>
  )

  const sidebarLink = (target, label, icon) => {
    const active = target === 'library' ? view === 'library' : view !== 'library'
    return (
      <button
        key={target}
        type="button"
        aria-current={active ? 'page' : undefined}
        onClick={() => setView(target)}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
          active
            ? 'bg-gradient-to-r from-violet-600/90 to-fuchsia-700/70 text-white shadow-lg shadow-violet-950/30'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <span className="w-5 text-center text-lg">{icon}</span>
        {label}
      </button>
    )
  }

  let content
  if (status === 'loading') {
    content = (
      <div role="status" className="rounded-2xl border border-white/5 bg-white/[0.03] py-16 text-center text-slate-400">
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
    content = (
      <div
        className={`grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(17rem,0.8fr)] ${
          view === 'playlists' ? 'hidden md:grid' : ''
        }`}
      >
        <SongLibrary
          songs={songs}
          query={query}
          onQueryChange={setQuery}
          rowProps={rowProps}
          onAdd={(song) => setModal({ type: 'add', song })}
        />
        <div className="space-y-4">
          <section className="relative overflow-hidden rounded-2xl border border-violet-300/10 bg-gradient-to-br from-[#29183b] via-[#1b1525] to-[#121019] p-5 shadow-xl shadow-black/20">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                  Your collection
                </p>
                <h2 className="mt-2 text-xl font-bold">A little more you.</h2>
                <p className="mt-1 text-sm leading-5 text-slate-300">
                  Keep your favorite tracks together in a playlist.
                </p>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl text-violet-200">
                ♫
              </span>
            </div>
            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                <p className="text-xs text-slate-400">Tracks</p>
                <p className="mt-1 text-2xl font-semibold">{songs.length}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                <p className="text-xs text-slate-400">Playlists</p>
                <p className="mt-1 text-2xl font-semibold">{playlists.length}</p>
              </div>
            </div>
            <Button className="relative mt-4 w-full" onClick={() => setModal({ type: 'create' })}>
              + Create a playlist
            </Button>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#14121b]/90 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Now playing
            </p>
            {player.song ? (
              <div className="mt-4 flex min-w-0 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xl text-violet-300">
                  ♫
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{player.song.title}</p>
                  <p className="truncate text-sm text-slate-400">{player.song.artist}</p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                Choose a track from your library to start listening.
              </p>
            )}
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0810] text-slate-100">
      <header className="border-b border-white/5 bg-[#100d17]/90 px-4 py-4 md:hidden">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-lg shadow-lg shadow-violet-950/40">
            ♫
          </span>
          <div>
            <p className="font-bold leading-4 tracking-wide">SONORA</p>
            <p className="text-[10px] text-slate-400">Music Playlist Manager</p>
          </div>
        </div>
        {!selected && view !== 'playlists' && (
          <Input
            label="Search songs"
            hideLabel
            type="search"
            placeholder="Search songs or artists"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        )}
        <nav className="mt-3 flex gap-2">
          {mobileTab('library', 'Library', view === 'library')}
          {mobileTab('playlists', `Playlists (${playlists.length})`, view !== 'library')}
        </nav>
      </header>

      <div className="flex flex-col md:min-h-screen md:flex-row">
        <aside
          className={`${
            view === 'playlists' ? 'block' : 'hidden'
          } w-full shrink-0 border-b border-white/5 bg-gradient-to-b from-[#171121] to-[#0e0c14] p-4 md:flex md:w-60 md:flex-col md:border-b-0 md:border-r md:p-5 lg:w-64`}
        >
          <div className="hidden md:block">
            <div className="flex items-center gap-3 px-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xl shadow-lg shadow-violet-950/40">
                ♫
              </span>
              <div>
                <p className="font-bold tracking-wide">SONORA</p>
                <p className="text-[11px] text-slate-400">Music Playlist Manager</p>
              </div>
            </div>
            <nav aria-label="Main navigation" className="mt-8 space-y-1">
              {sidebarLink('library', 'Song library', '⌂')}
              {sidebarLink('playlists', 'Your playlists', '♫')}
            </nav>
          </div>
          <div className="mt-1 md:mt-8 md:flex-1">
            {status === 'ready' && (
              <PlaylistList
                playlists={playlists}
                songsOf={songsOf}
                activeId={selected?.id}
                onSelect={setView}
                onCreate={() => setModal({ type: 'create' })}
              />
            )}
          </div>
          <div className="mt-6 hidden rounded-xl border border-white/5 bg-black/15 p-3 md:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Local library
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {songs.length} {songs.length === 1 ? 'track' : 'tracks'} ready to play
            </p>
          </div>
        </aside>

        <main
          className={`${
            view === 'playlists' ? 'hidden md:block' : ''
          } min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8`}
        >
          <header className="mb-6 hidden items-end justify-between gap-5 border-b border-white/5 pb-5 md:flex">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                SONORA · YOUR MUSIC
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">{greeting}! 👋</h1>
              <p className="mt-1 text-sm text-slate-400">Ready to vibe? Here’s your music world.</p>
            </div>
            {!selected && (
              <Input
                label="Search songs"
                hideLabel
                type="search"
                placeholder="Search songs, artists..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full max-w-sm"
              />
            )}
          </header>
          {content}
        </main>
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
