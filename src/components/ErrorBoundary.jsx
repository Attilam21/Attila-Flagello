import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Filtra errori non critici
    if (
      error.message &&
      (error.message.includes('translate') ||
        error.message.includes('translate.googleapis.com') ||
        error.message.includes('ERR_BLOCKED_BY_CLIENT') ||
        error.message.includes('Google'))
    ) {
      console.warn('⚠️ Ignoring non-critical error:', error.message);
      return null; // Non mostra error boundary per errori Google Translate
    }

    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ErrorBoundary caught an error:', error, errorInfo);

    // Filtra errori non critici anche qui
    if (
      error.message &&
      (error.message.includes('translate') ||
        error.message.includes('translate.googleapis.com') ||
        error.message.includes('ERR_BLOCKED_BY_CLIENT') ||
        error.message.includes('Google'))
    ) {
      console.warn(
        '⚠️ Ignoring non-critical error in componentDidCatch:',
        error.message
      );
      this.setState({ hasError: false, error: null, errorInfo: null });
      return;
    }

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>⚠️ Qualcosa è andato storto</h2>
            <p>Si è verificato un errore. Ricarica la pagina per riprovare.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              🔄 Ricarica Pagina
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '1rem', color: '#ccc' }}>
                <summary>Dettagli Errore (Dev)</summary>
                <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
