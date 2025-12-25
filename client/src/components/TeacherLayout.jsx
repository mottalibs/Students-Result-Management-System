import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import SmartSearch from './SmartSearch';
import { useTheme } from '../context/ThemeContext';
import { 
    Moon, Sun, Bell, Search, ChevronRight, Home, 
    Command
} from 'lucide-react';

const TeacherLayout = ({ children }) => {
    const { darkMode, toggleTheme } = useTheme();
    const teacher = JSON.parse(localStorage.getItem('teacher'));
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSmartSearch, setShowSmartSearch] = useState(false);

    useEffect(() => {
        const handleScroll = (e) => {
            setIsScrolled(e.target.scrollTop > 10);
        };
        const mainContent = document.getElementById('teacher-main-content');
        mainContent?.addEventListener('scroll', handleScroll);
        return () => mainContent?.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                setShowSmartSearch(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const getBreadcrumbs = () => {
        const pathnames = location.pathname.split('/').filter(x => x);
        const labelMap = {
            'teacher': 'Dashboard',
            'students': 'Students',
            'results': 'Results',
            'entry': 'Entry',
            'reports': 'Reports',
            'analytics': 'Analytics'
        };

        return (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link to="/teacher" className="hover:text-blue-600 transition-colors">
                    <Home className="w-4 h-4" />
                </Link>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    if (name === 'teacher' && index === 0) return null;
                    
                    return (
                        <React.Fragment key={name}>
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                            {isLast ? (
                                <span className="font-medium text-slate-800 dark:text-white">
                                    {labelMap[name] || name}
                                </span>
                            ) : (
                                <Link to={routeTo} className="hover:text-blue-600 transition-colors">
                                    {labelMap[name] || name}
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden font-sans">
            {/* Sidebar */}
            <Sidebar role="teacher" />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-[72px] flex flex-col min-w-0 relative">
                {/* Header */}
                <header 
                    className={`sticky top-0 z-30 px-6 py-3 flex items-center justify-between transition-all duration-300 ${
                        isScrolled 
                            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm' 
                            : 'bg-transparent'
                    }`}
                >
                    <div className="flex items-center gap-4 flex-1">
                        {getBreadcrumbs()}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search Trigger */}
                        <button 
                            onClick={() => setShowSmartSearch(true)}
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 hover:border-blue-400 transition-colors group"
                        >
                            <Search className="w-4 h-4 group-hover:text-blue-500" />
                            <span>Search...</span>
                            <kbd className="px-1.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] border border-slate-200 dark:border-slate-600">/</kbd>
                        </button>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                        </button>

                        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-600/20">
                                {teacher?.name?.charAt(0) || 'T'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-6 overflow-y-auto h-full scroll-smooth" id="teacher-main-content">
                    {children}
                </main>
            </div>

            {/* Smart Search Modal */}
            <SmartSearch isOpen={showSmartSearch} onClose={() => setShowSmartSearch(false)} />
        </div>
    );
};

export default TeacherLayout;
