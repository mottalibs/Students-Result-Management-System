import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
            <div className="text-center max-w-lg w-full">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-64 h-64 mx-auto mb-8"
                >
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full bg-white dark:bg-slate-900 rounded-full shadow-2xl border border-slate-100 dark:border-slate-800">
                        <span className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            404
                        </span>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-lg rotate-12">
                        <AlertTriangle className="w-10 h-10 text-amber-500" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
                        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/" 
                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Link>
                        <button 
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
