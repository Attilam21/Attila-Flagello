import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './services/firebaseClient'
import SideNav from './components/layout/SideNav'
import Dashboard from './pages/Dashboard'
import Rosa from './pages/Rosa'
import Match from './pages/Match'
import Statistiche from './pages/Statistiche'
import Avversario from './pages/Avversario'
import Login from './pages/Login'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      console.log('🔐 Auth state changed:', user ? 'Logged in' : 'Logged out')
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Logout error:', error)
    }
  }

  const handleLogin = () => {
    setCurrentPage('dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'rosa':
        return <Rosa />
      case 'match':
        return <Match />
      case 'statistiche':
        return <Statistiche />
      case 'avversario':
        return <Avversario />
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <SideNav 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6">
        {renderPage()}
      </main>
    </div>
  )
}

export default App