import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './services/firebaseClient'
import Login from './pages/Login'
import Match from './pages/Match'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={() => setCurrentPage('home')} />
  }

  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🏆 eFootballLab</h1>
          <div className="flex items-center space-x-4">
            <div className="space-x-2">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded ${currentPage === 'home' ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                🏠 Home
              </button>
              <button 
                onClick={() => setCurrentPage('match')}
                className={`px-4 py-2 rounded ${currentPage === 'match' ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                ⚽ Match OCR
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">
                👤 {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'home' && (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">eFootballLab attivo ✅</h1>
              <p className="text-xl text-gray-600 mb-8">
                Sistema OCR integrato con Firebase + Google Vision
              </p>
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                🚀 Sistema pronto per l'analisi dei tabellini eFootball
              </div>
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                👤 Benvenuto, {user.email}!
              </div>
            </div>
          </div>
        )}
        
        {currentPage === 'match' && <Match user={user} />}
      </main>
    </>
  )
}

export default App
