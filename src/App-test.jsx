import { useState } from 'react'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
    }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          🏆 eFootballLab
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setCurrentPage('home')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: currentPage === 'home' ? '#1d4ed8' : '#3b82f6',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            🏠 Home
          </button>
          <button 
            onClick={() => setCurrentPage('login')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: currentPage === 'login' ? '#1d4ed8' : '#3b82f6',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            🔑 Login
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem'
      }}>
        {currentPage === 'home' && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>
              eFootballLab attivo ✅
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              Sistema OCR integrato con Firebase + Google Vision
            </p>
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #16a34a',
              color: '#166534',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              🚀 Sistema pronto per l'analisi dei tabellini eFootball
            </div>
            <div style={{
              backgroundColor: '#dbeafe',
              border: '1px solid #2563eb',
              color: '#1e40af',
              borderRadius: '0.5rem',
              padding: '1rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              👤 Test UI - Firebase integration in corso
            </div>
          </div>
        )}
        
        {currentPage === 'login' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              🔑 Login Test
            </h2>
            <p style={{ color: '#6b7280', textAlign: 'center' }}>
              Pagina Login - Firebase integration in corso
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
