import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalyticsCharts = ({ results }) => {
    // Process data for charts
    const semesterData = results.reduce((acc, curr) => {
        const sem = curr.semester;
        if (!acc[sem]) acc[sem] = { semester: sem, totalCGPA: 0, count: 0 };
        acc[sem].totalCGPA += curr.cgpa;
        acc[sem].count += 1;
        return acc;
    }, {});

    const avgCGPAData = Object.values(semesterData).map(d => ({
        name: d.semester,
        avgCGPA: (d.totalCGPA / d.count).toFixed(2)
    }));

    const passFailData = [
        { name: 'Pass', value: results.filter(r => r.cgpa >= 2.0).length },
        { name: 'Fail', value: results.filter(r => r.cgpa < 2.0).length }
    ];

    const deptData = results.reduce((acc, curr) => {
        const dept = curr.studentId?.department || 'Unknown';
        if (!acc[dept]) acc[dept] = { name: dept, passed: 0, failed: 0 };
        if (curr.cgpa >= 2.00) {
            acc[dept].passed += 1;
        } else {
            acc[dept].failed += 1;
        }
        return acc;
    }, {});

    const departmentChartData = Object.values(deptData);

    return (
        <div className="space-y-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-4 text-slate-800">Average CGPA by Semester</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={avgCGPAData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 4]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="avgCGPA" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-4 text-slate-800">Pass vs Fail Overview</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={passFailData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-4 text-slate-800">Department-wise Performance</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="passed" name="Passed" fill="#4ade80" stackId="a" />
                            <Bar dataKey="failed" name="Failed" fill="#f87171" stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
