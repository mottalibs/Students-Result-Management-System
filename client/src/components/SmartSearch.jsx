import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight, Users, BookOpen, Filter, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT = 5;

const SmartSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [recentSearches, setRecentSearches] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const filters = [
        { id: 'all', label: 'All', icon: Search },
        { id: 'student', label: 'Students', icon: Users },
        { id: 'result', label: 'Results', icon: BookOpen },
        { id: 'roll', label: 'Roll #', icon: Hash }
    ];

    // Load recent searches
    useEffect(() => {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch {}
        }
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Save recent search
    const saveRecentSearch = useCallback((searchQuery, searchFilter) => {
        const newSearch = { query: searchQuery, filter: searchFilter, time: Date.now() };
        const updated = [newSearch, ...recentSearches.filter(s => s.query !== searchQuery)].slice(0, MAX_RECENT);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    }, [recentSearches]);

    // Handle search
    const handleSearch = (searchQuery = query, searchFilter = filter) => {
        if (!searchQuery.trim()) return;
        
        saveRecentSearch(searchQuery, searchFilter);
        
        // Navigate based on filter
        const params = new URLSearchParams();
        params.set('q', searchQuery);
        if (searchFilter !== 'all') params.set('type', searchFilter);
        
        if (searchFilter === 'student' || searchFilter === 'roll') {
            navigate(`/admin/students?${params.toString()}`);
        } else if (searchFilter === 'result') {
            navigate(`/admin/results?${params.toString()}`);
        } else {
            navigate(`/admin/students?${params.toString()}`);
        }
        
        onClose();
    };

    // Handle keyboard
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter') {
            handleSearch();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, recentSearches.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        }
    };

    // Clear recent
    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem(RECENT_SEARCHES_KEY);
    };

    // Format time ago
    const timeAgo = (timestamp) => {
        const mins = Math.floor((Date.now() - timestamp) / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Search Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
            >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 dark:border-slate-700">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search students, results, or roll numbers..."
                            className="flex-1 bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-400 font-medium"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                        <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xs text-slate-400">
                            ESC
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 p-3 border-b border-slate-100 dark:border-slate-700">
                        {filters.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    filter === f.id
                                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                            >
                                <f.icon className="w-3.5 h-3.5" />
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Recent Searches */}
                    <div className="max-h-64 overflow-y-auto">
                        {recentSearches.length > 0 ? (
                            <div className="p-2">
                                <div className="flex items-center justify-between px-3 py-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase">Recent</span>
                                    <button onClick={clearRecent} className="text-xs text-slate-400 hover:text-red-500">
                                        Clear
                                    </button>
                                </div>
                                {recentSearches.map((search, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSearch(search.query, search.filter)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                            selectedIndex === i
                                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="flex-1 text-left text-sm text-slate-700 dark:text-slate-200">{search.query}</span>
                                        <span className="text-xs text-slate-400">{timeAgo(search.time)}</span>
                                        <ArrowRight className={`w-4 h-4 text-slate-400 ${selectedIndex === i ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Type to search...</p>
                                <p className="text-xs mt-1">Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">Enter</kbd> to search</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">↑↓</kbd> Navigate</span>
                            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">↵</kbd> Search</span>
                        </div>
                        <span className="flex items-center gap-1">
                            <Filter className="w-3 h-3" />
                            {filters.find(f => f.id === filter)?.label}
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SmartSearch;
