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
        // Registrazione
        await createUserWithEmailAndPassword(auth, email, password)
        console.log('✅ Utente registrato:', email)
      } else {
        // Login
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

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
    },
    card: {
      maxWidth: '400px',
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '2rem'
    },
    title: {
      textAlign: 'center',
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    subtitle: {
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '2rem'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem'
    },
    toggle: {
      textAlign: 'center',
      marginTop: '1rem'
    },
    toggleButton: {
      color: '#2563eb',
      textDecoration: 'none',
      fontSize: '0.875rem',
      cursor: 'pointer',
      background: 'none',
      border: 'none'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏆 eFootballLab</h2>
        <p style={styles.subtitle}>
          {isSignUp ? 'Crea il tuo account' : 'Accedi al tuo account'}
        </p>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? '⏳ Caricamento...' : (isSignUp ? '📝 Registrati' : '🔑 Accedi')}
          </button>

          {error && (
            <div style={styles.error}>
              ❌ {error}
            </div>
          )}

          <div style={styles.toggle}>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={styles.toggleButton}
            >
              {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login