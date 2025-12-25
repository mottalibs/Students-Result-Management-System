import React, { useState, useEffect, useMemo } from 'react';
import axios from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { X, Plus, Trash2, Save, Loader2, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';

const EditResultModal = ({ result, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        semester: '',
        subjects: []
    });
    const [loading, setLoading] = useState(false);
    const [subjectInput, setSubjectInput] = useState({ subjectName: '', marks: '' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingMarks, setEditingMarks] = useState('');

    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
    const gradePoints = { 'A+': 4.0, 'A': 3.75, 'A-': 3.5, 'B+': 3.25, 'B': 3.0, 'B-': 2.75, 'C+': 2.5, 'C': 2.25, 'D': 2.0, 'F': 0 };

    useEffect(() => {
        if (result) {
            setFormData({
                semester: result.semester,
                subjects: result.subjects?.map(s => ({ ...s })) || []
            });
        }
    }, [result]);

    const calculateGrade = (marks) => {
        const m = parseInt(marks);
        if (isNaN(m)) return 'F';
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

    // Calculate CGPA preview
    const cgpaPreview = useMemo(() => {
        if (formData.subjects.length === 0) return '0.00';
        const total = formData.subjects.reduce((acc, s) => acc + (gradePoints[s.grade] || 0), 0);
        return (total / formData.subjects.length).toFixed(2);
    }, [formData.subjects]);

    // Check if passed
    const statusPreview = useMemo(() => {
        const hasFailed = formData.subjects.some(s => s.grade === 'F');
        return hasFailed ? 'Failed' : 'Passed';
    }, [formData.subjects]);

    const addSubject = () => {
        if (!subjectInput.subjectName || !subjectInput.marks) {
            toast.error('Please fill subject name and marks');
            return;
        }
        const grade = calculateGrade(subjectInput.marks);
        const point = gradePoints[grade];
        setFormData({ 
            ...formData, 
            subjects: [...formData.subjects, { ...subjectInput, grade, point }] 
        });
        setSubjectInput({ subjectName: '', marks: '' });
        toast.success('Subject added!');
    };

    const removeSubject = (index) => {
        setFormData({
            ...formData,
            subjects: formData.subjects.filter((_, i) => i !== index)
        });
        toast.success('Subject removed');
    };

    const startEditingSubject = (index) => {
        setEditingIndex(index);
        setEditingMarks(formData.subjects[index].marks.toString());
    };

    const saveSubjectEdit = (index) => {
        const grade = calculateGrade(editingMarks);
        const point = gradePoints[grade];
        const updatedSubjects = [...formData.subjects];
        updatedSubjects[index] = {
            ...updatedSubjects[index],
            marks: parseInt(editingMarks),
            grade,
            point
        };
        setFormData({ ...formData, subjects: updatedSubjects });
        setEditingIndex(null);
        setEditingMarks('');
        toast.success('Marks updated!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.subjects.length === 0) {
            toast.error('Please add at least one subject');
            return;
        }
        setLoading(true);
        try {
            await axios.put(`/results/${result._id}`, formData);
            toast.success('Result updated successfully! 🎉');
            onUpdate();
            onClose();
        } catch (error) {
            toast.error('Failed to update result');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-blue-500" />
                            Edit Result
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {result?.studentId?.name} (Roll: {result?.studentId?.roll})
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* CGPA Preview Card */}
                    <div className={`p-4 rounded-xl flex items-center justify-between ${statusPreview === 'Passed' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                        <div className="flex items-center gap-3">
                            {statusPreview === 'Passed' ? (
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            ) : (
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            )}
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Predicted Status</p>
                                <p className={`font-bold ${statusPreview === 'Passed' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {statusPreview}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500 dark:text-slate-400">CGPA Preview</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white">{cgpaPreview}</p>
                        </div>
                    </div>

                    {/* Semester */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Semester</label>
                        <select
                            className="w-full border dark:border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            value={formData.semester}
                            onChange={e => setFormData({ ...formData, semester: e.target.value })}
                            required
                        >
                            {semesters.map(s => <option key={s} value={s}>{s} Semester</option>)}
                        </select>
                    </div>

                    {/* Subjects Section */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Manage Subjects ({formData.subjects.length})</h3>
                        
                        {/* Add Subject Input */}
                        <div className="flex gap-2 mb-4">
                            <input
                                className="flex-1 border dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400"
                                placeholder="Subject Name"
                                value={subjectInput.subjectName}
                                onChange={e => setSubjectInput({ ...subjectInput, subjectName: e.target.value })}
                            />
                            <input
                                className="w-24 border dark:border-slate-600 p-2 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400"
                                placeholder="Marks"
                                type="number"
                                min="0"
                                max="100"
                                value={subjectInput.marks}
                                onChange={e => setSubjectInput({ ...subjectInput, marks: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={addSubject}
                                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>

                        {/* Subject List */}
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {formData.subjects.length === 0 ? (
                                <p className="text-center text-slate-400 py-4 text-sm">No subjects added yet</p>
                            ) : (
                                formData.subjects.map((s, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-lg border dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                                        <span className="text-sm font-medium text-slate-800 dark:text-white flex-1">{s.subjectName}</span>
                                        <div className="flex items-center gap-2">
                                            {editingIndex === i ? (
                                                <>
                                                    <input
                                                        type="number"
                                                        className="w-16 border dark:border-slate-600 p-1 rounded text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-center"
                                                        value={editingMarks}
                                                        onChange={(e) => setEditingMarks(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => saveSubjectEdit(i)}
                                                        className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1 rounded"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400 w-12 text-center">{s.marks}</span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold w-10 text-center ${
                                                        s.grade === 'F' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                                                        s.grade?.startsWith('A') ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>{s.grade}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditingSubject(i)}
                                                        className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded"
                                                        title="Edit Marks"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeSubject(i)}
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                                                title="Remove Subject"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || formData.subjects.length === 0}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditResultModal;
