import React, { useState, Suspense } from 'react';
import { FileText, Users, Zap, RefreshCw, Keyboard } from 'lucide-react';

// Lazy load the actual form components for better performance
const AddResultForm = React.lazy(() => import('./AddResultForm'));
const BulkResultEntry = React.lazy(() => import('./BulkResultEntry'));

const ResultEntry = ({ students }) => {
    const [activeTab, setActiveTab] = useState('single');

    const tabs = [
        { 
            id: 'single', 
            label: 'Single Entry', 
            icon: FileText, 
            description: 'Add result for one student',
            shortcut: '1'
        },
        { 
            id: 'bulk', 
            label: 'Bulk Entry', 
            icon: Users, 
            description: 'Spreadsheet-style for multiple students',
            shortcut: '2'
        }
    ];

    // Keyboard shortcut to switch tabs
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                setActiveTab('single');
            } else if (e.altKey && e.key === '2') {
                e.preventDefault();
                setActiveTab('bulk');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header with Tab Switcher */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                {/* Title Bar */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Result Entry</h2>
                            <p className="text-sm text-slate-500">
                                {activeTab === 'single' 
                                    ? 'Add result for individual student' 
                                    : 'Bulk entry for multiple students'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Keyboard hint */}
                    <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                        <Keyboard className="w-3.5 h-3.5" />
                        <span>Alt+1/2 to switch</span>
                    </div>
                </div>

                {/* Tab Buttons */}
                <div className="flex border-b border-slate-100 dark:border-slate-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-medium transition-all relative group ${
                                activeTab === tab.id
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                            }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-500' : ''}`} />
                            <div className="text-left">
                                <span className="block font-semibold">{tab.label}</span>
                                <span className="block text-xs text-slate-400 font-normal">{tab.description}</span>
                            </div>
                            
                            {/* Keyboard shortcut badge */}
                            <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono rounded transition-opacity ${
                                activeTab === tab.id 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 opacity-0 group-hover:opacity-100'
                            }`}>
                                Alt+{tab.shortcut}
                            </kbd>
                            
                            {/* Active indicator */}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <Suspense 
                fallback={
                    <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                        <span className="ml-3 text-slate-500">Loading...</span>
                    </div>
                }
            >
                {activeTab === 'single' ? (
                    <AddResultForm students={students} />
                ) : (
                    <BulkResultEntry />
                )}
            </Suspense>
        </div>
    );
};

export default ResultEntry;
