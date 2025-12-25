import React from 'react';
import { Medal, Trophy, TrendingDown } from 'lucide-react';

const TopPerformers = ({ topPerformers, needsImprovement }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performers */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Top Performers</h3>
                        <p className="text-sm text-slate-500">Highest achieving students</p>
                    </div>
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <Medal className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                </div>
                
                <div className="space-y-4">
                    {topPerformers.map((student, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm ${
                                    i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-600' : 'bg-blue-500'
                                }`}>
                                    {i < 3 ? <Trophy className="w-5 h-5" /> : student.img}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                                        {student.name}
                                        {i === 0 && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">1st</span>}
                                    </p>
                                    <p className="text-xs text-slate-500">{student.dept} • {student.roll}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-lg">
                                    {student.cgpa}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Needs Improvement */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Needs Improvement</h3>
                        <p className="text-sm text-slate-500">Students requiring extra attention</p>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                
                <div className="space-y-4">
                    {needsImprovement.length > 0 ? (
                        needsImprovement.map((student, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                                        {student.img}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-white text-sm">{student.name}</p>
                                        <p className="text-xs text-slate-500">{student.dept} • {student.roll}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg">
                                            CGPA: {student.cgpa}
                                        </span>
                                        {student.fails > 0 && (
                                            <span className="text-[10px] text-red-500 font-medium">{student.fails} Subjects Failed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                            <p>No students found requiring immediate attention.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopPerformers;
