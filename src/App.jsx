import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebaseClient';
import SideNav from './components/layout/SideNav';
import Home from './pages/Home';
import Login from './pages/Login';
import Rosa from './pages/Rosa';
import CaricaUltimaPartita from './pages/CaricaUltimaPartita';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    console.log('🚀 App starting, setting up auth listener...');

    let timeoutId;
    let unsubscribe;

    try {
      timeoutId = setTimeout(() => {
        console.log('⏰ Auth timeout, setting loading to false');
        setLoading(false);
      }, 5000);

      unsubscribe = onAuthStateChanged(auth, user => {
        console.log('🔐 Auth state changed:', user ? `Logged in as ${user.email}` : 'Logged out');
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        setUser(user);
        setLoading(false);
      });
    } catch (error) {
      console.error('❌ Error setting up auth listener:', error);
      setLoading(false);
    }

    return () => {
      console.log('🧹 Cleaning up auth listener');
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch (error) {
          console.error('❌ Error during cleanup:', error);
        }
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Logout successful');
      setCurrentPage('home');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const handleLogin = () => {
    console.log('🔑 Login callback triggered');
    const current = auth.currentUser;
    if (current) {
      console.log('✅ Found current user:', current.email);
      setUser(current);
      setCurrentPage('home');
    } else {
      console.log('❌ No current user found');
    }
  };

  const handlePageChange = (page) => {
    console.log('📄 Page change requested:', page);
    setCurrentPage(page);
    console.log('✅ Page changed to:', page);
  };

  console.log('🎯 App render state:', {
    loading,
    user: user?.email,
    currentPage,
  });

  if (loading) {
    console.log('⏳ Showing loading screen...');
    return (
      <div className="login-container">
        <div className="text-center">
          <div
            className="loading-spinner"
            style={{ width: '48px', height: '48px', margin: '0 auto 16px' }}
          ></div>
          <p style={{ color: '#9CA3AF' }}>Caricamento...</p>
        </div>
      </div>
    );
  }

  // Se non autenticato, mostra Login
  if (!user) {
    console.log('🔑 Showing login screen...');
    return <Login onLogin={handleLogin} />;
  }

  console.log('🏠 Showing main app with user:', user.email);

  const renderPage = () => {
    console.log('🎯 Rendering page:', currentPage);

    switch (currentPage) {
      case 'home':
        console.log('🏠 Rendering Home page');
        return <Home user={user} onPageChange={handlePageChange} />;
      case 'rosa':
        console.log('👥 Rendering Rosa page');
        return <Rosa onPageChange={handlePageChange} />;
      case 'carica-partita':
        console.log('📸 Rendering Carica Partita page');
        return <CaricaUltimaPartita onPageChange={handlePageChange} />;
      case 'statistiche':
        console.log('📊 Rendering Statistiche page');
        return <div className="page-placeholder">📊 Statistiche Avanzate - In sviluppo</div>;
      case 'suggerimenti':
        console.log('💡 Rendering Suggerimenti page');
        return <div className="page-placeholder">💡 Suggerimenti Formazione - In sviluppo</div>;
      case 'contromisure':
        console.log('🛡️ Rendering Contromisure page');
        return <div className="page-placeholder">🛡️ Contromisure - In sviluppo</div>;
      default:
        console.log('🏠 Rendering default Home page');
        return <Home user={user} onPageChange={handlePageChange} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <SideNav
          currentPage={currentPage}
          onPageChange={handlePageChange}
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">{renderPage()}</main>
      </div>
    </ErrorBoundary>
  );
}

export default App;