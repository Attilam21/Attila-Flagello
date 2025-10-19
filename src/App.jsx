import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './services/firebaseClient'
import SideNav from './components/layout/SideNav'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Rosa from './pages/Rosa'
import Match from './pages/Match'
import Statistiche from './pages/Statistiche'
import Avversario from './pages/Avversario'
import Login from './pages/Login'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    console.log('🚀 App starting, setting up auth listener...')
    
    // Timeout di sicurezza per evitare loading infinito
    const timeoutId = setTimeout(() => {
      console.log('⏰ Auth timeout, setting loading to false')
      setLoading(false)
    }, 5000)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Auth state changed:', user ? `Logged in as ${user.email}` : 'Logged out')
      clearTimeout(timeoutId)
      setUser(user)
      setLoading(false)
    })

    return () => {
      console.log('🧹 Cleaning up auth listener')
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      console.log('✅ Logout successful')
      setCurrentPage('home')
    } catch (error) {
      console.error('❌ Logout error:', error)
    }
  }

  const handleLogin = () => {
    setCurrentPage('home')
  }

  console.log('🎯 App render state:', { loading, user: user?.email, currentPage })

  if (loading) {
    console.log('⏳ Showing loading screen...')
    return (
      <div className="login-container">
        <div className="text-center">
          <div className="loading-spinner" style={{width: '48px', height: '48px', margin: '0 auto 16px'}}></div>
          <p style={{color: '#9CA3AF'}}>Caricamento...</p>
        </div>
      </div>
    )
  }

  // Se non autenticato, mostra Login
  if (!user) {
    console.log('🔑 Showing login screen...')
    return (
      <div>
        <Login onLogin={handleLogin} />
        {/* Pulsante di test per bypassare Firebase */}
        <div style={{position: 'fixed', top: '20px', right: '20px', zIndex: 1000}}>
          <button 
            onClick={() => {
              console.log('🧪 Test login bypass')
              setUser({ email: 'test@example.com', uid: 'test123' })
              setLoading(false)
            }}
            style={{
              padding: '8px 16px',
              background: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🧪 Test Login
          </button>
        </div>
      </div>
    )
  }

  console.log('🏠 Showing main app with user:', user.email)

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home user={user} />
      case 'dashboard':
        return <Dashboard />
      case 'rosa':
        return <Rosa />
      case 'match':
        return <Match />
      case 'statistiche':
        return <Statistiche />
      case 'avversario':
        return <Avversario />
      default:
        return <Home user={user} />
    }
  }

  return (
    <div className="app-container">
      <SideNav 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App