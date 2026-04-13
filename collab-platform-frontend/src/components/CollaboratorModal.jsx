import { useState, useEffect } from 'react'
import { addCollaborator } from '../services/documentService'
import { searchUsers } from '../services/userService'

export default function CollaboratorModal({ docId, collaborators, onClose, onAdded }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [inviteStatus, setInviteStatus] = useState({ email: null, loading: false })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const delayTimeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await searchUsers(searchQuery.trim())
        setSearchResults(results)
      } catch (err) {
        console.error('Failed to search users', err)
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(delayTimeoutId)
  }, [searchQuery])

  async function handleInviteUser(email) {
    setInviteStatus({ email, loading: true })
    setError('')
    setSuccess('')

    try {
      await addCollaborator(docId, email)
      setSuccess(`Invited ${email} successfully`)
      if (onAdded) onAdded()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add collaborator')
    } finally {
      setInviteStatus({ email: null, loading: false })
    }
  }

  // Quick check if a user is already a collaborator
  const isCollaborator = (email) => {
    return collaborators && collaborators.some(c => c.userEmail === email)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <h2>Manage Collaborators</h2>

        {error && <div className="error-message" style={{ marginBottom: '12px' }}>{error}</div>}
        {success && <div className="success-message" style={{ marginBottom: '12px' }}>{success}</div>}

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="collab-search">Search Users</label>
          <input
            id="collab-search"
            type="text"
            className="input-field"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {isSearching && <div style={{ fontSize: '13px', color: '#A0A0A0', marginBottom: '12px' }}>Searching...</div>}
        
        {searchResults.length > 0 && (
          <div style={{ ...styles.list, marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
            <label style={styles.listLabel}>Search Results</label>
            {searchResults.map(user => (
              <div key={user.id} style={styles.collabItem}>
                <div style={styles.collabAvatar}>
                  {user.fullName ? user.fullName[0].toUpperCase() : '?'}
                </div>
                <div>
                  <div style={styles.collabName}>{user.fullName}</div>
                  <div style={styles.collabEmail}>{user.email}</div>
                </div>
                {isCollaborator(user.email) ? (
                  <span style={styles.roleBadge}>Added</span>
                ) : (
                  <button 
                    onClick={() => handleInviteUser(user.email)} 
                    className="btn-primary btn-small"
                    style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '12px' }}
                    disabled={inviteStatus.email === user.email && inviteStatus.loading}
                  >
                    {(inviteStatus.email === user.email && inviteStatus.loading) ? 'Adding...' : 'Invite'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {collaborators && collaborators.length > 0 && (
          <div style={styles.list}>
            <label style={styles.listLabel}>Current Collaborators</label>
            {collaborators.map(c => (
              <div key={c.id} style={styles.collabItem}>
                <div style={styles.collabAvatar}>
                  {c.userName ? c.userName[0].toUpperCase() : '?'}
                </div>
                <div>
                  <div style={styles.collabName}>{c.userName}</div>
                  <div style={styles.collabEmail}>{c.userEmail}</div>
                </div>
                <span style={styles.roleBadge}>{c.role}</span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-outline btn-small" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  list: {
    marginTop: '8px',
  },
  listLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#5A5A5A',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '10px',
    display: 'block',
  },
  collabItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    marginBottom: '6px',
    transition: 'background 0.2s'
  },
  collabAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF4D6D, #FFD84D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 700,
    color: '#000',
    flexShrink: 0,
  },
  collabName: {
    fontSize: '14px',
    fontWeight: 500,
  },
  collabEmail: {
    fontSize: '12px',
    color: '#5A5A5A',
  },
  roleBadge: {
    marginLeft: 'auto',
    fontSize: '11px',
    fontWeight: 600,
    color: '#4ECDC4',
    background: 'rgba(78, 205, 196, 0.1)',
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
}
