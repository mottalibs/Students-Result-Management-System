import React from 'react';
import { BookOpen, Trash2 } from 'lucide-react';

const SubjectList = ({ subjects, onRemove, onClear }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {subjects.length === 0 ? (
                <div className="p-8 text-center">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">No subjects added yet</p>
                    <p className="text-xs text-slate-400">Click quick add buttons or type above</p>
                </div>
            ) : (
                <>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {subjects.length} Subject(s)
                        </span>
                        <button 
                            type="button"
                            onClick={onClear}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-64 overflow-y-auto">
                        {subjects.map((s, i) => (
                            <div key={i} className="flex items-center justify-between px-4 py-3 group hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded text-xs font-bold text-slate-500 flex items-center justify-center">{i + 1}</span>
                                    <span className="font-medium text-slate-800 dark:text-white">{s.subjectName}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-500">{s.marks}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                        s.grade === 'F' ? 'bg-red-100 text-red-700' :
                                        s.grade?.startsWith('A') ? 'bg-green-100 text-green-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>{s.grade}</span>
                                    <span className="text-xs text-slate-400 w-8">{s.point}</span>
                                    <button type="button" onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SubjectList;
