import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-playfair text-gold mb-4">Something went wrong.</h1>
            <p className="text-smoke mb-8">We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-light transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
