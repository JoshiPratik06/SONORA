# Music Playlist Manager

A small React app to browse songs, build playlists and "play" them (no real audio).

**Live demo:** _https://sonora-eta-five.vercel.app/_

## Run it

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # unit tests
npm run build     # production build in dist/
npm run preview   # serve the build
```

## Features

- Song library loaded with Axios from `public/songs.json`, with search (title or artist) and genre filter
- Create, rename and delete (with confirmation) playlists; names are required and unique
- Add and remove songs, with no duplicates inside a playlist
- Reorder with move up / down buttons
- Song count and total duration per playlist
- Now Playing bar with Play/Pause, Next, Previous and simulated progress
- Loading, error (with retry), empty and "no results" states
- Responsive layout for 375 px, 768 px and 1440 px
- Playlists saved in `localStorage`

## Structure

```
src/
  lib/         pure logic: playlist rules, formatting, storage (+ tests)
  hooks/       useSongs, usePlaylists, usePlayer
  components/  feature components
    ui/        Button, Input, Modal, EmptyState
  App.jsx      view state and wiring
```

## Assumptions

- Names are unique ignoring case and surrounding spaces, with a 40 character limit.
- Playlists store song IDs only. An ID missing from `songs.json` is not shown.
- Total duration is rounded to the nearest minute.
- Next and Previous follow the list the song was started from (the playlist, or the
  full library even when it is filtered) and wrap around at the ends.
- Removing the current song, or deleting its playlist, stops playback.
- Playback state is not saved across refreshes; only playlists are.
- Up/down buttons were chosen over drag and drop: they work with touch and keyboard
  without an extra library.
- No router, since the app has only two views.

## What I would improve

- Drag and drop reordering alongside the buttons
- Routes, so a playlist has its own URL and the browser Back button works
- Component tests and end-to-end tests in CI
- Sync between open tabs using the `storage` event
- Undo after removing a song
- Shuffle, repeat and a seekable progress bar

## AI usage

This project was built with the help of AI assistants (Claude and GitHub Copilot).
