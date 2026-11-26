import { useEffect, useState } from 'react'

const IDLE = { source: null, songId: null, isPlaying: false, elapsed: 0 }

// Simulated player. `source` is 'library' or a playlist id, and the queue is
// derived from it on every render, so reordering affects Next/Previous at once.
export function usePlayer(getQueue) {
  const [state, setState] = useState(IDLE)
  const queue = state.source ? getQueue(state.source) : []
  const index = queue.findIndex((s) => s.id === state.songId)
  const song = queue[index] ?? null

  // Wraps around at both ends.
  const step = (direction) => {
    if (!song) return
    const next = queue[(index + direction + queue.length) % queue.length]
    setState((s) => ({ ...s, songId: next.id, elapsed: 0 }))
  }

  // Fake progress: tick once a second and move on when the song ends.
  useEffect(() => {
    if (!state.isPlaying || !song) return
    const timer = setTimeout(() => {
      if (state.elapsed + 1 >= song.duration) step(1)
      else setState((s) => ({ ...s, elapsed: s.elapsed + 1 }))
    }, 1000)
    return () => clearTimeout(timer)
  })

  return {
    song,
    source: state.source,
    isPlaying: state.isPlaying,
    elapsed: state.elapsed,
    // Clicking the current song toggles it; any other song starts playing.
    play(songId, source) {
      setState((s) =>
        s.songId === songId && s.source === source
          ? { ...s, isPlaying: !s.isPlaying }
          : { source, songId, isPlaying: true, elapsed: 0 },
      )
    },
    toggle: () => setState((s) => ({ ...s, isPlaying: !s.isPlaying })),
    next: () => step(1),
    previous: () => step(-1),
    stop: () => setState(IDLE),
  }
}
