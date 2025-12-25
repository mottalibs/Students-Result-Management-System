import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Users, FileText, LogOut, GraduationCap, 
    BarChart3, BookOpen, Menu, X, Plus
} from 'lucide-react';
import axios from '../utils/axiosInstance';
import LogoutConfirmModal from './LogoutConfirmModal';

const Sidebar = ({ role = 'admin' }) => {
    const location = useLocation();
    const [stats, setStats] = useState({ students: 0, results: 0 });
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    const fetchStats = useCallback(async () => {
        try {
            const [studentsRes, resultsRes] = await Promise.all([
                axios.get('/students'),
                axios.get('/results')
            ]);
            setStats({
                students: studentsRes.data?.length || 0,
                results: resultsRes.data?.length || 0
            });
        } catch (err) {
            // Silent fail
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats, location.pathname]);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    const isActive = (path) => {
        if (path === `/${role}`) {
            return location.pathname === `/${role}`;
        }
        return location.pathname.startsWith(path);
    };

    // Correct route paths matching AnimatedRoutes.jsx
    const navItems = [
        { 
            path: `/${role}`, 
            label: 'Dashboard', 
            icon: LayoutDashboard,
            color: 'blue'
        },
        { 
            path: `/${role}/students`, 
            label: 'Students', 
            icon: Users, 
            count: stats.students,
            color: 'emerald'
        },
        { 
            path: `/${role}/results`, 
            label: 'Results', 
            icon: BookOpen, 
            count: stats.results,
            color: 'purple'
        },
        { 
            path: `/${role}/entry`, // Fixed: matches route in AnimatedRoutes.jsx
            label: 'Entry', 
            icon: Plus,
            color: 'amber'
        },
        { 
            path: `/${role}/reports`, 
            label: 'Reports', 
            icon: BarChart3,
            color: 'indigo'
        },
    ];

    const getActiveColor = (color) => {
        const colors = {
            blue: 'bg-blue-600 shadow-blue-500/30',
            emerald: 'bg-emerald-600 shadow-emerald-500/30',
            purple: 'bg-purple-600 shadow-purple-500/30',
            amber: 'bg-amber-600 shadow-amber-500/30',
            indigo: 'bg-indigo-600 shadow-indigo-500/30',
        };
        return colors[color] || colors.blue;
    };

    const NavContent = () => (
        <aside className="w-[72px] h-screen bg-slate-900 flex flex-col py-3 border-r border-slate-800">
            {/* Logo */}
            <Link to="/" className="flex justify-center mb-4 group" title="Home">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5 text-white" />
                </div>
            </Link>

            {/* Divider */}
            <div className="mx-4 h-px bg-slate-800 mb-3" />

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                relative flex flex-col items-center justify-center p-2.5 rounded-xl
                                transition-all duration-200 group
                                ${active 
                                    ? `${getActiveColor(item.color)} text-white shadow-lg` 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }
                            `}
                            title={item.label}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-[9px] mt-1 font-medium">{item.label}</span>
                            
                            {/* Count Badge */}
                            {item.count != null && item.count > 0 && (
                                <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] ${active ? 'bg-white text-slate-900' : 'bg-blue-500 text-white'} rounded-full text-[9px] font-bold flex items-center justify-center px-1`}>
                                    {item.count > 99 ? '99+' : item.count}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Divider */}
            <div className="mx-4 h-px bg-slate-800 my-2" />

            {/* Logout */}
            <div className="px-2">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex flex-col items-center justify-center p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-[9px] mt-1 font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700"
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop */}
            <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
                <NavContent />
            </div>

            {/* Mobile */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
                    <div className="absolute left-0 top-0 h-full">
                        <NavContent />
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal 
                isOpen={showLogoutModal} 
                onClose={() => setShowLogoutModal(false)} 
            />
        </>
    );
};

export default Sidebar;
