import { useState } from 'react'
import { Home, Users, Target, BarChart3, UserCheck, LogOut } from 'lucide-react'

// Versione semplificata per test
function AppTest() {
  const [user, setUser] = useState({ email: 'test@example.com' }) // Mock user
  const [currentPage, setCurrentPage] = useState('home')

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'rosa', label: 'Rosa', icon: Users },
    { id: 'match', label: 'Match', icon: Target },
    { id: 'statistiche', label: 'Statistiche', icon: BarChart3 },
    { id: 'avversario', label: 'Avversario', icon: UserCheck }
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">🏆 Dashboard</h1>
                <p className="text-gray-400">Panoramica delle tue performance</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Livello</div>
                  <div className="text-xl font-bold text-white">45</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Rank</div>
                  <div className="text-lg font-semibold text-yellow-500">Diamond III</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  T
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                    <div className="text-2xl font-bold text-white">75%</div>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <BarChart3 size={20} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">KDA AVG</div>
                    <div className="text-2xl font-bold text-white">12/3/8</div>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target size={20} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">CS/min</div>
                    <div className="text-2xl font-bold text-white">8.5</div>
                  </div>
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Users size={20} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">DMG/min</div>
                    <div className="text-2xl font-bold text-white">450</div>
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Target size={20} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">Vision Score</div>
                    <div className="text-2xl font-bold text-white">85</div>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <UserCheck size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Test Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">🧪 Test Card</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Se vedi questa card, l'app funziona!</p>
                  <p className="text-green-500 font-medium">✅ Rendering corretto</p>
                </div>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Test Button
                </button>
              </div>
            </div>
          </div>
        )
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Panoramica generale del tuo eFootballLab</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Statistiche</h3>
              <p className="text-gray-400">Qui vedrai le tue statistiche principali</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{currentPage}</h1>
              <p className="text-gray-400">Pagina {currentPage}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <p className="text-gray-400">Contenuto della pagina {currentPage}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">🏆 eFootballLab</h1>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentPage === item.id 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-400 flex-1 truncate">
              {user.email}
            </span>
            <button className="text-gray-400 hover:text-white">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {renderPage()}
      </main>
    </div>
  )
}

export default AppTest