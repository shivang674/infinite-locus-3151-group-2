import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchDocument, updateDocument, fetchVersions, revertToVersion, fetchCollaborators, deleteDocument } from '../services/documentService'
import { connectWebSocket, sendEdit, disconnectWebSocket } from '../services/websocketService'
import VersionPanel from '../components/VersionPanel'
import CollaboratorModal from '../components/CollaboratorModal'
import ActiveUsers from '../components/ActiveUsers'

export default function EditorPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [document, setDocument] = useState(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [showVersions, setShowVersions] = useState(false)
  const [showCollabs, setShowCollabs] = useState(false)
  const [versions, setVersions] = useState([])
  const [collaborators, setCollaborators] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [wsConnected, setWsConnected] = useState(false)

  const editorRef = useRef(null)
  const skipNextWsUpdate = useRef(false)
  const saveTimeoutRef = useRef(null)

  useEffect(() => {
    loadDocument()
    return () => {
      disconnectWebSocket()
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [id])

  async function loadDocument() {
    try {
      const doc = await fetchDocument(id)
      setDocument(doc)
      setContent(doc.content || '')

      connectWebSocket(
        id,
        handleWebSocketMessage,
        () => {
          setWsConnected(true)
          setActiveUsers(prev => {
            const exists = prev.find(u => u.userId === user.userId)
            if (exists) return prev
            return [...prev, { userId: user.userId, userName: user.fullName }]
          })
        }
      )
    } catch (err) {
      alert('Failed to load document')
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  function handleWebSocketMessage(message) {
    if (message.userId === user.userId) return

    skipNextWsUpdate.current = true
    setContent(message.content)

    setActiveUsers(prev => {
      const exists = prev.find(u => u.userId === message.userId)
      if (exists) return prev
      return [...prev, { userId: message.userId, userName: message.userName }]
    })
  }

  const handleContentChange = useCallback((e) => {
    const newContent = e.target.value
    setContent(newContent)

    if (skipNextWsUpdate.current) {
      skipNextWsUpdate.current = false
      return
    }

    sendEdit(id, newContent, user.userId, user.fullName)

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      autoSave(newContent)
    }, 3000)
  }, [id, user])

  async function autoSave(text) {
    setSaveStatus('Saving...')
    try {
      await updateDocument(id, text)
      setSaveStatus('Saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (err) {
      setSaveStatus('Save failed')
    }
  }

  async function handleManualSave() {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    setIsSaving(true)
    setSaveStatus('Saving...')
    try {
      await updateDocument(id, content)
      setSaveStatus('Saved')
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (err) {
      setSaveStatus('Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleShowVersions() {
    try {
      const v = await fetchVersions(id)
      setVersions(v)
      setShowVersions(true)
    } catch (err) {
      alert('Failed to load version history')
    }
  }

  async function handleRevert(versionId) {
    if (!window.confirm('Restore this version? Current content will be saved as a new version.')) return
    try {
      const updated = await revertToVersion(id, versionId)
      setContent(updated.content)
      sendEdit(id, updated.content, user.userId, user.fullName)
      const v = await fetchVersions(id)
      setVersions(v)
    } catch (err) {
      alert('Failed to revert')
    }
  }

  async function handleShowCollabs() {
    try {
      const c = await fetchCollaborators(id)
      setCollaborators(c)
      setShowCollabs(true)
    } catch (err) {
      alert('Failed to load collaborators')
    }
  }

  async function handleCollabAdded() {
    const c = await fetchCollaborators(id)
    setCollaborators(c)
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleManualSave()
    }
  }

  function handleDownload() {
    const element = window.document.createElement("a")
    const file = new Blob([content], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = (document?.title || "Document") + ".txt"
    window.document.body.appendChild(element)
    element.click()
    window.document.body.removeChild(element)
  }

  async function handleDeleteDocument() {
    if (!window.confirm('Are you strictly sure you want to completely delete this document forever?')) return
    try {
      await deleteDocument(id)
      navigate('/dashboard')
    } catch (err) {
      alert('Failed to delete document. Ensure you have the correct permissions.')
    }
  }

  if (isLoading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
        <p style={{ color: '#A0A0A0', marginTop: '16px' }}>Loading document...</p>
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            ← Back
          </button>
          <div style={styles.docInfo}>
            <h2 style={styles.docTitle}>{document?.title}</h2>
            <div style={styles.statusRow}>
              <span style={{
                ...styles.wsIndicator,
                background: wsConnected ? '#4ECDC4' : '#FF4D6D'
              }} />
              <span style={styles.statusText}>
                {wsConnected ? 'Connected' : 'Disconnected'}
              </span>
              {saveStatus && (
                <>
                  <span style={styles.statusDot}>·</span>
                  <span style={styles.statusText}>{saveStatus}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={styles.toolbarRight}>
          <ActiveUsers users={activeUsers} />
          <button onClick={handleDeleteDocument} className="btn-outline btn-small" style={{ borderColor: 'rgba(255,77,109,0.5)', color: '#FF4D6D' }}>
            Delete
          </button>
          <button onClick={handleDownload} className="btn-outline btn-small">
            Download
          </button>
          <button onClick={handleShowCollabs} className="btn-outline btn-small">
            Share
          </button>
          <button onClick={handleShowVersions} className="btn-outline btn-small">
            History
          </button>
          <button
            onClick={handleManualSave}
            className="btn-primary btn-small"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div style={styles.editorArea}>
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          style={styles.textarea}
          placeholder="Start typing your document here..."
          spellCheck={false}
        />

        {showVersions && (
          <VersionPanel
            versions={versions}
            onRevert={handleRevert}
            onClose={() => setShowVersions(false)}
          />
        )}
      </div>

      {showCollabs && (
        <CollaboratorModal
          docId={id}
          collaborators={collaborators}
          onClose={() => setShowCollabs(false)}
          onAdded={handleCollabAdded}
        />
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0B0B0C',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: 'rgba(17, 17, 20, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    gap: '16px',
    flexWrap: 'wrap',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  backBtn: {
    background: 'transparent',
    color: '#A0A0A0',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  docInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  docTitle: {
    fontSize: '16px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  wsIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  statusText: {
    fontSize: '11px',
    color: '#5A5A5A',
  },
  statusDot: {
    color: '#5A5A5A',
    fontSize: '11px',
  },
  editorArea: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  textarea: {
    flex: 1,
    padding: '40px 60px',
    background: 'transparent',
    border: 'none',
    color: '#E8E8ED',
    fontSize: '16px',
    lineHeight: 1.8,
    resize: 'none',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    outline: 'none',
  },
  loadingWrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#3ABEFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}
