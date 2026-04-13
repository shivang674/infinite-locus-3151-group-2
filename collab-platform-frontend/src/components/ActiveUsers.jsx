export default function ActiveUsers({ users }) {
  if (!users || users.length === 0) return null

  const colors = ['#3ABEFF', '#FFD84D', '#FF4D6D', '#4ECDC4', '#B388FF']

  return (
    <div style={styles.container}>
      {users.map((u, idx) => (
        <div
          key={u.userId || idx}
          style={{
            ...styles.avatar,
            background: colors[idx % colors.length],
            marginLeft: idx > 0 ? '-8px' : '0',
            zIndex: users.length - idx,
          }}
          title={u.userName}
        >
          {u.userName ? u.userName[0].toUpperCase() : '?'}
        </div>
      ))}
      <span style={styles.label}>
        {users.length} online
      </span>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    color: '#000',
    border: '2px solid #0B0B0C',
    position: 'relative',
  },
  label: {
    fontSize: '12px',
    color: '#4ECDC4',
    fontWeight: 500,
    marginLeft: '8px',
  },
}
