import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import DocumentCard from '../components/DocumentCard'
import CreateDocModal from '../components/CreateDocModal'
import { fetchDocuments, deleteDocument, createDocument } from '../services/documentService'

export default function DashboardPage() {
  const [documents, setDocuments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  function handleFileImport(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        setIsLoading(true)
        const text = evt.target.result
        const doc = await createDocument(file.name.replace(/\.[^/.]+$/, ""), text)
        setDocuments(prev => [doc, ...prev])
      } catch (err) {
        alert('Failed to import document')
      } finally {
        setIsLoading(false)
        e.target.value = null
      }
    }
    reader.readAsText(file)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  async function loadDocuments() {
    try {
      const data = await fetchDocuments()
      setDocuments(data)
    } catch (err) {
      console.error('Failed to load documents', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    try {
      await deleteDocument(id)
      setDocuments(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete')
    }
  }

  function handleCreated(doc) {
    setDocuments(prev => [doc, ...prev])
    setShowCreate(false)
  }

  const filtered = documents.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page-bg" />

      <main style={styles.main}>
        <div style={styles.topSection}>
          <div>
            <h1 style={styles.heading}>Your Documents</h1>
            <p style={styles.subheading}>
              {documents.length} document{documents.length !== 1 ? 's' : ''} in your workspace
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="file"
              accept=".txt,.md"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileImport}
            />
            <button className="btn-outline" onClick={() => fileInputRef.current?.click()}>
              <span style={{ fontSize: '18px' }}>↑</span>
              Import
            </button>
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              <span style={{ fontSize: '18px' }}>+</span>
              New Document
            </button>
          </div>
        </div>

        <div style={styles.searchRow}>
          <input
            type="text"
            className="input-field"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </div>

        {isLoading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner} />
            <p style={{ color: '#A0A0A0' }}>Loading your documents...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📄</div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
              {searchTerm ? 'No matching documents' : 'No documents yet'}
            </h3>
            <p style={{ color: '#A0A0A0', fontSize: '14px' }}>
              {searchTerm ? 'Try a different search term' : 'Create your first document to get started'}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onOpen={() => navigate(`/editor/${doc.id}`)}
                onDelete={() => handleDelete(doc.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <CreateDocModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}

const styles = {
  main: {
    flex: 1,
    padding: '40px 48px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  topSection: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  heading: {
    fontSize: '30px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    marginBottom: '6px',
  },
  subheading: {
    fontSize: '14px',
    color: '#A0A0A0',
  },
  searchRow: {
    marginBottom: '32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    animation: 'fadeIn 0.5s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  loadingState: {
    textAlign: 'center',
    padding: '80px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
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

const spinKeyframes = document.createElement('style')
spinKeyframes.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
document.head.appendChild(spinKeyframes)
