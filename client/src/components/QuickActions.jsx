import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, Users, Download, Upload, Zap } from 'lucide-react';

const QuickActions = () => {
    const actions = [
        { 
            label: 'Add Result', 
            icon: FilePlus, 
            path: '/admin/add-result', 
            color: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30',
            description: 'Publish new result'
        },
        { 
            label: 'Add Student', 
            icon: Users, 
            path: '/admin/students', 
            color: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30',
            description: 'Register student'
        },
        { 
            label: 'Quick Entry', 
            icon: Zap, 
            path: '/admin/bulk-entry', 
            color: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30',
            description: 'Bulk results'
        },
        { 
            label: 'Upload Excel', 
            icon: Upload, 
            path: '/admin/bulk-upload', 
            color: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30',
            description: 'Import data'
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Quick Actions</h3>
                    <p className="text-xs text-slate-500">Jump to common tasks</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {actions.map(action => (
                    <Link
                        key={action.label}
                        to={action.path}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl text-white transition-all hover:scale-105 shadow-lg ${action.color}`}
                    >
                        <action.icon className="w-6 h-6" />
                        <span className="font-bold text-sm">{action.label}</span>
                        <span className="text-xs opacity-80">{action.description}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
