import { useAuth } from '../context/AuthContext'

export default function DocumentCard({ document, onOpen, onDelete }) {
  const { user } = useAuth()
  const isOwner = document.ownerId === user?.userId

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  function getPreview(content) {
    if (!content) return 'Empty document'
    const trimmed = content.substring(0, 120)
    return trimmed.length < content.length ? trimmed + '...' : trimmed
  }

  return (
    <div style={styles.card} className="glass-card" onClick={onOpen}>
      <div style={styles.cardTop}>
        <div style={styles.docIcon}>📝</div>
        <div style={styles.badge}>
          {isOwner ? 'Owner' : 'Shared'}
        </div>
      </div>

      <h3 style={styles.title}>{document.title}</h3>
      <p style={styles.preview}>{getPreview(document.content)}</p>

      <div style={styles.cardFooter}>
        <div style={styles.meta}>
          <span style={styles.metaText}>{formatDate(document.updatedAt)}</span>
          <span style={styles.metaDot}>·</span>
          <span style={styles.metaText}>{document.ownerName}</span>
        </div>

        {isOwner && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(); }}
            style={styles.deleteBtn}
            title="Delete document"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: {
    padding: '24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    minHeight: '180px',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docIcon: {
    fontSize: '22px',
  },
  badge: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#3ABEFF',
    background: 'rgba(58, 190, 255, 0.1)',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  title: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  preview: {
    fontSize: '13px',
    color: '#A0A0A0',
    lineHeight: 1.5,
    flex: 1,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  metaText: {
    fontSize: '12px',
    color: '#5A5A5A',
  },
  metaDot: {
    color: '#5A5A5A',
    fontSize: '12px',
  },
  deleteBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    color: '#5A5A5A',
    border: '1px solid transparent',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
}
