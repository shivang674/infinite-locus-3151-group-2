import { useState } from 'react'
import { createDocument } from '../services/documentService'

export default function CreateDocModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const doc = await createDocument(title.trim(), '')
      onCreated(doc)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create document')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Create New Document</h2>

        <form onSubmit={handleCreate}>
          {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

          <div className="form-group">
            <label htmlFor="doc-title">Document Title</label>
            <input
              id="doc-title"
              type="text"
              className="input-field"
              placeholder="Enter a title for your document"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-outline btn-small" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary btn-small" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
