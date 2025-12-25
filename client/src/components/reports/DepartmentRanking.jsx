import React from 'react';
import { Trophy } from 'lucide-react';

const DepartmentRanking = ({ topDeptStats, myDeptStats, myDeptRank, totalDepts, isTeacher }) => {
    if (isTeacher && !myDeptStats) return null;
    if (!isTeacher && !topDeptStats) return null;

    return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-yellow-300" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">
                            {isTeacher ? 'Department Ranking' : 'Top Performing Department'}
                        </h2>
                        <p className="text-indigo-100">
                            {isTeacher ? "Your department's performance analysis" : "Department with the highest average CGPA"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <p className="text-sm text-indigo-100 uppercase tracking-wider font-medium">
                            {isTeacher ? 'Current Rank' : 'Department'}
                        </p>
                        <p className="text-4xl font-bold text-white">
                            {isTeacher ? (
                                <>#{myDeptRank}<span className="text-lg text-indigo-200 font-normal">/{totalDepts}</span></>
                            ) : (
                                <span className="text-2xl">{topDeptStats?.name}</span>
                            )}
                        </p>
                    </div>
                    <div className="h-12 w-px bg-white/20" />
                    <div className="text-center">
                        <p className="text-sm text-indigo-100 uppercase tracking-wider font-medium">Avg CGPA</p>
                        <p className="text-3xl font-bold text-white">
                            {isTeacher ? myDeptStats.avgCGPA : topDeptStats?.avgCGPA}
                        </p>
                    </div>
                    <div className="h-12 w-px bg-white/20" />
                    <div className="text-center">
                        <p className="text-sm text-indigo-100 uppercase tracking-wider font-medium">Pass Rate</p>
                        <p className="text-3xl font-bold text-white">
                            {isTeacher ? myDeptStats.passRate : topDeptStats?.passRate}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentRanking;
