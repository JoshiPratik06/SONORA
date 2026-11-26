// Pure functions: each takes the playlists array and returns a new one.

export const MAX_NAME_LENGTH = 40

// Returns an error message, or '' when the name is valid.
// `currentId` lets a playlist keep (or re-case) its own name while renaming.
export function validateName(playlists, name, currentId) {
  const clean = name.trim()
  if (!clean) return 'Name is required.'
  if (clean.length > MAX_NAME_LENGTH) return `Use ${MAX_NAME_LENGTH} characters or fewer.`
  const taken = playlists.some(
    (p) => p.id !== currentId && p.name.toLowerCase() === clean.toLowerCase(),
  )
  return taken ? 'A playlist with this name already exists.' : ''
}

const update = (playlists, id, change) =>
  playlists.map((p) => (p.id === id ? { ...p, ...change(p) } : p))

export const createPlaylist = (playlists, id, name) => [
  ...playlists,
  { id, name: name.trim(), songIds: [] },
]

export const renamePlaylist = (playlists, id, name) =>
  update(playlists, id, () => ({ name: name.trim() }))

export const deletePlaylist = (playlists, id) => playlists.filter((p) => p.id !== id)

export const addSong = (playlists, id, songId) =>
  update(playlists, id, (p) => ({
    songIds: p.songIds.includes(songId) ? p.songIds : [...p.songIds, songId],
  }))

export const removeSong = (playlists, id, songId) =>
  update(playlists, id, (p) => ({ songIds: p.songIds.filter((s) => s !== songId) }))

// direction: -1 moves up, 1 moves down
export const moveSong = (playlists, id, songId, direction) =>
  update(playlists, id, (p) => {
    const from = p.songIds.indexOf(songId)
    const to = from + direction
    if (from < 0 || to < 0 || to >= p.songIds.length) return {}
    const songIds = [...p.songIds]
    ;[songIds[from], songIds[to]] = [songIds[to], songIds[from]]
    return { songIds }
  })
