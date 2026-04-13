import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={styles.wrapper}>
      <div className="page-bg" />

      {/* Navigation Bar */}
      <nav style={{ ...styles.navbar, background: scrolled ? 'rgba(11, 11, 12, 0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none' }}>
        <div style={styles.navContainer}>
          <div style={styles.logoRow}>
            <span style={styles.logoIcon}>◆</span>
            <span style={styles.logoText}>CollabSpace</span>
          </div>
          <div style={styles.navActions}>
            <Link to="/login" style={styles.navLink}>Sign In</Link>
            <Link to="/register" style={styles.loginBtn}>Get Started</Link>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent} className="fade-in">
            <h1 style={styles.heroHeading}>
              <span style={styles.gradientText}>Unlocking Infinite</span><br />
              Possibilities
            </h1>
            <p style={styles.heroSubheading}>
              Empowering teams to create, edit, and innovate together in real-time. Experience a seamless and premium workflow tailored for the modern enterprise.
            </p>
            <div style={styles.heroActions}>
              <Link to="/register" className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px', borderRadius: '50px' }}>
                Start Collaborating
              </Link>
            </div>
          </div>
        </section>

        {/* Transition Overlay */}
        <div style={styles.transitionGradient}></div>
      </main>
      
      {/* Dynamic CSS for hover effects on this page */}
      <style>{`
        .team-card {
           text-align: center;
           padding: 40px 24px;
           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
           position: relative;
           overflow: hidden;
        }
        .team-card::before {
           content: '';
           position: absolute;
           top: 0; left: 0; right: 0; bottom: 0;
           background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%);
           opacity: 0;
           transition: opacity 0.4s ease;
           pointer-events: none;
        }
        .team-card:hover {
           transform: translateY(-10px);
           border-color: rgba(255,255,255,0.2);
           box-shadow: 0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(58, 190, 255, 0.1);
        }
        .team-card:hover::before {
           opacity: 1;
        }
        .team-card:hover .img-placer {
           transform: scale(1.05);
           box-shadow: 0 0 25px rgba(255,255,255,0.2);
        }
        html {
           scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#0B0B0C',
    color: '#FFF',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflowX: 'hidden'
  },
  navbar: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    padding: '20px 0',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid transparent'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '24px',
    color: '#3ABEFF',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    '@media (max-width: 768px)': { display: 'none' }
  },
  navLink: {
    color: '#A0A0A0',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  navActions: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center'
  },
  loginBtn: {
    padding: '10px 24px',
    background: 'transparent',
    color: '#FFF',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s'
  },
  main: {
    position: 'relative',
    zIndex: 1
  },
  heroSection: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 32px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heroContent: {
    maxWidth: '800px',
    marginTop: '-50px'
  },
  tagline: {
    color: '#3ABEFF',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom: '24px',
    display: 'inline-block',
    padding: '6px 16px',
    background: 'rgba(58, 190, 255, 0.1)',
    borderRadius: '50px',
    border: '1px solid rgba(58, 190, 255, 0.2)'
  },
  heroHeading: {
    fontSize: 'clamp(48px, 6vw, 84px)',
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    marginBottom: '24px',
    color: '#FFFFFF'
  },
  gradientText: {
    background: 'linear-gradient(90deg, #FFFFFF 0%, #A0A0A0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubheading: {
    fontSize: '18px',
    lineHeight: 1.6,
    color: '#A0A0A0',
    marginBottom: '40px',
    maxWidth: '600px',
    fontWeight: 400
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  transitionGradient: {
    height: '150px',
    background: 'linear-gradient(to bottom, transparent, rgba(11, 11, 12, 0.5))',
    width: '100%'
  },
  teamSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 32px 140px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  sectionHeading: {
    fontSize: '36px',
    fontWeight: 700,
    marginBottom: '16px',
    letterSpacing: '-0.02em'
  },
  sectionSubheading: {
    fontSize: '16px',
    color: '#A0A0A0'
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '30px'
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px'
  },
  teamImagePlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: 700,
    color: '#111',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
  },
  teamName: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '6px'
  },
  teamRole: {
    fontSize: '14px',
    color: '#3ABEFF',
    fontWeight: 500,
    marginBottom: '20px'
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px'
  },
  socialIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#A0A0A0',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }
}
