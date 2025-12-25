import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import SmartSearch from './SmartSearch';
import { useTheme } from '../context/ThemeContext';
import { 
    Moon, Sun, Bell, Search, ChevronRight, Home, 
    Plus, UserPlus, FileText, Upload
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const { darkMode, toggleTheme } = useTheme();
    const admin = JSON.parse(localStorage.getItem('admin'));
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [showSmartSearch, setShowSmartSearch] = useState(false);

    useEffect(() => {
        const handleScroll = (e) => {
            setIsScrolled((e.target.scrollTop || 0) > 10);
        };
        const main = document.getElementById('admin-main');
        main?.addEventListener('scroll', handleScroll);
        return () => main?.removeEventListener('scroll', handleScroll);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSmartSearch(true);
            }
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
                e.preventDefault();
                setShowSmartSearch(true);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = () => {
            setShowNotifications(false);
            setShowQuickActions(false);
        };
        if (showNotifications || showQuickActions) {
            setTimeout(() => document.addEventListener('click', handleClick), 0);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [showNotifications, showQuickActions]);

    const getBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(Boolean);
        const labels = {
            'admin': 'Dashboard', 'teacher': 'Dashboard',
            'students': 'Students', 'results': 'Results',
            'add-result': 'Add Result', 'entry': 'Entry',
            'reports': 'Reports', 'bulk-upload': 'Bulk Upload'
        };
        
        return paths.map((p, i) => ({
            label: labels[p] || p,
            path: '/' + paths.slice(0, i + 1).join('/'),
            isLast: i === paths.length - 1
        }));
    };

    const breadcrumbs = getBreadcrumbs();

    const quickActions = [
        { label: 'Add Student', icon: UserPlus, path: '/admin/students', color: 'text-blue-500' },
        { label: 'Add Result', icon: FileText, path: '/admin/entry', color: 'text-emerald-500' },
        { label: 'Bulk Upload', icon: Upload, path: '/admin/bulk-upload', color: 'text-purple-500' },
    ];

    const notifications = [
        { id: 1, text: 'New student enrolled', time: '5m ago', unread: true },
        { id: 2, text: 'Results published', time: '1h ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
            <Sidebar />
            
            <div id="admin-main" className="flex-1 lg:ml-[72px] overflow-y-auto">
                {/* Header */}
                <header className={`sticky top-0 z-30 transition-all ${
                    isScrolled 
                        ? 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm' 
                        : 'bg-white dark:bg-slate-800'
                } border-b border-slate-200 dark:border-slate-700`}>
                    <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
                        {/* Breadcrumbs */}
                        <nav className="hidden sm:flex items-center gap-1 text-sm">
                            <Link to="/admin" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500">
                                <Home className="w-4 h-4" />
                            </Link>
                            {breadcrumbs.slice(1).map((crumb, i) => (
                                <div key={crumb.path} className="flex items-center gap-1">
                                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                    <Link
                                        to={crumb.path}
                                        className={`px-2 py-1 rounded-md transition ${
                                            crumb.isLast 
                                                ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20' 
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                    >
                                        {crumb.label}
                                    </Link>
                                </div>
                            ))}
                        </nav>

                        {/* Search */}
                        <button
                            onClick={() => setShowSmartSearch(true)}
                            className="flex-1 max-w-md mx-4 flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm"
                        >
                            <Search className="w-4 h-4" />
                            <span className="flex-1 text-left">Search...</span>
                            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-white dark:bg-slate-600 text-[10px] rounded border border-slate-200 dark:border-slate-500">⌘K</kbd>
                        </button>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Quick Actions */}
                            <div className="relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowQuickActions(!showQuickActions); }}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
                                    title="Quick Actions"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                
                                {showQuickActions && (
                                    <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                                        {quickActions.map(action => (
                                            <Link
                                                key={action.label}
                                                to={action.path}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm"
                                            >
                                                <action.icon className={`w-4 h-4 ${action.color}`} />
                                                <span className="text-slate-700 dark:text-slate-200">{action.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition"
                                title={darkMode ? 'Light Mode' : 'Dark Mode'}
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                                    className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition"
                                    title="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between">
                                            <span className="font-semibold text-slate-800 dark:text-white">Notifications</span>
                                            <button className="text-xs text-blue-500 hover:underline">Mark read</button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} className={`px-4 py-3 border-l-2 ${n.unread ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent'} hover:bg-slate-50 dark:hover:bg-slate-700/50`}>
                                                    <p className="text-sm text-slate-700 dark:text-slate-200">{n.text}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile */}
                            <div className="flex items-center gap-2 pl-2 ml-2 border-l border-slate-200 dark:border-slate-700">
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow">
                                    {admin?.username?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-slate-800 dark:text-white">{admin?.username || 'Admin'}</p>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        Online
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-4 lg:p-6">{children}</main>
            </div>

            {/* Smart Search Modal */}
            <SmartSearch isOpen={showSmartSearch} onClose={() => setShowSmartSearch(false)} />
        </div>
    );
};

export default AdminLayout;
