import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child component tree and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console (in production, send to error tracking service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
        
        // Optional: Send to error tracking service like Sentry
        // if (window.Sentry) {
        //     window.Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        {/* Error Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-8 text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    Something went wrong!
                                </h1>
                                <p className="text-red-100 text-sm">
                                    An unexpected error occurred
                                </p>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Error details (development only) */}
                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                        <p className="text-sm font-mono text-red-700 dark:text-red-400 break-all">
                                            {this.state.error.toString()}
                                        </p>
                                    </div>
                                )}
                                
                                <p className="text-slate-600 dark:text-slate-300 text-center">
                                    Sorry, we encountered a problem. Please try again.
                                </p>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        onClick={this.handleReset}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
                                        aria-label="Try Again"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Try Again
                                    </button>
                                    
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all duration-200"
                                        aria-label="Go Home"
                                    >
                                        <Home className="w-4 h-4" />
                                        Go Home
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Help text */}
                        <p className="text-center text-slate-400 text-sm mt-4">
                            If the problem persists, please contact support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
