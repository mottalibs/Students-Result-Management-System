import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, User, CheckCircle, Copy } from 'lucide-react';

const StudentSelector = ({ 
    students, 
    selectedStudent, 
    onSelect, 
    onClear,
    semester,
    onSemesterChange,
    semesters,
    previousResults,
    onCopyPrevious,
    sendNotification,
    setSendNotification
}) => {
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const filteredStudents = useMemo(() => {
        if (!search.trim()) return students.slice(0, 10);
        return students.filter(s => 
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.roll?.toString().includes(search)
        ).slice(0, 10);
    }, [students, search]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (student) => {
        onSelect(student);
        setSearch(student.name);
        setShowDropdown(false);
    };

    const handleClear = () => {
        onClear();
        setSearch('');
    };

    return (
        <div className="space-y-4">
            {/* Student Selection */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" /> Student
                </label>
                <div ref={dropdownRef} className="relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or roll..."
                            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setShowDropdown(true);
                                if (!e.target.value) handleClear();
                            }}
                            onFocus={() => setShowDropdown(true)}
                        />
                        {selectedStudent && (
                            <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    
                    {showDropdown && filteredStudents.length > 0 && !selectedStudent && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {filteredStudents.map(student => (
                                <button
                                    key={student._id}
                                    type="button"
                                    onClick={() => handleSelect(student)}
                                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2 text-sm border-b last:border-b-0 dark:border-slate-600"
                                >
                                    <span className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                        {student.name?.charAt(0)}
                                    </span>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-white">{student.name}</p>
                                        <p className="text-xs text-slate-500">Roll: {student.roll}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {selectedStudent && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-slate-800 dark:text-white">{selectedStudent.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 ml-6">Roll: {selectedStudent.roll} • {selectedStudent.department}</p>
                    </div>
                )}
            </div>

            {/* Semester Selection */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Semester</label>
                <div className="grid grid-cols-4 gap-2">
                    {semesters.map(sem => (
                        <button
                            key={sem}
                            type="button"
                            onClick={() => onSemesterChange(sem)}
                            className={`py-2 rounded-lg text-sm font-bold transition-all ${
                                semester === sem 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                        >
                            {sem}
                        </button>
                    ))}
                </div>
            </div>

            {/* Previous Results - Copy Feature */}
            {selectedStudent && previousResults.length > 0 && (
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        <Copy className="w-4 h-4 inline mr-1" /> Copy from Previous
                    </label>
                    <div className="space-y-2">
                        {previousResults.slice(0, 3).map(prev => (
                            <button
                                key={prev._id}
                                type="button"
                                onClick={() => onCopyPrevious(prev)}
                                className="w-full flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-sm"
                            >
                                <span className="text-slate-600 dark:text-slate-300">{prev.semester} Semester</span>
                                <span className="text-xs text-slate-400">{prev.subjects?.length} subjects</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Email Notification */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={sendNotification}
                        onChange={e => setSendNotification(e.target.checked)}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Send Email Notification</span>
                </label>
            </div>
        </div>
    );
};

export default StudentSelector;
