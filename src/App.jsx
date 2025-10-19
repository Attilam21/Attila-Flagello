import { useState } from 'react'
import Match from './pages/Match'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🏆 eFootballLab</h1>
          <div className="space-x-4">
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
            </div>
          </div>
        )}
        
        {currentPage === 'match' && <Match />}
      </main>
    </>
  )
}

export default App
