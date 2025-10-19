import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebaseClient'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        console.log('✅ Utente registrato:', email)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        console.log('✅ Utente loggato:', email)
      }
      
      onLogin()
    } catch (err) {
      console.error('❌ Errore auth:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🏆 eFootballLab</h1>
        <h2 className="login-subtitle">
          {isSignUp ? 'Crea Account' : 'Accedi'}
        </h2>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="inserisci@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Caricamento...
              </>
            ) : (
              isSignUp ? '🚀 Crea Account' : '🔑 Accedi'
            )}
          </button>
        </form>

        <div className="toggle-link">
          {isSignUp ? 'Hai già un account?' : 'Non hai un account?'}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="toggle-button"
          >
            {isSignUp ? ' Accedi' : ' Registrati'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login