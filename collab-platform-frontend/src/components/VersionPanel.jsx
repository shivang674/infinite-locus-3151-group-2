export default function VersionPanel({ versions, onRevert, onClose }) {
  function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h3 style={styles.title}>Version History</h3>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>

      <div style={styles.list}>
        {versions.length === 0 ? (
          <p style={styles.empty}>No previous versions yet. Versions are created when you save changes.</p>
        ) : (
          versions.map((v, idx) => (
            <div key={v.id} style={styles.item}>
              <div style={styles.itemTop}>
                <span style={styles.versionNum}>v{versions.length - idx}</span>
                <span style={styles.date}>{formatDate(v.createdAt)}</span>
              </div>
              <div style={styles.editedBy}>by {v.editedBy}</div>
              <div style={styles.preview}>
                {v.content ? v.content.substring(0, 80) + (v.content.length > 80 ? '...' : '') : 'Empty'}
              </div>
              <button
                onClick={() => onRevert(v.id)}
                style={styles.revertBtn}
              >
                Restore this version
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  panel: {
    width: '320px',
    height: '100%',
    background: '#111114',
    borderLeft: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#5A5A5A',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '4px',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
  },
  empty: {
    fontSize: '13px',
    color: '#5A5A5A',
    lineHeight: 1.6,
  },
  item: {
    padding: '14px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    marginBottom: '10px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  itemTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  versionNum: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#3ABEFF',
  },
  date: {
    fontSize: '11px',
    color: '#5A5A5A',
  },
  editedBy: {
    fontSize: '12px',
    color: '#A0A0A0',
    marginBottom: '8px',
  },
  preview: {
    fontSize: '12px',
    color: '#5A5A5A',
    lineHeight: 1.4,
    marginBottom: '10px',
  },
  revertBtn: {
    width: '100%',
    padding: '7px',
    background: 'rgba(58, 190, 255, 0.08)',
    color: '#3ABEFF',
    border: '1px solid rgba(58, 190, 255, 0.15)',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
}
