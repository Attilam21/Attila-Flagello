import { useState, useEffect } from 'react'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Eye, 
  Clock, 
  MessageCircle,
  Brain,
  Zap
} from 'lucide-react'

const Home = ({ user }) => {
  console.log('🏠 Home component rendering with user:', user?.email)
  
  const [summary, setSummary] = useState(null)
  const [routineState, setRoutineState] = useState({ running: false, remainingSec: 0 })
  const [coachNote, setCoachNote] = useState('')
  const [showSnackbar, setShowSnackbar] = useState(false)

  // Simula dati fittizi per demo
  useEffect(() => {
    console.log('📊 Loading mock summary data...')
    const mockSummary = {
      kda: { kills: 12, deaths: 3, assists: 8 },
      winRate: 75,
      csPerMin: 8.5,
      dmgPerMin: 450,
      visionScore: 85,
      last5: ['W', 'W', 'L', 'W', 'W'],
      level: 45,
      rank: 'Diamond III'
    }
    setSummary(mockSummary)
    console.log('✅ Mock summary loaded:', mockSummary)
  }, [])

  const handleCoachBoost = () => {
    const motivationalMessages = [
      "🔥 Sei un campione! Continua così!",
      "⚡ La tua determinazione è incredibile!",
      "🏆 Ogni partita ti rende più forte!",
      "💪 La vittoria è nelle tue mani!",
      "🌟 Il tuo potenziale è illimitato!"
    ]
    
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
    setCoachNote(randomMessage)
    setShowSnackbar(true)
    
    setTimeout(() => setShowSnackbar(false), 3000)
  }

  const startRoutine = () => {
    setRoutineState({ running: true, remainingSec: 300 }) // 5 minuti
  }

  const stopRoutine = () => {
    setRoutineState({ running: false, remainingSec: 0 })
  }

  if (!summary) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🏆 Dashboard</h1>
          <p className="text-gray-400">Panoramica delle tue performance</p>
        </div>
        
        <EmptyState
          icon={Trophy}
          title="Nessun dato disponibile"
          description="Inizia a caricare i tuoi match per vedere le statistiche."
          action={
            <Button className="mt-4">
              📊 Vai a Corrispondenza OCR
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="home-header">
        <div>
          <h1 className="home-title">🏆 Dashboard</h1>
          <p className="home-subtitle">Panoramica delle tue performance</p>
        </div>
        
        <div className="user-stats">
          <div className="stat-item">
            <div className="stat-label">Livello</div>
            <div className="stat-value">{summary.level}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Rank</div>
            <div className="stat-rank">{summary.rank}</div>
          </div>
          <div className="user-avatar-large">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Last 5 Games */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📊 Ultimi 5 Match</h3>
        </div>
        <div style={{display: 'flex', gap: '8px'}}>
          {summary.last5.map((result, index) => (
            <span 
              key={index} 
              className={`badge ${result === 'W' ? 'success' : 'error'}`}
              style={{fontSize: '16px', padding: '8px 12px'}}
            >
              {result}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">Win Rate</div>
              <div className="kpi-value">{summary.winRate}%</div>
            </div>
            <div className="kpi-icon green">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">KDA AVG</div>
              <div className="kpi-value">
                {summary.kda.kills}/{summary.kda.deaths}/{summary.kda.assists}
              </div>
            </div>
            <div className="kpi-icon blue">
              <Target size={20} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">CS/min</div>
              <div className="kpi-value">{summary.csPerMin}</div>
            </div>
            <div className="kpi-icon yellow">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">DMG/min</div>
              <div className="kpi-value">{summary.dmgPerMin}</div>
            </div>
            <div className="kpi-icon red">
              <Zap size={20} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div>
              <div className="kpi-label">Vision Score</div>
              <div className="kpi-value">{summary.visionScore}</div>
            </div>
            <div className="kpi-icon purple">
              <Eye size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Routine Anti-Tilt */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🧘 Routine Anti-Tilt</h3>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <p style={{fontSize: '14px', color: '#9CA3AF', marginBottom: '8px'}}>
              {routineState.running ? 'Routine in corso...' : 'Pausa consigliata tra le partite'}
            </p>
            {routineState.running && (
              <p style={{fontSize: '18px', fontWeight: '600', color: '#10B981'}}>
                {Math.floor(routineState.remainingSec / 60)}:{(routineState.remainingSec % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            {!routineState.running ? (
              <button onClick={startRoutine} className="btn btn-primary">
                🚀 Inizia Routine
              </button>
            ) : (
              <button onClick={stopRoutine} className="btn btn-destructive">
                ⏹️ Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coach Motivazionale */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">💬 Coach Motivazionale</h3>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <p style={{fontSize: '14px', color: '#9CA3AF', marginBottom: '8px'}}>Hai bisogno di una spinta?</p>
            {coachNote && (
              <p style={{color: '#10B981', fontWeight: '500', marginTop: '4px'}}>"{coachNote}"</p>
            )}
          </div>
          <button onClick={handleCoachBoost} className="btn btn-primary">
            <Brain size={16} />
            Dammi un nuovo boost
          </button>
        </div>
      </div>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="snackbar">
          ✅ Coach boost inviato!
        </div>
      )}
    </div>
  )
}

export default Home
