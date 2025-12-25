import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Download, Filter, TrendingUp, Users, BookOpen, Award } from 'lucide-react';
import { CardSkeleton } from './Skeleton';

const TeacherAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [subjectPerformance, setSubjectPerformance] = useState([]);
    const [gradeDistribution, setGradeDistribution] = useState([]);
    const [semesterTrend, setSemesterTrend] = useState([]);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const res = await axios.get('/results');
            const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setResults(data);
            processAnalytics(data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const processAnalytics = (data) => {
        // Mock Data Logic (Same as before but ensures robustness)
        const mockSubjectData = [
            { name: 'Math', avg: 3.8, students: 45 },
            { name: 'Physics', avg: 3.2, students: 42 },
            { name: 'Chem', avg: 3.5, students: 40 },
            { name: 'CS', avg: 3.9, students: 50 },
            { name: 'Eng', avg: 3.6, students: 48 },
        ];
        setSubjectPerformance(mockSubjectData);

        const grades = { 'A+': 0, 'A': 0, 'A-': 0, 'B': 0, 'C': 0, 'F': 0 };
        data.forEach(r => {
            if (r.cgpa >= 4.0) grades['A+']++;
            else if (r.cgpa >= 3.75) grades['A']++;
            else if (r.cgpa >= 3.5) grades['A-']++;
            else if (r.cgpa >= 3.0) grades['B']++;
            else if (r.cgpa >= 2.0) grades['C']++;
            else grades['F']++;
        });
        
        setGradeDistribution([
            { name: 'A+', value: grades['A+'], color: '#10b981' },
            { name: 'A', value: grades['A'], color: '#3b82f6' },
            { name: 'A-', value: grades['A-'], color: '#6366f1' },
            { name: 'B', value: grades['B'], color: '#f59e0b' },
            { name: 'C', value: grades['C'], color: '#f97316' },
            { name: 'F', value: grades['F'], color: '#ef4444' },
        ]);

        const trendData = [
            { semester: 'Sem 1', avgCgpa: 3.2 },
            { semester: 'Sem 2', avgCgpa: 3.4 },
            { semester: 'Sem 3', avgCgpa: 3.3 },
            { semester: 'Sem 4', avgCgpa: 3.6 },
            { semester: 'Sem 5', avgCgpa: 3.8 },
        ];
        setSemesterTrend(trendData);
    };

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><CardSkeleton /><CardSkeleton /></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Detailed performance metrics and trends.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm font-medium transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="px-3 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard title="Avg CGPA" value="3.54" trend="+0.2" icon={TrendingUp} color="blue" />
                <MetricCard title="Active Students" value={results.length} trend="Total" icon={Users} color="purple" />
                <MetricCard title="Subjects" value="5" trend="Current" icon={BookOpen} color="emerald" />
                <MetricCard title="Distinctions" value={gradeDistribution[0]?.value || 0} trend="Top 5%" icon={Award} color="amber" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Performance */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6">Subject Performance</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectPerformance} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" domain={[0, 4]} hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={60} />
                                <Tooltip 
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="avg" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                                    {subjectPerformance.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Grade Distribution */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6">Grade Distribution</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gradeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {gradeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6">Performance Trend</h3>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={semesterTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                            <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="avgCgpa" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, trend, icon: Icon, color }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
        purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
        emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
        amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded">
                    {trend}
                </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">{value}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        </div>
    );
};

export default TeacherAnalytics;
