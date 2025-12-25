import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { Zap, Save, X } from 'lucide-react';
import StudentSelector from './addResult/StudentSelector';
import SubjectForm from './addResult/SubjectForm';
import SubjectList from './addResult/SubjectList';
import ResultPreview from './addResult/ResultPreview';

const DRAFT_KEY = 'result_form_draft';

const AddResultForm = ({ students: initialStudents, refreshData }) => {
    const [students, setStudents] = useState(initialStudents || []);
    const [resultData, setResultData] = useState({
        studentId: '', semester: '', cgpa: '', subjects: []
    });
    const [subjectInput, setSubjectInput] = useState({ subjectName: '', marks: '' });
    const [sendNotification, setSendNotification] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [previousResults, setPreviousResults] = useState([]);
    const [hasDraft, setHasDraft] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
    const gradePoints = { 'A+': 4.0, 'A': 3.75, 'A-': 3.5, 'B+': 3.25, 'B': 3.0, 'B-': 2.75, 'C+': 2.5, 'C': 2.25, 'D': 2.0, 'F': 0 };

    // Common subjects for quick add
    const quickSubjects = [
        'Programming', 'Database', 'Networks', 'Web Development', 
        'Data Structures', 'Algorithms', 'Mathematics', 'Physics',
        'English', 'Operating Systems', 'Software Engineering', 'Project Work'
    ];

    useEffect(() => {
        if (!initialStudents || initialStudents.length === 0) {
            fetchStudents();
        }
    }, [initialStudents]);

    // Fetch previous results when student is selected
    useEffect(() => {
        if (selectedStudent) {
            fetchPreviousResults(selectedStudent.roll);
        } else {
            setPreviousResults([]);
        }
    }, [selectedStudent]);

    // Calculate CGPA when subjects change
    useEffect(() => {
        if (resultData.subjects.length > 0) {
            const total = resultData.subjects.reduce((acc, s) => acc + (gradePoints[s.grade] || 0), 0);
            const cgpa = (total / resultData.subjects.length).toFixed(2);
            setResultData(prev => ({ ...prev, cgpa }));
        } else {
            setResultData(prev => ({ ...prev, cgpa: '0.00' }));
        }
    }, [resultData.subjects]);

    // Load draft on mount
    useEffect(() => {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                if (parsed.subjects && parsed.subjects.length > 0) {
                    setHasDraft(true);
                    toast((t) => (
                        <div className="flex items-center gap-3">
                            <Save className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="font-medium">Draft found!</p>
                                <p className="text-xs text-slate-500">{parsed.subjects.length} subjects saved</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setResultData(parsed);
                                    setHasDraft(false);
                                    toast.dismiss(t.id);
                                    toast.success('Draft restored!');
                                }}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg"
                            >
                                Restore
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem(DRAFT_KEY);
                                    setHasDraft(false);
                                    toast.dismiss(t.id);
                                }}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ), { duration: 10000 });
                }
            } catch (e) { /* ignore parse errors */ }
        }
    }, []);

    // Auto-save draft every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (resultData.subjects.length > 0 || resultData.semester) {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(resultData));
                setLastSaved(new Date());
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [resultData]);

    // Clear draft on successful submit
    const clearDraft = () => {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
        setLastSaved(null);
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get('/students');
            setStudents(res.data);
        } catch (err) {
            toast.error('Failed to load students');
        }
    };

    const fetchPreviousResults = async (roll) => {
        try {
            const res = await axios.get(`/results/search/${roll}`);
            setPreviousResults(res.data);
        } catch (err) {
            setPreviousResults([]);
        }
    };

    const calculateGrade = (marks) => {
        const m = parseInt(marks);
        if (isNaN(m)) return '';
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

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setResultData({ ...resultData, studentId: student._id });
    };

    const clearStudent = () => {
        setSelectedStudent(null);
        setResultData({ ...resultData, studentId: '' });
        setPreviousResults([]);
    };

    const handleAddResult = async (e) => {
        if (e) e.preventDefault();
        
        if (!resultData.studentId) {
            toast.error('Please select a student');
            return;
        }
        if (!resultData.semester) {
            toast.error('Please select semester');
            return;
        }
        if (resultData.subjects.length === 0) {
            toast.error('Add at least one subject');
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('/results', { ...resultData, sendNotification });
            toast.success('Result Published! 🎉');
            // Reset form and clear draft
            setResultData({ studentId: '', semester: '', cgpa: '', subjects: [] });
            setSelectedStudent(null);
            setSendNotification(false);
            setPreviousResults([]);
            clearDraft(); // Clear saved draft
            if (refreshData) refreshData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error adding result');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addSubject = useCallback(() => {
        if (!subjectInput.subjectName.trim()) {
            toast.error('Enter subject name');
            return;
        }
        if (!subjectInput.marks) {
            toast.error('Enter marks');
            return;
        }
        
        // Smart Validation
        const marksNum = parseInt(subjectInput.marks);
        if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
            toast.error('Marks must be between 0 and 100');
            return;
        }
        
        // Check duplicate
        if (resultData.subjects.some(s => s.subjectName.toLowerCase() === subjectInput.subjectName.toLowerCase())) {
            toast.error('Subject already added');
            return;
        }

        const grade = calculateGrade(subjectInput.marks);
        const point = gradePoints[grade];
        setResultData(prev => ({ 
            ...prev, 
            subjects: [...prev.subjects, { ...subjectInput, grade, point }] 
        }));
        setSubjectInput({ subjectName: '', marks: '' });
    }, [subjectInput, resultData.subjects]);

    const addQuickSubject = (subjectName) => {
        if (resultData.subjects.some(s => s.subjectName === subjectName)) {
            toast.error('Already added');
            return;
        }
        setSubjectInput({ ...subjectInput, subjectName });
    };

    const removeSubject = (index) => {
        setResultData(prev => ({
            ...prev,
            subjects: prev.subjects.filter((_, i) => i !== index)
        }));
    };

    const copyFromPrevious = (prevResult) => {
        const copiedSubjects = prevResult.subjects.map(s => ({
            subjectName: s.subjectName,
            marks: '',
            grade: '',
            point: 0
        }));
        setResultData(prev => ({
            ...prev,
            subjects: copiedSubjects,
            semester: prevResult.semester
        }));
        toast.success('Subjects copied! Now enter marks.');
    };

    // Global Ctrl+Enter to submit
    useEffect(() => {
        const handleGlobalKey = (e) => {
            if (e.ctrlKey && e.key === 'Enter' && resultData.subjects.length > 0) {
                handleAddResult(e);
            }
        };
        window.addEventListener('keydown', handleGlobalKey);
        return () => window.removeEventListener('keydown', handleGlobalKey);
    }, [resultData]);

    const hasFailingSubject = resultData.subjects.some(s => s.grade === 'F');
    const statusPreview = hasFailingSubject ? 'Failed' : (resultData.subjects.length > 0 ? 'Passed' : '-');

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Quick Result Entry</h2>
                        <p className="text-sm text-slate-500">Add results fast • Press Enter to add subjects • Ctrl+Enter to publish</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleAddResult} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Student & Semester */}
                <StudentSelector 
                    students={students}
                    selectedStudent={selectedStudent}
                    onSelect={handleStudentSelect}
                    onClear={clearStudent}
                    semester={resultData.semester}
                    onSemesterChange={(sem) => setResultData({ ...resultData, semester: sem })}
                    semesters={semesters}
                    previousResults={previousResults}
                    onCopyPrevious={copyFromPrevious}
                    sendNotification={sendNotification}
                    setSendNotification={setSendNotification}
                />

                {/* Middle Column - Subjects */}
                <div className="lg:col-span-2 space-y-4">
                    <SubjectForm 
                        quickSubjects={quickSubjects}
                        subjects={resultData.subjects}
                        onAddQuick={addQuickSubject}
                        subjectInput={subjectInput}
                        setSubjectInput={setSubjectInput}
                        onAddSubject={addSubject}
                        calculateGrade={calculateGrade}
                    />

                    <SubjectList 
                        subjects={resultData.subjects}
                        onRemove={removeSubject}
                        onClear={() => setResultData({ ...resultData, subjects: [] })}
                    />

                    <ResultPreview 
                        cgpa={resultData.cgpa}
                        status={statusPreview}
                        isSubmitting={isSubmitting}
                        isValid={resultData.subjects.length > 0 && selectedStudent && resultData.semester}
                        onSubmit={handleAddResult}
                    />
                </div>
            </form>
        </div>
    );
};

export default AddResultForm;
