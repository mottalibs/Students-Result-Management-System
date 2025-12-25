import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import ResultPDF from '../components/ResultPDF';
import { Link } from 'react-router-dom';
import { 
    Search, Award, GraduationCap, Users, BookOpen, AlertCircle, ArrowRight, 
    CheckCircle2, X, Shield, Clock, Share2, User, Moon, Sun, 
    BarChart3, Zap, Lock, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ students: 0, results: 0 });
    const [showResultModal, setShowResultModal] = useState(false);
    const { darkMode, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        const fetchStats = async () => {
            try {
                const res = await axios.get('/students');
                setStats({ students: res.data.length, results: res.data.length });
            } catch (err) { /* ignore */ }
        };
        fetchStats();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = async (e, rollOverride) => {
        e?.preventDefault();
        const query = rollOverride || searchQuery.trim();
        if (!query) return setError('Please enter a Roll Number');

        if (rollOverride) setSearchQuery(rollOverride);
        setError('');
        setResults([]);
        setLoading(true);

        try {
            const res = await axios.get(`/results/search/${query}`);
            setResults(res.data);
            setShowResultModal(true);
        } catch (err) {
            setError('No results found. Please check your Roll Number.');
            setShowResultModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3' : 'bg-transparent py-5'
            }`}>
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className={`font-bold text-xl ${scrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                            ResultPortal
                        </span>
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-xl transition-colors ${
                                scrolled ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-white/10 hover:bg-white/20 text-slate-600 dark:text-slate-300 backdrop-blur-sm'
                            }`}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        
                        <Link 
                            to="/login" 
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-slate-900/20"
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Admin Login</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent -z-10" />
                <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute top-40 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 mb-8 shadow-sm backdrop-blur-sm"
                    >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Result Portal 2.0
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight"
                    >
                        Academic Excellence <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            Simplified.
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Access your academic records instantly with our secure, real-time result management system.
                    </motion.p>

                    {/* Search Box */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-xl mx-auto relative z-20"
                    >
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl p-2 shadow-xl border border-slate-100 dark:border-slate-800">
                                <div className="pl-4 text-slate-400">
                                    <Search className="w-6 h-6" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Roll Number (e.g. 1001)"
                                    className="flex-1 px-4 py-4 bg-transparent text-lg text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !searchQuery.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Check <ArrowRight className="w-5 h-5" /></>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Quick Links */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>Try demo rolls:</span>
                            {['1001', '1002', '1003'].map(roll => (
                                <button
                                    key={roll}
                                    onClick={() => handleSearch(null, roll)}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md font-mono transition-colors"
                                >
                                    {roll}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                desc: "Instant result processing and retrieval with our optimized database engine.",
                                color: "blue"
                            },
                            {
                                icon: Shield,
                                title: "Secure & Private",
                                desc: "Bank-grade encryption ensures your academic data remains confidential and safe.",
                                color: "emerald"
                            },
                            {
                                icon: BarChart3,
                                title: "Smart Analytics",
                                desc: "Visual insights into your performance with detailed charts and progress tracking.",
                                color: "purple"
                            }
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900/20 flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-t border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Students", value: stats.students + "+", icon: Users },
                            { label: "Results Published", value: stats.results + "+", icon: BookOpen },
                            { label: "Uptime", value: "99.9%", icon: Clock },
                            { label: "Departments", value: "8+", icon: Award },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
                <p>© 2024 ResultPortal. All rights reserved.</p>
            </footer>

            {/* Result Modal */}
            <AnimatePresence>
                {showResultModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowResultModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center z-10">
                                <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-blue-500" /> Result Details
                                </h2>
                                <button onClick={() => setShowResultModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                {error ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="w-8 h-8 text-red-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Result Not Found</h3>
                                        <p className="text-slate-500 mb-6 max-w-xs mx-auto">{error}</p>
                                        <button onClick={() => setShowResultModal(false)} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                            Try Another Roll No.
                                        </button>
                                    </div>
                                ) : (
                                    results.map((result) => (
                                        <div key={result._id} className="space-y-6">
                                            {/* Student Card */}
                                            <div className="flex flex-col sm:flex-row gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20">
                                                        {result.studentId?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{result.studentId?.name}</h3>
                                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                            <span className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">
                                                                {result.studentId?.roll}
                                                            </span>
                                                            <span>{result.semester}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex-1 flex gap-3 sm:justify-end">
                                                    <div className="flex-1 sm:flex-none text-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 min-w-[100px]">
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">CGPA</p>
                                                        <p className={`text-2xl font-bold ${result.cgpa >= 3.5 ? 'text-emerald-500' : result.cgpa >= 3.0 ? 'text-blue-500' : 'text-amber-500'}`}>
                                                            {result.cgpa?.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="flex-1 sm:flex-none text-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 min-w-[100px]">
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status</p>
                                                        <div className={`flex items-center justify-center gap-1 mt-1 font-bold ${result.status === 'Passed' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {result.status === 'Passed' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                                            {result.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Subjects Table */}
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-blue-500" /> Subject Breakdown
                                                </h4>
                                                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-xs font-semibold">
                                                            <tr>
                                                                <th className="px-5 py-4 text-left">Subject</th>
                                                                <th className="px-5 py-4 text-center">Marks</th>
                                                                <th className="px-5 py-4 text-center">Grade</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                            {result.subjects?.map((sub, i) => (
                                                                <tr key={i} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                                    <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">{sub.subjectName}</td>
                                                                    <td className="px-5 py-4 text-center text-slate-600 dark:text-slate-400">{sub.marks}</td>
                                                                    <td className="px-5 py-4 text-center">
                                                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${
                                                                            sub.grade === 'F' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                                            sub.grade?.startsWith('A') ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                                        }`}>
                                                                            {sub.grade}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <ResultPDF result={result} student={result.studentId} />
                                                <button
                                                    onClick={() => {
                                                        const text = `My CGPA: ${result.cgpa?.toFixed(2)} in ${result.semester}!`;
                                                        if (navigator.share) {
                                                            navigator.share({ title: 'My Result', text });
                                                        } else {
                                                            navigator.clipboard.writeText(text);
                                                        }
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                                >
                                                    <Share2 className="w-4 h-4" /> Share Result
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
