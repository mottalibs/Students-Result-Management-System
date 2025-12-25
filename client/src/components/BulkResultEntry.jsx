import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { Plus, Trash2, Save, Loader2, Search, CheckCircle, X, Copy, Users, Zap } from 'lucide-react';

const BulkResultEntry = ({ refreshData }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [semester, setSemester] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('all');
    const [subjects, setSubjects] = useState([{ name: '', credit: 3 }]);
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sendNotification, setSendNotification] = useState(false);
    const inputRefs = useRef({});

    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
    const gradePoints = { 'A+': 4.0, 'A': 3.75, 'A-': 3.5, 'B+': 3.25, 'B': 3.0, 'B-': 2.75, 'C+': 2.5, 'C': 2.25, 'D': 2.0, 'F': 0 };

    const commonSubjects = [
        'Mathematics', 'Physics', 'Chemistry', 'Programming', 'Data Structures',
        'Database', 'Networks', 'Web Development', 'Operating Systems', 'Algorithms',
        'Software Engineering', 'English', 'Communication Skills', 'Project Work'
    ];

    useEffect(() => { fetchStudents(); }, []);

    // Ctrl+S to save all
    useEffect(() => {
        const handleGlobalSave = (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                if (rows.length > 0 && !saving) saveAllResults();
            }
        };
        window.addEventListener('keydown', handleGlobalSave);
        return () => window.removeEventListener('keydown', handleGlobalSave);
    }, [rows, saving]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/students');
            const studentData = Array.isArray(res.data) ? res.data : (res.data.students || []);
            setStudents(studentData);
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const calculateGrade = (marks) => {
        const m = parseInt(marks);
        if (isNaN(m) || m === '') return '-';
        if (m >= 80) return 'A+';
        if (m >= 75) return 'A';
        if (m >= 70) return 'A-';
        if (m >= 65) return 'B+';
        if (m >= 60) return 'B';
        if (m >= 55) return 'B-';
        if (m >= 50) return 'C+';
        if (m >= 45) return 'C';
        if (m >= 40) return 'D';
        return 'F';
    };

    const calculateCGPA = (marks) => {
        const validMarks = marks.filter(m => m !== '' && !isNaN(m));
        if (validMarks.length === 0) return '-';
        const grades = validMarks.map(m => gradePoints[calculateGrade(m)] || 0);
        return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
    };

    const filteredStudents = useMemo(() => {
        const addedIds = rows.map(r => r.studentId);
        return students
            .filter(s => !addedIds.includes(s._id))
            .filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll?.toString().includes(searchTerm))
            .slice(0, 20);
    }, [students, rows, searchTerm]);

    const addSubjectColumn = () => {
        setSubjects([...subjects, { name: '', credit: 3 }]);
        setRows(rows.map(r => ({ ...r, marks: [...r.marks, ''] })));
    };

    const removeSubjectColumn = (index) => {
        if (subjects.length <= 1) return;
        setSubjects(subjects.filter((_, i) => i !== index));
        setRows(rows.map(r => ({ ...r, marks: r.marks.filter((_, i) => i !== index) })));
    };

    const updateSubjectName = (index, name) => {
        setSubjects(subjects.map((s, i) => i === index ? { ...s, name } : s));
    };

    const addStudentRow = (student) => {
        if (rows.some(r => r.studentId === student._id)) {
            toast.error('Student already added');
            return;
        }
        setRows([...rows, {
            studentId: student._id,
            student,
            marks: subjects.map(() => ''),
            saved: false
        }]);
        setSearchTerm('');
    };

    // Add all students at once
    const addAllStudents = (filterSemester = 'all') => {
        const existingIds = rows.map(r => r.studentId);
        let studentsToAdd = students.filter(s => !existingIds.includes(s._id));
        if (filterSemester !== 'all') {
            studentsToAdd = studentsToAdd.filter(s => s.semester === filterSemester);
        }
        if (studentsToAdd.length === 0) {
            toast.error('No students to add!');
            return;
        }
        const newRows = studentsToAdd.map(student => ({
            studentId: student._id,
            student,
            marks: subjects.map(() => ''),
            saved: false
        }));
        setRows([...rows, ...newRows]);
        toast.success(`Added ${studentsToAdd.length} students!`);
    };

    const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

    const updateMarks = (rowIndex, markIndex, value) => {
        const newRows = [...rows];
        newRows[rowIndex].marks[markIndex] = value;
        newRows[rowIndex].saved = false;
        setRows(newRows);
    };

    const handlePaste = (e, startRowIndex, startColIndex) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').split('\n').map(row => row.split('\t'));
        const newRows = [...rows];

        pasteData.forEach((row, rIdx) => {
            const currentRowIdx = startRowIndex + rIdx;
            if (currentRowIdx < newRows.length) {
                row.forEach((cell, cIdx) => {
                    const currentColIdx = startColIndex + cIdx;
                    if (currentColIdx < subjects.length) {
                        const val = cell.trim();
                        if (!isNaN(val) && val !== '') {
                            newRows[currentRowIdx].marks[currentColIdx] = val;
                            newRows[currentRowIdx].saved = false;
                        }
                    }
                });
            }
        });
        setRows(newRows);
        toast.success('Data pasted from clipboard!');
    };

    // Keyboard navigation
    const handleKeyDown = useCallback((e, rowIndex, colIndex) => {
        const key = e.key;
        const totalCols = subjects.length;
        const totalRows = rows.length;

        if (key === 'Enter' || key === 'Tab') {
            e.preventDefault();
            let nextRow = rowIndex;
            let nextCol = colIndex + 1;
            if (nextCol >= totalCols) { nextCol = 0; nextRow++; }
            if (nextRow < totalRows) inputRefs.current[`${nextRow}-${nextCol}`]?.focus();
        } else if (key === 'ArrowDown' && rowIndex < totalRows - 1) {
            inputRefs.current[`${rowIndex + 1}-${colIndex}`]?.focus();
        } else if (key === 'ArrowUp' && rowIndex > 0) {
            inputRefs.current[`${rowIndex - 1}-${colIndex}`]?.focus();
        } else if (key === 'ArrowRight' && colIndex < totalCols - 1) {
            inputRefs.current[`${rowIndex}-${colIndex + 1}`]?.focus();
        } else if (key === 'ArrowLeft' && colIndex > 0) {
            inputRefs.current[`${rowIndex}-${colIndex - 1}`]?.focus();
        }
    }, [subjects.length, rows.length]);

    // Save all results
    const saveAllResults = async () => {
        if (!semester) { toast.error('Please select semester'); return; }
        if (subjects.some(s => !s.name.trim())) { toast.error('Fill all subject names'); return; }
        
        const validRows = rows.filter(r => r.marks.some(m => m !== ''));
        if (validRows.length === 0) { toast.error('No data to save'); return; }

        setSaving(true);
        let saved = 0, failed = 0;

        for (const row of validRows) {
            if (row.saved) continue;
            try {
                const resultSubjects = subjects.map((sub, i) => ({
                    subjectName: sub.name,
                    marks: parseInt(row.marks[i]) || 0,
                    grade: calculateGrade(row.marks[i]),
                    point: gradePoints[calculateGrade(row.marks[i])] || 0
                }));
                await axios.post('/results', { studentId: row.studentId, semester, subjects: resultSubjects, sendNotification });
                row.saved = true;
                saved++;
            } catch (err) { failed++; }
        }

        setRows([...rows]);
        setSaving(false);
        if (saved > 0) toast.success(`${saved} result(s) saved!`);
        if (failed > 0) toast.error(`${failed} failed`);
        if (saved > 0 && refreshData) refreshData();
    };

    const copyFromAbove = (rowIndex) => {
        if (rowIndex === 0) return;
        const newRows = [...rows];
        newRows[rowIndex].marks = [...rows[rowIndex - 1].marks];
        setRows(newRows);
    };

    const clearAll = () => {
        setRows([]);
        setSemester('');
        setSubjects([{ name: '', credit: 3 }]);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Quick Bulk Entry</h2>
                            <p className="text-sm text-slate-500">Spreadsheet-style result entry • Ctrl+S to save</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={clearAll} className="px-3 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm">Clear All</button>
                        <button onClick={saveAllResults} disabled={saving || rows.length === 0} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save All ({rows.filter(r => !r.saved && r.marks.some(m => m !== '')).length})
                        </button>
                    </div>
                </div>

                {/* Semester & Settings */}
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Semester</label>
                        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white min-w-[120px]">
                            <option value="">Select...</option>
                            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                            <input type="checkbox" checked={sendNotification} onChange={(e) => setSendNotification(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                            Email Notifications
                        </label>
                    </div>
                </div>
            </div>

            {/* Subject Headers */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Subjects:</span>
                    <button onClick={addSubjectColumn} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">+ Add Subject</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {subjects.map((sub, i) => (
                        <div key={i} className="relative">
                            <input type="text" value={sub.name} onChange={(e) => updateSubjectName(i, e.target.value)} placeholder={`Subject ${i + 1}`} list="subject-suggestions" className="w-36 border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white pr-8" />
                            {subjects.length > 1 && (
                                <button onClick={() => removeSubjectColumn(i)} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                    <datalist id="subject-suggestions">
                        {commonSubjects.map(s => <option key={s} value={s} />)}
                    </datalist>
                </div>
            </div>

            {/* Student Search + Add All */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search student..." className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                        {searchTerm && filteredStudents.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {filteredStudents.map(student => (
                                    <button key={student._id} onClick={() => addStudentRow(student)} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-3 text-sm">
                                        <span className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">{student.name?.charAt(0)}</span>
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-white">{student.name}</p>
                                            <p className="text-xs text-slate-500">Roll: {student.roll}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} className="border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm">
                            <option value="all">All Semesters</option>
                            {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => addAllStudents(semesterFilter)} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
                            <Users className="w-4 h-4" />
                            Add All
                        </button>
                    </div>
                </div>
                <p className="text-xs text-slate-500">💡 Arrow keys to navigate • Enter/Tab next cell • <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">Ctrl+S</kbd> save</p>
            </div>

            {/* Data Table */}
            {rows.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400 sticky left-0 bg-slate-50 dark:bg-slate-900 min-w-[180px]">Student</th>
                                    {subjects.map((sub, i) => (
                                        <th key={i} className="px-2 py-3 text-center font-medium text-slate-600 dark:text-slate-400 min-w-[80px]">{sub.name || `Sub ${i + 1}`}</th>
                                    ))}
                                    <th className="px-3 py-3 text-center font-medium text-slate-600 dark:text-slate-400">CGPA</th>
                                    <th className="px-3 py-3 text-center font-medium text-slate-600 dark:text-slate-400">Status</th>
                                    <th className="px-2 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {rows.map((row, rowIndex) => {
                                    const cgpa = calculateCGPA(row.marks);
                                    const hasFail = row.marks.some(m => calculateGrade(m) === 'F');
                                    return (
                                        <tr key={row.studentId} className={row.saved ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                                            <td className="px-4 py-2 sticky left-0 bg-white dark:bg-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">{row.student.name?.charAt(0)}</span>
                                                    <div>
                                                        <p className="font-medium text-slate-800 dark:text-white text-sm">{row.student.name}</p>
                                                        <p className="text-xs text-slate-500">{row.student.roll}</p>
                                                    </div>
                                                    {row.saved && <CheckCircle className="w-4 h-4 text-green-500 ml-1" />}
                                                </div>
                                            </td>
                                            {row.marks.map((mark, colIndex) => (
                                                <td key={colIndex} className="px-1 py-2">
                                                    <div className="relative">
                                                        <input
                                                            ref={el => inputRefs.current[`${rowIndex}-${colIndex}`] = el}
                                                            type="number" min="0" max="100" value={mark}
                                                            onChange={(e) => updateMarks(rowIndex, colIndex, e.target.value)}
                                                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                                            onPaste={(e) => handlePaste(e, rowIndex, colIndex)}
                                                            className={`w-16 text-center border rounded py-1.5 text-sm ${
                                                                calculateGrade(mark) === 'F' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                                                            } text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none`}
                                                        />
                                                        <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold ${
                                                            calculateGrade(mark) === 'F' ? 'text-red-500' : calculateGrade(mark).startsWith('A') ? 'text-green-600' : 'text-slate-500'
                                                        }`}>{calculateGrade(mark)}</span>
                                                    </div>
                                                </td>
                                            ))}
                                            <td className="px-3 py-2 text-center">
                                                <span className={`font-bold ${cgpa !== '-' && parseFloat(cgpa) >= 3.5 ? 'text-green-600' : cgpa !== '-' && parseFloat(cgpa) >= 3.0 ? 'text-blue-600' : 'text-slate-600'}`}>{cgpa}</span>
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {row.marks.some(m => m !== '') && (hasFail ? <span className="text-red-500 text-xs font-medium">Fail</span> : <span className="text-green-500 text-xs font-medium">Pass</span>)}
                                            </td>
                                            <td className="px-2 py-2">
                                                <div className="flex gap-1">
                                                    {rowIndex > 0 && <button onClick={() => copyFromAbove(rowIndex)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Copy from above"><Copy className="w-3 h-3" /></button>}
                                                    <button onClick={() => removeRow(rowIndex)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {rows.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No students added yet</p>
                    <p className="text-slate-500 text-sm">Search or click "Add All" to start</p>
                </div>
            )}
        </div>
    );
};

export default BulkResultEntry;
