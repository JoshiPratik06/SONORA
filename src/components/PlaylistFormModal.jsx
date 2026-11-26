import { useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'
import Modal from './ui/Modal'
import { validateName } from '../lib/playlists'

// Used for both "create" and "rename" (pass `playlist` to rename).
export default function PlaylistFormModal({ playlists, playlist, onSubmit, onClose }) {
  const [name, setName] = useState(playlist?.name ?? '')
  const [submitted, setSubmitted] = useState(false)
  const error = validateName(playlists, name, playlist?.id)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!error) onSubmit(name)
  }

  return (
    <Modal title={playlist ? 'Rename playlist' : 'New playlist'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={submitted ? error : ''}
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{playlist ? 'Save' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  )
}
