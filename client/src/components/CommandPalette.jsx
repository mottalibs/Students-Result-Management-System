import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Command, LayoutDashboard, Users, BookOpen, FilePlus, 
    Upload, Home, LogOut, X, ArrowRight, Keyboard
} from 'lucide-react';
import { isAuthenticated } from '../utils/axiosInstance';
import LogoutConfirmModal from './LogoutConfirmModal';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    const isLoggedIn = isAuthenticated();
    const isAdminArea = location.pathname.startsWith('/admin');

    // Define commands
    const commands = [
        // Navigation
        { id: 'home', label: 'Go to Home', icon: Home, action: () => navigate('/'), category: 'Navigation', shortcut: 'Alt+H' },
        
        // Admin commands (only when logged in)
        ...(isLoggedIn ? [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, action: () => navigate('/admin'), category: 'Admin', shortcut: 'Alt+1' },
            { id: 'students', label: 'Manage Students', icon: Users, action: () => navigate('/admin/students'), category: 'Admin', shortcut: 'Alt+2' },
            { id: 'results', label: 'Manage Results', icon: BookOpen, action: () => navigate('/admin/results'), category: 'Admin', shortcut: 'Alt+3' },
            { id: 'entry', label: 'Result Entry', icon: FilePlus, action: () => navigate('/admin/entry'), category: 'Admin', shortcut: 'Alt+4' },
            { id: 'reports', label: 'Analytics & Reports', icon: Upload, action: () => navigate('/admin/reports'), category: 'Admin', shortcut: 'Alt+5' },
            { id: 'logout', label: 'Logout', icon: LogOut, action: () => setShowLogoutModal(true), category: 'Account' },
        ] : []),
    ];

    // Filter commands based on search
    const filteredCommands = commands.filter(cmd => 
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.category.toLowerCase().includes(search.toLowerCase())
    );

    // Group commands by category
    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {});

    // Handle keyboard shortcut (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setSearch('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Handle arrow keys and enter
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
            e.preventDefault();
            filteredCommands[selectedIndex].action();
            setIsOpen(false);
        }
    }, [filteredCommands, selectedIndex]);

    // Execute command
    const executeCommand = (cmd) => {
        cmd.action();
        setIsOpen(false);
    };

    // Only show in admin area or when logged in
    if (!isAdminArea && !isLoggedIn) return null;

    return (
        <>
            {/* Trigger Button - Shows in admin area */}
            {isAdminArea && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:scale-105 transition-transform font-medium text-sm"
                >
                    <Command className="w-4 h-4" />
                    <span className="hidden sm:inline">Quick Actions</span>
                    <kbd className="hidden sm:inline px-1.5 py-0.5 bg-slate-700 dark:bg-slate-200 text-slate-300 dark:text-slate-600 text-xs rounded">⌘K</kbd>
                </button>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Command Palette */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
                        >
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                {/* Search Input */}
                                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 dark:border-slate-700">
                                    <Search className="w-5 h-5 text-slate-400" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Type a command or search..."
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-400 font-medium"
                                    />
                                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                        <X className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>

                                {/* Commands List */}
                                <div className="max-h-80 overflow-y-auto p-2">
                                    {Object.entries(groupedCommands).map(([category, cmds]) => (
                                        <div key={category} className="mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">{category}</p>
                                            {cmds.map((cmd, idx) => {
                                                const globalIdx = filteredCommands.indexOf(cmd);
                                                const isSelected = globalIdx === selectedIndex;
                                                const Icon = cmd.icon;
                                                
                                                return (
                                                    <button
                                                        key={cmd.id}
                                                        onClick={() => executeCommand(cmd)}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                                                            isSelected 
                                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                        <span className="flex-1 text-left font-medium">{cmd.label}</span>
                                                        {cmd.shortcut && (
                                                            <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded font-mono">
                                                                {cmd.shortcut}
                                                            </kbd>
                                                        )}
                                                        <ArrowRight className={`w-4 h-4 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}

                                    {filteredCommands.length === 0 && (
                                        <div className="text-center py-8 text-slate-400">
                                            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>No commands found</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">↑↓</kbd> Navigate</span>
                                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">↵</kbd> Select</span>
                                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">Esc</kbd> Close</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Keyboard className="w-3 h-3" />
                                        <span>Keyboard Friendly</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal 
                isOpen={showLogoutModal} 
                onClose={() => setShowLogoutModal(false)} 
            />
        </>
    );
};

export default CommandPalette;
