import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

// Loads the mock song file once and exposes loading / error / retry.
export function useSongs() {
  const [state, setState] = useState({ songs: [], status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    axios
      .get('/songs.json', { signal: controller.signal })
      .then(({ data }) => {
        // A host may answer a missing file with index.html and status 200.
        if (!Array.isArray(data)) throw new Error('Invalid song data')
        setState({ songs: data, status: 'ready' })
      })
      .catch((error) => {
        if (!axios.isCancel(error)) setState({ songs: [], status: 'error' })
      })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState({ songs: [], status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, retry }
}
