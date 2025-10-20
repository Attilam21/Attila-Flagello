import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseClient';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ User created successfully');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ User signed in successfully');
      }
      
      if (onLogin) {
        onLogin();
      }
    } catch (error) {
      console.error('❌ Auth error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Utente non trovato. Verifica l\'email.';
      case 'auth/wrong-password':
        return 'Password errata.';
      case 'auth/email-already-in-use':
        return 'Email già in uso.';
      case 'auth/weak-password':
        return 'Password troppo debole.';
      case 'auth/invalid-email':
        return 'Email non valida.';
      case 'auth/too-many-requests':
        return 'Troppi tentativi. Riprova più tardi.';
      default:
        return 'Errore di autenticazione. Riprova.';
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">🏆</div>
            <h1 className="logo-title">eFootballLab</h1>
          </div>
          <p className="login-subtitle">
            {isSignUp ? 'Crea il tuo account' : 'Accedi al tuo account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-container">
              <Mail className="input-icon" size={20} />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="inserisci@email.com"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci password"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <div className="loading-spinner-small" />
            ) : (
              <>
                {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isSignUp ? 'Crea Account' : 'Accedi'}
              </>
            )}
          </Button>
        </form>

        <div className="login-footer">
          <p className="switch-mode-text">
            {isSignUp ? 'Hai già un account?' : 'Non hai un account?'}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="switch-mode-button"
          >
            {isSignUp ? 'Accedi' : 'Registrati'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;