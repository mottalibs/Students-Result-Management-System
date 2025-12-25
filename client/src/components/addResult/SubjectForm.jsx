import React, { useRef } from 'react';
import { BookOpen, Plus } from 'lucide-react';

const SubjectForm = ({ 
    quickSubjects, 
    subjects, 
    onAddQuick, 
    subjectInput, 
    setSubjectInput, 
    onAddSubject, 
    calculateGrade 
}) => {
    const subjectInputRef = useRef(null);
    const marksInputRef = useRef(null);

    const handleSubjectKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (subjectInput.subjectName && subjectInput.marks) {
                onAddSubject();
            } else if (subjectInput.subjectName && !subjectInput.marks) {
                marksInputRef.current?.focus();
            }
        }
    };

    const handleMarksKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onAddSubject();
        }
    };

    return (
        <div className="space-y-4">
            {/* Quick Add Subjects */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    <BookOpen className="w-4 h-4 inline mr-1" /> Quick Add Subjects
                </label>
                <div className="flex flex-wrap gap-2">
                    {quickSubjects.map(sub => {
                        const isAdded = subjects.some(s => s.subjectName === sub);
                        return (
                            <button
                                key={sub}
                                type="button"
                                onClick={() => {
                                    if (!isAdded) {
                                        onAddQuick(sub);
                                        marksInputRef.current?.focus();
                                    }
                                }}
                                disabled={isAdded}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    isAdded
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30'
                                }`}
                            >
                                {isAdded ? '✓ ' : ''}{sub}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Add Subject Form */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Subject Name</label>
                        <input
                            ref={subjectInputRef}
                            type="text"
                            placeholder="e.g. Programming"
                            className="w-full border border-slate-300 dark:border-slate-600 px-3 py-2.5 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm"
                            value={subjectInput.subjectName}
                            onChange={e => setSubjectInput({ ...subjectInput, subjectName: e.target.value })}
                            onKeyDown={handleSubjectKeyDown}
                        />
                    </div>
                    <div className="w-24">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Marks</label>
                        <input
                            ref={marksInputRef}
                            type="number"
                            min="0"
                            max="100"
                            placeholder="85"
                            className="w-full border border-slate-300 dark:border-slate-600 px-3 py-2.5 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm text-center"
                            value={subjectInput.marks}
                            onChange={e => setSubjectInput({ ...subjectInput, marks: e.target.value })}
                            onKeyDown={handleMarksKeyDown}
                        />
                    </div>
                    <div className="w-16 text-center">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Grade</label>
                        <div className={`py-2.5 px-2 rounded-lg font-bold text-sm ${
                            calculateGrade(subjectInput.marks) === 'F' ? 'bg-red-100 text-red-600' :
                            calculateGrade(subjectInput.marks)?.startsWith('A') ? 'bg-green-100 text-green-600' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                            {calculateGrade(subjectInput.marks) || '-'}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onAddSubject}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">💡 Press Enter to add quickly</p>
            </div>
        </div>
    );
};

export default SubjectForm;
