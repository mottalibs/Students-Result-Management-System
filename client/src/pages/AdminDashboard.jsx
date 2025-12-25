import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from '../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Users, BookOpen, Award, Target, TrendingUp, TrendingDown,
    AlertTriangle, RefreshCw, FileText, 
    ChevronRight, BarChart3, Calendar, GraduationCap,
    Plus, UserPlus, ArrowRight, Clock, CheckCircle, XCircle,
    Eye, Download, Layers, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

// Stat Card with subtle color accent
const StatCard = ({ label, value, change, icon: Icon, link, accent = 'blue' }) => {
    const accents = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
        green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
    };
    
    return (
        <div className={`p-5 rounded-xl border-2 ${accents[accent]} transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between mb-3">
                <Icon className="w-6 h-6" />
                {change !== undefined && (
                    <span className={`text-xs font-bold flex items-center gap-1 px-2 py-0.5 rounded-full ${
                        change >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40' : 'bg-red-100 text-red-700 dark:bg-red-900/40'
                    }`}>
                        {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
                {link && (
                    <Link to={link} className="text-xs font-semibold flex items-center gap-1 hover:underline">
                        View <ChevronRight className="w-3 h-3" />
                    </Link>
                )}
            </div>
        </div>
    );
};

// Action Card
const ActionCard = ({ icon: Icon, title, desc, to }) => (
    <Link to={to} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group">
        <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
                <p className="font-semibold text-slate-800 dark:text-white">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    </Link>
);

// Progress Ring
const ProgressRing = ({ value, size = 100 }) => {
    const radius = (size - 10) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    const color = value >= 70 ? 'text-emerald-500' : value >= 50 ? 'text-amber-500' : 'text-red-500';
    
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size/2} cy={size/2} r={radius} fill="none" strokeWidth="8"
                    className="text-slate-200 dark:text-slate-700" stroke="currentColor" />
                <circle cx={size/2} cy={size/2} r={radius} fill="none" strokeWidth="8"
                    className={color} stroke="currentColor" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800 dark:text-white">{value}%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Pass Rate</span>
            </div>
        </div>
    );
};

// Bar Chart
const BarChart = ({ data }) => {
    if (!data.length) return null;
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="flex items-end gap-2 h-28">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden" style={{ height: 100 }}>
                        <div 
                            className={`w-full transition-all duration-500 ${
                                d.value >= 70 ? 'bg-emerald-500' : d.value >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ height: `${(d.value / 100) * 100}%`, marginTop: 'auto' }}
                        />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{d.value}%</span>
                        <p className="text-[10px] text-slate-400">{d.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const AdminDashboard = ({ viewMode = 'dashboard' }) => {
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const StudentList = useMemo(() => React.lazy(() => import('../components/StudentList')), []);
    const ResultEntry = useMemo(() => React.lazy(() => import('../components/ResultEntry')), []);
    const ResultList = useMemo(() => React.lazy(() => import('../components/ResultList')), []);
    const BulkUpload = useMemo(() => React.lazy(() => import('../components/BulkUpload')), []);
    const Reports = useMemo(() => React.lazy(() => import('../components/Reports')), []);

    const fetchData = useCallback(async (force = false) => {
        if (!force) {
            const cached = localStorage.getItem('dashboard_cache');
            if (cached) {
                const { students, results, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < 300000) {
                    setStudents(students); setResults(results); setLoading(false);
                    refreshBg(); return;
                }
            }
        }
        setLoading(true);
        try { await refreshBg(); } catch { toast.error('Failed to load'); } finally { setLoading(false); }
    }, []);

    const refreshBg = async () => {
        const [s, r] = await Promise.all([axios.get('/students'), axios.get('/results')]);
        // Handle both paginated and legacy array responses
        const studentsData = Array.isArray(s.data) ? s.data : (s.data.students || []);
        const resultsData = Array.isArray(r.data) ? r.data : (r.data.results || []);
        setStudents(studentsData); setResults(resultsData);
        localStorage.setItem('dashboard_cache', JSON.stringify({ students: studentsData, results: resultsData, timestamp: Date.now() }));
    };

    useEffect(() => { fetchData(); }, [fetchData]);

    const stats = useMemo(() => {
        const totalStudents = students.length;
        const totalResults = results.length;
        const avgCGPA = totalResults > 0 ? (results.reduce((a, r) => a + (r.cgpa || 0), 0) / totalResults).toFixed(2) : '0.00';
        const passed = results.filter(r => r.status === 'Passed').length;
        const failed = totalResults - passed;
        const passRate = totalResults > 0 ? Math.round((passed / totalResults) * 100) : 0;

        const excellent = results.filter(r => r.cgpa >= 3.75).length;
        const good = results.filter(r => r.cgpa >= 3.0 && r.cgpa < 3.75).length;
        const average = results.filter(r => r.cgpa >= 2.0 && r.cgpa < 3.0).length;
        const below = results.filter(r => r.cgpa < 2.0).length;

        const depts = students.reduce((a, s) => { a[s.department || 'Other'] = (a[s.department] || 0) + 1; return a; }, {});
        const topDepts = Object.entries(depts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        const sems = results.reduce((a, r) => {
            const s = r.semester?.match(/\d+/)?.[0] || '?';
            if (!a[s]) a[s] = { p: 0, t: 0 };
            a[s].t++; if (r.status === 'Passed') a[s].p++;
            return a;
        }, {});
        const semRates = Object.entries(sems).sort((a, b) => a[0] - b[0]).slice(0, 8)
            .map(([l, d]) => ({ label: l, value: Math.round((d.p / d.t) * 100) }));

        const recent = results.slice(0, 5).map(r => ({
            name: r.studentId?.name || 'Student', roll: r.studentId?.roll,
            sem: r.semester, cgpa: r.cgpa, status: r.status
        }));

        const atRisk = results.filter(r => r.status === 'Failed').slice(0, 3).map(r => ({
            name: r.studentId?.name, roll: r.studentId?.roll,
            fails: r.subjects?.filter(s => s.grade === 'F').length || 0
        }));

        return { totalStudents, totalResults, avgCGPA, passRate, passed, failed, excellent, good, average, below, topDepts, semRates, recent, atRisk };
    }, [students, results]);

    const Loader = <div className="p-12 text-center"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>;
    if (viewMode === 'students') return <React.Suspense fallback={Loader}><StudentList students={students} refreshData={() => fetchData(true)} loading={loading} /></React.Suspense>;
    if (viewMode === 'entry') return <React.Suspense fallback={Loader}><ResultEntry students={students} /></React.Suspense>;
    if (viewMode === 'results') return <React.Suspense fallback={Loader}><ResultList results={results} refreshData={() => fetchData(true)} loading={loading} /></React.Suspense>;
    if (viewMode === 'bulkUpload') return <React.Suspense fallback={Loader}><BulkUpload /></React.Suspense>;
    if (viewMode === 'reports') return <React.Suspense fallback={Loader}><Reports /></React.Suspense>;

    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                        <Clock className="w-4 h-4" />
                        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {greeting}, <span className="text-blue-600 dark:text-blue-400">{admin.username || 'Admin'}</span>!
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's your dashboard overview</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link to="/admin/students" className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition shadow-sm">
                        <UserPlus className="w-4 h-4" /> Add Student
                    </Link>
                    <Link to="/admin/add-result" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                        <Plus className="w-4 h-4" /> Add Result
                    </Link>
                    <button onClick={() => fetchData(true)} className="p-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition shadow-sm" title="Refresh">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Students" value={stats.totalStudents} icon={Users} link="/admin/students" accent="blue" />
                <StatCard label="Total Results" value={stats.totalResults} icon={BookOpen} link="/admin/results" accent="green" />
                <StatCard label="Average CGPA" value={stats.avgCGPA} icon={Award} accent="purple" />
                <StatCard label="Pass Rate" value={`${stats.passRate}%`} icon={Target} accent="amber" change={stats.passRate >= 70 ? 5 : -3} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <ActionCard icon={Eye} title="View Results" desc="Browse all student results" to="/admin/results" />
                <ActionCard icon={Layers} title="Bulk Upload" desc="Import from Excel/CSV" to="/admin/bulk-upload" />
                <ActionCard icon={Download} title="Reports" desc="Generate PDF reports" to="/admin/reports" />
                <ActionCard icon={FileText} title="Add Result" desc="Enter single result" to="/admin/add-result" />
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pass/Fail Ring */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" /> Result Summary
                    </h3>
                    <div className="flex items-center justify-around">
                        <ProgressRing value={stats.passRate} />
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-slate-800 dark:text-white">{stats.passed}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Passed</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-slate-800 dark:text-white">{stats.failed}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Failed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Semester Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-500" /> Semester Performance
                    </h3>
                    {stats.semRates.length > 0 ? <BarChart data={stats.semRates} /> : <p className="text-slate-400 text-center py-10">No data</p>}
                </div>

                {/* CGPA Distribution */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-500" /> CGPA Distribution
                    </h3>
                    <div className="space-y-4">
                        {[
                            { l: 'Excellent (≥3.75)', v: stats.excellent, c: 'bg-emerald-500' },
                            { l: 'Good (3.0-3.74)', v: stats.good, c: 'bg-blue-500' },
                            { l: 'Average (2.0-2.99)', v: stats.average, c: 'bg-amber-500' },
                            { l: 'Below (<2.0)', v: stats.below, c: 'bg-red-500' }
                        ].map((d, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded ${d.c}`} />
                                <span className="text-sm text-slate-600 dark:text-slate-300 flex-1">{d.l}</span>
                                <span className="text-sm font-bold text-slate-800 dark:text-white">{d.v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" /> Recent Results
                        </h3>
                        <Link to="/admin/results" className="text-xs text-blue-600 hover:underline">View All →</Link>
                    </div>
                    <div className="space-y-2">
                        {stats.recent.length > 0 ? stats.recent.map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">{r.name?.charAt(0)}</div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">{r.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{r.sem} • {r.roll}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{r.cgpa?.toFixed(2)}</p>
                                    <p className={`text-xs font-medium ${r.status === 'Passed' ? 'text-emerald-600' : 'text-red-500'}`}>{r.status}</p>
                                </div>
                            </div>
                        )) : <p className="text-slate-400 text-center py-8">No recent results</p>}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {stats.atRisk.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/30">
                            <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Needs Attention
                            </h3>
                            <div className="space-y-2">
                                {stats.atRisk.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-white">{s.name}</p>
                                            <p className="text-xs text-slate-500">Roll: {s.roll}</p>
                                        </div>
                                        <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg">{s.fails} Failed</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-500" /> Top Departments
                        </h3>
                        <div className="space-y-2">
                            {stats.topDepts.length > 0 ? stats.topDepts.map(([n, c], i) => (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition">
                                    <span className="text-sm text-slate-600 dark:text-slate-300">{n?.slice(0, 25)}</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{c}</span>
                                </div>
                            )) : <p className="text-slate-400 text-center py-4">No data</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-3">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> System Online</span>
                    <span className="mx-2">•</span>
                    Last updated: {new Date().toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
