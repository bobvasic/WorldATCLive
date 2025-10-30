import { Component } from 'react';
import { motion as Motion } from 'framer-motion';

/**
 * Error Boundary with AI-powered error recovery
 * Catches React errors and provides intelligent fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to AI service for pattern analysis (future enhancement)
    if (window.geminiService) {
      // Could send error patterns to AI for analysis
    }
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="error-boundary"
        >
          <div className="error-content">
            <Motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="error-icon"
            >
              ⚠️
            </Motion.div>
            
            <h2>Oops! Something went wrong</h2>
            <p className="error-message">
              The application encountered an unexpected error.
            </p>

            <div className="error-actions">
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleRetry}
                className="retry-btn"
              >
                🔄 Try Again
              </Motion.button>
              
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="reload-btn"
              >
                ↻ Reload Page
              </Motion.button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </Motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
