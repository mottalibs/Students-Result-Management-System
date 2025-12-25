import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, GraduationCap, Moon, Sun, Menu, X, ChevronRight, LayoutDashboard, User, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import LogoutConfirmModal from './LogoutConfirmModal';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const admin = JSON.parse(localStorage.getItem('admin'));
    const { darkMode, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        setMobileMenuOpen(false);
        setShowLogoutModal(true);
    };

    // Hide Navbar on specific pages that have their own navbars
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/teacher') || location.pathname === '/' || location.pathname === '/login') {
        return null;
    }

    return (
        <>
            <nav 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 py-3' 
                        : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-4 border-b border-slate-200/30 dark:border-slate-700/30'
                }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2.5 group"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            ResultPortal
                        </span>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {admin ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {admin.username}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Administrator
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-slate-900/20"
                            >
                                <User className="w-4 h-4" />
                                Admin Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 z-50 shadow-2xl md:hidden flex flex-col border-l border-slate-200 dark:border-slate-800"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">Menu</span>
                                <button 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                                <Link 
                                    to="/" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium transition-colors"
                                >
                                    <Home className="w-5 h-5 text-blue-500" />
                                    Home
                                </Link>
                                
                                <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium transition-colors">
                                    <span className="flex items-center gap-3">
                                        {darkMode ? <Moon className="w-5 h-5 text-purple-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                                        Dark Mode
                                    </span>
                                    <button 
                                        onClick={toggleTheme}
                                        className={`w-10 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                </div>

                                {admin ? (
                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3 mb-6 px-2">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                {admin.username.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{admin.username}</p>
                                                <p className="text-xs text-slate-500">Administrator</p>
                                            </div>
                                        </div>
                                        <Link 
                                            to="/admin"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold mb-3 shadow-lg shadow-slate-900/20"
                                        >
                                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <Link 
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors"
                                        >
                                            <User className="w-4 h-4" /> Admin Login
                                        </Link>
                                    </div>
                                )}
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

export default Navbar;

