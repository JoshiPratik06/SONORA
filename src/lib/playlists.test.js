import { describe, expect, it } from 'vitest'
import { addSong, createPlaylist, moveSong, validateName } from './playlists'
import { formatDuration, formatSummary } from './format'

const base = createPlaylist([], 'a', '  Focus ')

describe('validateName', () => {
  it('requires a name', () => expect(validateName(base, '   ')).toBeTruthy())
  it('rejects duplicates ignoring case and spaces', () =>
    expect(validateName(base, ' focus ')).toBeTruthy())
  it('lets a playlist keep its own name', () =>
    expect(validateName(base, 'FOCUS', 'a')).toBe(''))
})

describe('songs in a playlist', () => {
  const filled = addSong(addSong(base, 'a', 1), 'a', 2)

  it('cannot add the same song twice', () =>
    expect(addSong(filled, 'a', 1)[0].songIds).toEqual([1, 2]))
  it('moves a song', () => expect(moveSong(filled, 'a', 2, -1)[0].songIds).toEqual([2, 1]))
  it('ignores moves past either end', () => {
    expect(moveSong(filled, 'a', 1, -1)[0].songIds).toEqual([1, 2])
    expect(moveSong(filled, 'a', 2, 1)[0].songIds).toEqual([1, 2])
  })
})

describe('formatting', () => {
  it('formats mm:ss', () => expect(formatDuration(187)).toBe('03:07'))
  it('summarises a playlist', () =>
    expect(formatSummary([{ duration: 960 }, { duration: 960 }])).toBe('2 songs · 32 min'))
})
