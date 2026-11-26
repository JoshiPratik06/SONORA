// 187 -> "03:07"
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// "8 songs · 32 min"
export function formatSummary(songs) {
  const total = songs.reduce((sum, song) => sum + song.duration, 0)
  const noun = songs.length === 1 ? 'song' : 'songs'
  return `${songs.length} ${noun} · ${Math.round(total / 60)} min`
}
