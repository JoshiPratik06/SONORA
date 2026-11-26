const KEY = 'playlist-manager:playlists'

const isPlaylist = (p) =>
  p && typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.songIds)

// localStorage can be unavailable or hold bad data, so never let it crash the app.
export function loadPlaylists() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(data) ? data.filter(isPlaylist) : []
  } catch {
    return []
  }
}

export function savePlaylists(playlists) {
  try {
    localStorage.setItem(KEY, JSON.stringify(playlists))
  } catch {
    // Storage full or blocked: the app keeps working for this session.
  }
}
