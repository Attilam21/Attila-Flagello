import { useState } from 'react'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
    },
    nav: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    navTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold'
    },
    navButtons: {
      display: 'flex',
      gap: '0.5rem'
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      backgroundColor: '#1d4ed8',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.5rem'
    },
    homeContainer: {
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1f2937'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#6b7280',
      marginBottom: '2rem'
    },
    card: {
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    greenCard: {
      backgroundColor: '#dcfce7',
      border: '1px solid #16a34a',
      color: '#166534'
    },
    blueCard: {
      backgroundColor: '#dbeafe',
      border: '1px solid #2563eb',
      color: '#1e40af'
    },
    matchContainer: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    },
    matchTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    }
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.navTitle}>🏆 eFootballLab</h1>
        <div style={styles.navButtons}>
          <button 
            onClick={() => setCurrentPage('home')}
            style={styles.button}
          >
            🏠 Home
          </button>
          <button 
            onClick={() => setCurrentPage('match')}
            style={styles.button}
          >
            ⚽ Match OCR
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        {currentPage === 'home' && (
          <div style={styles.homeContainer}>
            <h1 style={styles.title}>eFootballLab attivo ✅</h1>
            <p style={styles.subtitle}>
              Sistema OCR integrato con Firebase + Google Vision
            </p>
            <div style={{...styles.card, ...styles.greenCard}}>
              🚀 Sistema pronto per l'analisi dei tabellini eFootball
            </div>
            <div style={{...styles.card, ...styles.blueCard}}>
              👤 Test UI - Firebase integration in corso
            </div>
          </div>
        )}
        
        {currentPage === 'match' && (
          <div style={styles.matchContainer}>
            <h2 style={styles.matchTitle}>⚽ Match OCR</h2>
            <p style={{color: '#6b7280'}}>Pagina Match - Firebase integration in corso</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
