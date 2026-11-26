import { useEffect, useState } from 'react'
import * as rules from '../lib/playlists'
import { loadPlaylists, savePlaylists } from '../lib/storage'

export function usePlaylists() {
  // Lazy initial state: read storage once, before the first save can run.
  const [playlists, setPlaylists] = useState(loadPlaylists)

  useEffect(() => savePlaylists(playlists), [playlists])

  return {
    playlists,
    create(name) {
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
      setPlaylists((list) => rules.createPlaylist(list, id, name))
      return id
    },
    rename: (id, name) => setPlaylists((list) => rules.renamePlaylist(list, id, name)),
    remove: (id) => setPlaylists((list) => rules.deletePlaylist(list, id)),
    addSong: (id, songId) => setPlaylists((list) => rules.addSong(list, id, songId)),
    removeSong: (id, songId) => setPlaylists((list) => rules.removeSong(list, id, songId)),
    moveSong: (id, songId, dir) => setPlaylists((list) => rules.moveSong(list, id, songId, dir)),
  }
}
