import React, { useMemo, useEffect, useState } from 'react';
import { Users, BookOpen, TrendingUp, Award, GraduationCap, CheckCircle, XCircle, BarChart3, Target, ArrowRight, Activity } from 'lucide-react';
import { CardSkeleton } from './Skeleton';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animated Counter
const useCounter = (end, duration = 1000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (end === 0) { setCount(0); return; }
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else { setCount(Math.floor(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration]);
    return count;
};

const StatCard = ({ title, value, subtitle, icon: Icon, link, color = "blue", delay = 0 }) => {
    const animatedValue = useCounter(typeof value === 'number' ? value : 0, 800);
    const displayValue = typeof value === 'number' ? animatedValue : value;
    
    const colorClasses = {
        blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };

    const Content = () => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <Icon className="w-24 h-24" />
            </div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide uppercase">{title}</p>
                    <h3 className="text-4xl font-bold text-slate-800 dark:text-white mt-2">{displayValue}</h3>
                    {subtitle && <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1"><Activity className="w-3 h-3" /> {subtitle}</p>}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]} transition-colors`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {link && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 relative z-10">
                    <span className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform cursor-pointer">
                        View Details <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            )}
        </motion.div>
    );
    
    return link ? <Link to={link} className="block"><Content /></Link> : <Content />;
};

const ProgressBar = ({ label, value, max, color }) => {
    const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
    
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600 dark:text-slate-300">{label}</span>
                <span className="text-slate-800 dark:text-white">{value} <span className="text-slate-400 text-xs">({percentage}%)</span></span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${color}`} 
                />
            </div>
        </div>
    );
};

const DashboardStats = ({ students, results, loading }) => {
    if (loading) return <CardSkeleton />;

    const stats = useMemo(() => {
        const totalStudents = students?.length || 0;
        const totalResults = results?.length || 0;
        const avgCGPA = results?.length > 0
            ? (results.reduce((acc, curr) => acc + (curr.cgpa || 0), 0) / results.length).toFixed(2)
            : '0.00';

        const departments = students?.reduce((acc, s) => {
            acc[s.department] = (acc[s.department] || 0) + 1;
            return acc;
        }, {}) || {};
        
        const topDepartment = Object.keys(departments).sort((a, b) => departments[b] - departments[a])[0] || 'N/A';
        const passedCount = results?.filter(r => r.status === 'Passed').length || 0;
        const failedCount = results?.filter(r => r.status === 'Failed').length || 0;
        const passRate = totalResults > 0 ? Math.round((passedCount / totalResults) * 100) : 0;

        const cgpaDistribution = {
            excellent: results?.filter(r => r.cgpa >= 3.75).length || 0,
            good: results?.filter(r => r.cgpa >= 3.0 && r.cgpa < 3.75).length || 0,
            average: results?.filter(r => r.cgpa >= 2.0 && r.cgpa < 3.0).length || 0,
            below: results?.filter(r => r.cgpa < 2.0).length || 0,
        };

        return { totalStudents, totalResults, avgCGPA, departments, topDepartment, passedCount, failedCount, passRate, cgpaDistribution };
    }, [students, results]);

    return (
        <div className="space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={stats.totalStudents} subtitle="Registered Active" icon={Users} link="/admin/students" color="blue" delay={0} />
                <StatCard title="Results Published" value={stats.totalResults} subtitle="Academic Records" icon={BookOpen} link="/admin/results" color="emerald" delay={0.1} />
                <StatCard title="Average CGPA" value={stats.avgCGPA} subtitle="Overall Performance" icon={Award} color="purple" delay={0.2} />
                <StatCard title="Pass Rate" value={`${stats.passRate}%`} subtitle={`${stats.passedCount} Passed / ${stats.failedCount} Failed`} icon={Target} color="amber" delay={0.3} />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20"
                >
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link to="/admin/add-result" className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group">
                            <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <span className="font-semibold">Add New Result</span>
                            <ArrowRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link to="/admin/students" className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group">
                            <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                                <Users className="w-4 h-4" />
                            </div>
                            <span className="font-semibold">View Students</span>
                            <ArrowRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </motion.div>

                {/* Pass/Fail */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </div>
                        <span className="font-bold text-lg text-slate-800 dark:text-white">Result Breakdown</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <span className="font-medium text-slate-700 dark:text-slate-200">Passed</span>
                            </div>
                            <span className="font-bold text-green-600 dark:text-green-400 text-lg">{stats.passedCount}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                            <div className="flex items-center gap-3">
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span className="font-medium text-slate-700 dark:text-slate-200">Failed</span>
                            </div>
                            <span className="font-bold text-red-600 dark:text-red-400 text-lg">{stats.failedCount}</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex mt-2">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.passRate}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-green-500 h-full" 
                            />
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${100 - stats.passRate}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-red-500 h-full" 
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Top Department */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </div>
                        <span className="font-bold text-lg text-slate-800 dark:text-white">Top Department</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="font-bold text-2xl text-slate-800 dark:text-white mb-2">{stats.topDepartment}</p>
                        <div className="inline-flex items-center justify-center px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold mb-4">
                            Top Performer
                        </div>
                        <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{stats.departments[stats.topDepartment] || 0}</p>
                        <p className="text-sm text-slate-500 font-medium mt-1">Total Students</p>
                    </div>
                    <p className="text-sm text-slate-400 text-center mt-4 font-medium">{Object.keys(stats.departments).length} Departments Active</p>
                </motion.div>
            </div>

            {/* CGPA Distribution */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
            >
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="font-bold text-lg text-slate-800 dark:text-white">CGPA Distribution</span>
                    <span className="text-xs font-bold text-slate-500 ml-auto bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{stats.totalResults} Total Results</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ProgressBar label="Excellent (≥3.75)" value={stats.cgpaDistribution.excellent} max={stats.totalResults} color="bg-green-500" />
                    <ProgressBar label="Good (3.0-3.74)" value={stats.cgpaDistribution.good} max={stats.totalResults} color="bg-blue-500" />
                    <ProgressBar label="Average (2.0-2.99)" value={stats.cgpaDistribution.average} max={stats.totalResults} color="bg-yellow-500" />
                    <ProgressBar label="Below (<2.0)" value={stats.cgpaDistribution.below} max={stats.totalResults} color="bg-red-500" />
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardStats;
