import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 40, background: '#1a1a1a', color: '#ff5555', height: '100vh', fontFamily: 'monospace' }}>
                    <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>⚠️ SYSTEM CRITICAL FAILURE</h1>
                    <p style={{ color: '#fff', marginBottom: '10px' }}>An unhandled exception occurred in the React tree.</p>
                    <pre style={{ background: '#000', padding: '20px', borderRadius: '8px', overflow: 'auto', border: '1px solid #333' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '20px', padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        REBOOT SYSTEM
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
