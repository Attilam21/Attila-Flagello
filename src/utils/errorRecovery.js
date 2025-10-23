// Gestione errori e retry logic per Firebase
class ErrorRecoveryManager {
  constructor() {
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    };

    this.errorTypes = {
      NETWORK_ERROR: 'network_error',
      PERMISSION_ERROR: 'permission_error',
      QUOTA_EXCEEDED: 'quota_exceeded',
      UNAVAILABLE: 'unavailable',
      TIMEOUT: 'timeout',
    };

    this.errorHandlers = new Map();
    this.setupDefaultHandlers();
  }

  // Setup default error handlers
  setupDefaultHandlers() {
    this.errorHandlers.set(
      this.errorTypes.NETWORK_ERROR,
      this.handleNetworkError.bind(this)
    );
    this.errorHandlers.set(
      this.errorTypes.PERMISSION_ERROR,
      this.handlePermissionError.bind(this)
    );
    this.errorHandlers.set(
      this.errorTypes.QUOTA_EXCEEDED,
      this.handleQuotaExceeded.bind(this)
    );
    this.errorHandlers.set(
      this.errorTypes.UNAVAILABLE,
      this.handleUnavailable.bind(this)
    );
    this.errorHandlers.set(
      this.errorTypes.TIMEOUT,
      this.handleTimeout.bind(this)
    );
  }

  // Classifica tipo di errore
  classifyError(error) {
    if (!error || !error.code) {
      return this.errorTypes.NETWORK_ERROR;
    }

    switch (error.code) {
      case 'permission-denied':
        return this.errorTypes.PERMISSION_ERROR;
      case 'quota-exceeded':
        return this.errorTypes.QUOTA_EXCEEDED;
      case 'unavailable':
        return this.errorTypes.UNAVAILABLE;
      case 'timeout':
        return this.errorTypes.TIMEOUT;
      default:
        return this.errorTypes.NETWORK_ERROR;
    }
  }

  // Gestione errore di rete
  handleNetworkError(error, context) {
    console.log('🌐 Errore di rete rilevato, tentativo di riconnessione...');

    return {
      shouldRetry: true,
      delay: this.calculateDelay(context.retryCount),
      action: 'retry',
    };
  }

  // Gestione errore di permessi
  handlePermissionError(error, context) {
    console.error('🔒 Errore di permessi:', error.message);

    return {
      shouldRetry: false,
      action: 'show_error',
      message: 'Non hai i permessi per eseguire questa operazione',
    };
  }

  // Gestione quota superata
  handleQuotaExceeded(error, context) {
    console.error('📊 Quota superata:', error.message);

    return {
      shouldRetry: false,
      action: 'show_error',
      message: 'Limite di utilizzo raggiunto. Riprova più tardi.',
    };
  }

  // Gestione servizio non disponibile
  handleUnavailable(error, context) {
    console.log('⚠️ Servizio non disponibile, riprovo...');

    return {
      shouldRetry: true,
      delay: this.calculateDelay(context.retryCount),
      action: 'retry',
    };
  }

  // Gestione timeout
  handleTimeout(error, context) {
    console.log('⏱️ Timeout rilevato, riprovo...');

    return {
      shouldRetry: true,
      delay: this.calculateDelay(context.retryCount),
      action: 'retry',
    };
  }

  // Calcola delay per retry
  calculateDelay(retryCount) {
    const delay = Math.min(
      this.retryConfig.baseDelay *
        Math.pow(this.retryConfig.backoffMultiplier, retryCount),
      this.retryConfig.maxDelay
    );

    // Aggiungi jitter per evitare thundering herd
    return delay + Math.random() * 1000;
  }

  // Esegui operazione con retry
  async executeWithRetry(operation, context = {}) {
    let retryCount = 0;
    const maxRetries = context.maxRetries || this.retryConfig.maxRetries;

    while (retryCount <= maxRetries) {
      try {
        const result = await operation();

        if (retryCount > 0) {
          console.log(`✅ Operazione riuscita dopo ${retryCount} tentativi`);
        }

        return result;
      } catch (error) {
        const errorType = this.classifyError(error);
        const handler = this.errorHandlers.get(errorType);

        if (!handler) {
          console.error('❌ Handler non trovato per tipo errore:', errorType);
          throw error;
        }

        const response = handler(error, { ...context, retryCount });

        if (!response.shouldRetry || retryCount >= maxRetries) {
          if (response.action === 'show_error') {
            this.showErrorToUser(response.message);
          }
          throw error;
        }

        retryCount++;
        console.log(
          `🔄 Tentativo ${retryCount}/${maxRetries} dopo ${response.delay}ms`
        );

        await this.delay(response.delay);
      }
    }
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mostra errore all'utente
  showErrorToUser(message) {
    // Implementa la logica per mostrare errori all'utente
    console.error('🚨 Errore utente:', message);

    // Esempio: mostra toast o modal di errore
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(message);
    }
  }

  // Gestione errori specifici per Firebase
  handleFirebaseError(error, operation) {
    console.error(`❌ Errore Firebase in ${operation}:`, error);

    const errorInfo = {
      code: error.code,
      message: error.message,
      operation,
      timestamp: new Date().toISOString(),
    };

    // Log errore per debugging
    this.logError(errorInfo);

    // Gestisci errori specifici
    switch (error.code) {
      case 'permission-denied':
        return this.handlePermissionDenied(error);
      case 'not-found':
        return this.handleNotFound(error);
      case 'already-exists':
        return this.handleAlreadyExists(error);
      case 'failed-precondition':
        return this.handleFailedPrecondition(error);
      default:
        return this.handleGenericError(error);
    }
  }

  // Gestione permessi negati
  handlePermissionDenied(error) {
    console.error('🔒 Permessi negati:', error.message);

    return {
      type: 'permission_error',
      message: 'Non hai i permessi per eseguire questa operazione',
      action: 'check_auth',
    };
  }

  // Gestione documento non trovato
  handleNotFound(error) {
    console.error('🔍 Documento non trovato:', error.message);

    return {
      type: 'not_found',
      message: 'Il documento richiesto non esiste',
      action: 'show_empty_state',
    };
  }

  // Gestione documento già esistente
  handleAlreadyExists(error) {
    console.error('⚠️ Documento già esistente:', error.message);

    return {
      type: 'already_exists',
      message: 'Il documento esiste già',
      action: 'update_existing',
    };
  }

  // Gestione precondizione fallita
  handleFailedPrecondition(error) {
    console.error('❌ Precondizione fallita:', error.message);

    return {
      type: 'precondition_failed',
      message: 'Operazione non valida in questo stato',
      action: 'refresh_data',
    };
  }

  // Gestione errore generico
  handleGenericError(error) {
    console.error('❌ Errore generico:', error.message);

    return {
      type: 'generic_error',
      message: 'Si è verificato un errore imprevisto',
      action: 'retry',
    };
  }

  // Log errore per debugging
  logError(errorInfo) {
    try {
      const errors = JSON.parse(
        localStorage.getItem('firebase_errors') || '[]'
      );
      errors.push(errorInfo);

      // Mantieni solo gli ultimi 50 errori
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }

      localStorage.setItem('firebase_errors', JSON.stringify(errors));
    } catch (error) {
      console.error('❌ Errore nel logging:', error);
    }
  }

  // Ottieni errori recenti
  getRecentErrors() {
    try {
      return JSON.parse(localStorage.getItem('firebase_errors') || '[]');
    } catch (error) {
      console.error('❌ Errore nel recupero errori:', error);
      return [];
    }
  }

  // Pulisci errori loggati
  clearErrorLogs() {
    localStorage.removeItem('firebase_errors');
    console.log('🧹 Log errori puliti');
  }
}

// Istanza singleton
export const errorRecoveryManager = new ErrorRecoveryManager();

// Utility function per wrapping operazioni Firebase
export const withErrorRecovery = (operation, context = {}) => {
  return async (...args) => {
    return await errorRecoveryManager.executeWithRetry(
      () => operation(...args),
      context
    );
  };
};

// Hook per gestione errori
export const useErrorRecovery = () => {
  const [recentErrors, setRecentErrors] = React.useState([]);

  React.useEffect(() => {
    setRecentErrors(errorRecoveryManager.getRecentErrors());
  }, []);

  const clearErrors = () => {
    errorRecoveryManager.clearErrorLogs();
    setRecentErrors([]);
  };

  return {
    recentErrors,
    clearErrors,
    handleError:
      errorRecoveryManager.handleFirebaseError.bind(errorRecoveryManager),
  };
};
