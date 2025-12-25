import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { 
    GraduationCap, User, Lock, ArrowRight, Shield, AlertCircle, 
    Home, Eye, EyeOff, Moon, Sun, CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('admin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { darkMode, toggleTheme } = useTheme();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await axios.post('/auth/login', { username, password, role });
            
            if (role === 'admin') {
                localStorage.setItem('admin', JSON.stringify(res.data.user));
                localStorage.setItem('token', res.data.token);
                navigate('/admin');
            } else {
                localStorage.setItem('teacher', JSON.stringify(res.data.user));
                localStorage.setItem('token', res.data.token);
                navigate('/teacher');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (type) => {
        if (type === 'admin') {
            setRole('admin');
            setUsername('admin');
            setPassword('admin123');
        } else {
            setRole('teacher');
            setUsername('rahman@university.edu');
            setPassword('teacher123');
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors">
            {/* Left Side - Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
                
                {/* Animated Shapes */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">ResultPortal</span>
                        </div>
                        <h1 className="text-5xl font-bold leading-tight mb-6">
                            Manage Academic <br/>
                            <span className="text-blue-300">Excellence</span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-md">
                            A secure, efficient, and modern platform for managing student results and academic performance.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-300">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">Enterprise Security</h3>
                                <p className="text-sm text-blue-200">Bank-grade encryption for data protection</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-blue-200/60">
                            <p>© 2024 ResultPortal Inc.</p>
                            <div className="flex gap-4">
                                <span>Privacy Policy</span>
                                <span>Terms of Service</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col">
                {/* Navbar */}
                <nav className="h-20 flex items-center justify-between px-6 md:px-12">
                    <Link to="/" className="lg:hidden flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-4.5 h-4.5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">ResultPortal</span>
                    </Link>
                    
                    <div className="flex items-center gap-3 ml-auto">
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Home</span>
                        </Link>
                    </div>
                </nav>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-6 md:px-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md space-y-8"
                    >
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">
                                Please enter your details to sign in.
                            </p>
                        </div>

                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <button
                                onClick={() => setRole('admin')}
                                className={`py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                    role === 'admin' 
                                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <Shield className="w-4 h-4" /> Admin
                            </button>
                            <button
                                onClick={() => setRole('teacher')}
                                className={`py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                    role === 'teacher' 
                                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <User className="w-4 h-4" /> Teacher
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    {role === 'admin' ? 'Username' : 'Email Address'}
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type={role === 'admin' ? 'text' : 'email'}
                                        placeholder={role === 'admin' ? 'Enter username' : 'Enter email'}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                        {rememberMe && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                                </label>
                                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Sign In <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-medium text-slate-400 text-center mb-4 uppercase tracking-wider">Demo Credentials</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => fillDemo('admin')}
                                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                >
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        <Shield className="w-3.5 h-3.5 text-blue-500" /> Admin
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-100 dark:border-slate-800 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 transition-colors">
                                        admin / admin123
                                    </div>
                                </button>
                                <button
                                    onClick={() => fillDemo('teacher')}
                                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                >
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        <User className="w-3.5 h-3.5 text-emerald-500" /> Teacher
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-100 dark:border-slate-800 group-hover:border-emerald-200 dark:group-hover:border-emerald-900/50 transition-colors">
                                        teacher123
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
