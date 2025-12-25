import React, { useMemo } from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';

const TopStudents = ({ results }) => {
    // Get top 5 students by CGPA
    const topStudents = useMemo(() => {
        if (!results || results.length === 0) return [];
        
        // Group results by student and get their latest CGPA
        const studentMap = {};
        results.forEach(r => {
            if (r.studentId && r.cgpa) {
                const studentId = r.studentId._id || r.studentId;
                const studentName = r.studentId?.name || 'Unknown';
                const studentRoll = r.studentId?.roll || '';
                
                if (!studentMap[studentId] || r.cgpa > studentMap[studentId].cgpa) {
                    studentMap[studentId] = {
                        name: studentName,
                        roll: studentRoll,
                        cgpa: r.cgpa,
                        semester: r.semester
                    };
                }
            }
        });

        return Object.values(studentMap)
            .sort((a, b) => b.cgpa - a.cgpa)
            .slice(0, 5);
    }, [results]);

    const getMedalColor = (index) => {
        if (index === 0) return 'text-yellow-500';
        if (index === 1) return 'text-slate-400';
        if (index === 2) return 'text-amber-600';
        return 'text-slate-300';
    };

    const getBgColor = (index) => {
        if (index === 0) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        if (index === 1) return 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700';
        if (index === 2) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
        return 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700';
    };

    if (topStudents.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Top Students</h3>
                </div>
                <p className="text-center text-slate-400 py-6 text-sm">No results yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Top Students</h3>
                    <p className="text-xs text-slate-500">By highest CGPA</p>
                </div>
            </div>

            <div className="space-y-2">
                {topStudents.map((student, index) => (
                    <div 
                        key={index} 
                        className={`flex items-center gap-3 p-3 rounded-lg border ${getBgColor(index)} transition-all hover:scale-[1.02]`}
                    >
                        <div className="flex items-center justify-center w-8">
                            {index < 3 ? (
                                <Award className={`w-6 h-6 ${getMedalColor(index)}`} />
                            ) : (
                                <span className="text-sm font-bold text-slate-400">#{index + 1}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-white truncate text-sm">{student.name}</p>
                            <p className="text-xs text-slate-500">Roll: {student.roll}</p>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold text-lg ${
                                student.cgpa >= 3.75 ? 'text-green-600' :
                                student.cgpa >= 3.5 ? 'text-blue-600' :
                                'text-slate-600'
                            }`}>{student.cgpa?.toFixed(2)}</p>
                            <p className="text-xs text-slate-400">CGPA</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopStudents;
