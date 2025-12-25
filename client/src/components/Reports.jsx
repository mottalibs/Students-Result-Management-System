import React, { useState, useEffect, useMemo } from 'react';
import axios from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { parseApiError } from '../utils/apiHelpers';
import StatCard from './reports/StatCard';
import DepartmentRanking from './reports/DepartmentRanking';
import TopPerformers from './reports/TopPerformers';
import ReportCharts from './reports/ReportCharts';
import {
    Download, Printer, Filter, RefreshCw,
    TrendingUp, Users, Award, AlertCircle, ChevronDown
} from 'lucide-react';

const Reports = () => {
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedSem, setSelectedSem] = useState('All');

    // Get current user info
    const teacher = JSON.parse(localStorage.getItem('teacher') || 'null');
    const admin = JSON.parse(localStorage.getItem('admin') || 'null');
    const isAdmin = !!admin;
    const userDept = teacher?.department;

    const departments = ['Computer Science', 'Electrical Engineering', 'Civil Engineering', 'Mechanical Engineering'];
    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentsRes, resultsRes] = await Promise.all([
                axios.get('/students'),
                axios.get('/results')
            ]);

            // Handle both paginated and legacy response formats
            const studentsData = Array.isArray(studentsRes.data) ? studentsRes.data : (studentsRes.data.students || []);
            const resultsData = Array.isArray(resultsRes.data) ? resultsRes.data : (resultsRes.data.results || []);

            setStudents(studentsData);
            setResults(resultsData);
        } catch (err) {
            console.error('Error fetching report data:', err);
            toast.error(parseApiError(err));
        } finally {
            setLoading(false);
        }
    };

    // Analytics Logic
    const analytics = useMemo(() => {
        if (!students.length || !results.length) return null;

        // Filter data based on selection
        let filteredStudents = students;
        let filteredResults = results;

        if (selectedDept !== 'All') {
            filteredStudents = filteredStudents.filter(s => s.department === selectedDept);
            // Filter results for students in selected department
            const studentIds = filteredStudents.map(s => s._id);
            filteredResults = filteredResults.filter(r => studentIds.includes(r.student?._id || r.student));
        }

        if (selectedSem !== 'All') {
            filteredStudents = filteredStudents.filter(s => s.semester === selectedSem);
            filteredResults = filteredResults.filter(r => r.semester === selectedSem);
        }

        // Calculate Stats
        const totalStudents = filteredStudents.length;
        const totalResults = filteredResults.length;

        // Pass Rate
        const passedResults = filteredResults.filter(r => r.cgpa >= 2.0);
        const passRate = totalResults > 0 ? ((passedResults.length / totalResults) * 100).toFixed(1) : 0;

        // Average CGPA
        const totalCGPA = filteredResults.reduce((sum, r) => sum + r.cgpa, 0);
        const avgCGPA = totalResults > 0 ? (totalCGPA / totalResults).toFixed(2) : 0;

        // Needs Improvement (CGPA < 2.5)
        const struggling = filteredResults.filter(r => r.cgpa < 2.5);

        // Top Performers
        const topPerformers = [...filteredResults]
            .sort((a, b) => b.cgpa - a.cgpa)
            .slice(0, 5)
            .map(r => ({
                ...r,
                studentName: r.student?.name || 'Unknown',
                roll: r.student?.roll || 'N/A'
            }));

        // Department Performance (for Bar Chart)
        const deptPerformance = departments.map(dept => {
            const deptStudents = students.filter(s => s.department === dept);
            const deptStudentIds = deptStudents.map(s => s._id);
            const deptResults = results.filter(r => deptStudentIds.includes(r.student?._id || r.student));

            const avg = deptResults.length > 0
                ? (deptResults.reduce((sum, r) => sum + r.cgpa, 0) / deptResults.length)
                : 0;

            const passed = deptResults.filter(r => r.cgpa >= 2.0).length;
            const passRate = deptResults.length > 0 ? (passed / deptResults.length) * 100 : 0;

            return { name: dept, avgCGPA: parseFloat(avg.toFixed(2)), passRate: parseFloat(passRate.toFixed(1)), cgpa: parseFloat(avg.toFixed(2)) };
        });

        // Top Department
        const topDeptStats = [...deptPerformance].sort((a, b) => b.avgCGPA - a.avgCGPA)[0];

        // My Department Stats (for Teacher)
        let myDeptStats = null;
        let myDeptRank = 0;
        if (userDept) {
            myDeptStats = deptPerformance.find(d => d.name === userDept);
            myDeptRank = [...deptPerformance].sort((a, b) => b.avgCGPA - a.avgCGPA).findIndex(d => d.name === userDept) + 1;
        }

        // CGPA Distribution (for Pie Chart)
        const distribution = [
            { name: 'Excellent (3.5-4.0)', value: filteredResults.filter(r => r.cgpa >= 3.5).length, color: '#10B981' },
            { name: 'Good (3.0-3.49)', value: filteredResults.filter(r => r.cgpa >= 3.0 && r.cgpa < 3.5).length, color: '#3B82F6' },
            { name: 'Average (2.5-2.99)', value: filteredResults.filter(r => r.cgpa >= 2.5 && r.cgpa < 3.0).length, color: '#F59E0B' },
            { name: 'Poor (< 2.5)', value: filteredResults.filter(r => r.cgpa < 2.5).length, color: '#EF4444' },
        ].filter(d => d.value > 0);

        // Semester Progression (for Area Chart)
        const semesterProgression = semesters.map(sem => {
            const semResults = filteredResults.filter(r => r.semester === sem);
            const avg = semResults.length > 0
                ? (semResults.reduce((sum, r) => sum + r.cgpa, 0) / semResults.length)
                : 0;
            return { name: sem, cgpa: parseFloat(avg.toFixed(2)) };
        });

        return {
            totalStudents,
            totalResults,
            passRate,
            avgCGPA,
            strugglingCount: struggling.length,
            topPerformers,
            strugglingList: struggling.slice(0, 5).map(r => ({...r, studentName: r.student?.name, roll: r.student?.roll})),
            deptPerformance,
            distribution,
            semesterProgression,
            topDeptStats,
            myDeptStats,
            myDeptRank,
            totalDepts: departments.length
        };
    }, [students, results, selectedDept, selectedSem]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-slate-500">Generating analytics...</p>
                </div>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        if (!results.length) {
            toast.error('No data to export');
            return;
        }

        const headers = ['Student Name', 'Roll', 'Department', 'Semester', 'Subject', 'Marks', 'Grade', 'Point', 'CGPA'];
        const csvContent = [
            headers.join(','),
            ...results.flatMap(r => 
                r.subjects.map(sub => [
                    `"${r.student?.name || 'N/A'}"`,
                    `"${r.student?.roll || 'N/A'}"`,
                    `"${r.student?.department || 'N/A'}"`,
                    `"${r.semester}"`,
                    `"${sub.subjectName}"`,
                    sub.marks,
                    sub.grade,
                    sub.point,
                    r.cgpa
                ].join(','))
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Result_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 print:space-y-4">
            {/* Header Controls */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm print:hidden">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-white">Analytics & Reports</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Overview of student performance</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
                            <Filter className="w-4 h-4 text-slate-400 ml-2" />
                            <div className="relative group">
                                <select
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 text-sm font-medium outline-none cursor-pointer min-w-[160px]"
                                    disabled={!isAdmin}
                                >
                                    <option value="All" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All Departments</option>
                                    {departments.map(d => <option key={d} value={d} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{d}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                            <div className="relative group">
                                <select
                                    value={selectedSem}
                                    onChange={(e) => setSelectedSem(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 text-sm font-medium outline-none cursor-pointer min-w-[140px]"
                                >
                                    <option value="All" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">All Semesters</option>
                                    {semesters.map(s => <option key={s} value={s} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <button onClick={handlePrint} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Print Report">
                            <Printer className="w-5 h-5" />
                        </button>
                        <button onClick={handleExportCSV} className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Export CSV">
                            <Download className="w-5 h-5" />
                        </button>
                        <button onClick={fetchData} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Refresh Data">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {analytics && (
                <>
                    {/* Department Ranking Banner */}
                    <DepartmentRanking
                        topDeptStats={analytics.topDeptStats}
                        myDeptStats={analytics.myDeptStats}
                        myDeptRank={analytics.myDeptRank}
                        totalDepts={analytics.totalDepts}
                        isTeacher={!isAdmin}
                    />

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Results"
                            value={analytics.totalResults}
                            icon={Users}
                            color="from-blue-500 to-blue-600"
                            trend="+12% from last sem"
                        />
                        <StatCard
                            label="Pass Rate"
                            value={`${analytics.passRate}%`}
                            icon={Award}
                            color="from-emerald-500 to-emerald-600"
                            trend="+5% from last sem"
                        />
                        <StatCard
                            label="Average CGPA"
                            value={analytics.avgCGPA}
                            icon={TrendingUp}
                            color="from-purple-500 to-purple-600"
                            trend="Stable"
                        />
                        <StatCard
                            label="Needs Improvement"
                            value={analytics.strugglingCount}
                            icon={AlertCircle}
                            color="from-orange-500 to-orange-600"
                            trend="Decreased by 2"
                        />
                    </div>

                    {/* Charts Section */}
                    <ReportCharts
                        deptPerformance={analytics.deptPerformance}
                        distribution={analytics.distribution}
                        semesterProgression={analytics.semesterProgression}
                        totalStudents={analytics.totalStudents}
                    />

                    {/* Top Performers & Needs Improvement */}
                    <TopPerformers
                        topPerformers={analytics.topPerformers}
                        needsImprovement={analytics.strugglingList}
                    />
                </>
            )}
        </div>
    );
};

export default Reports;
