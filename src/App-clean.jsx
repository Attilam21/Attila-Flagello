import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebaseClient';
import PrivateRoute from './components/PrivateRoute';
import MatchOCR from './pages/MatchOCR';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
      console.log('🔐 Auth state changed:', user ? 'Logged in' : 'Logged out');
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const handleLogin = () => {
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          ></div>
          <p style={{ color: '#6b7280' }}>Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          🏆 eFootballLab
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                fontSize: '0.875rem',
              }}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setCurrentPage('match-ocr')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor:
                  currentPage === 'match-ocr' ? '#1d4ed8' : '#3b82f6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              ⚽ Match OCR
            </button>
          </div>
          {user && (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span style={{ fontSize: '0.875rem', color: '#e5e7eb' }}>
                👤 {user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && (
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '1.5rem',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: '#1f2937',
                }}
              >
                eFootballLab attivo ✅
              </h1>
              <p
                style={{
                  fontSize: '1.25rem',
                  color: '#6b7280',
                  marginBottom: '2rem',
                }}
              >
                Sistema OCR integrato con Firebase + Google Vision
              </p>
              <div
                style={{
                  backgroundColor: '#dcfce7',
                  border: '1px solid #16a34a',
                  color: '#166534',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                🚀 Sistema pronto per l'analisi dei tabellini eFootball
              </div>
              <div
                style={{
                  backgroundColor: '#dbeafe',
                  border: '1px solid #2563eb',
                  color: '#1e40af',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                👤{' '}
                {user
                  ? `Benvenuto, ${user.email}!`
                  : 'Sistema di autenticazione attivo'}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'match-ocr' && (
          <PrivateRoute onLogin={handleLogin}>
            <MatchOCR user={user} />
          </PrivateRoute>
        )}
      </main>
    </div>
  );
}

export default App;
