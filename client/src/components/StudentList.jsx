import React, { useState, useEffect, useMemo } from 'react';
import axios from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { parseApiError } from '../utils/apiHelpers';
import StudentFilters from './studentList/StudentFilters';
import StudentTable from './studentList/StudentTable';
import AddStudentModal from './studentList/AddStudentModal';
import ConfirmModal from './ConfirmModal';

const StudentList = ({ students: initialStudents = [], loading: initialLoading = false, refreshData }) => {
    const [students, setStudents] = useState(initialStudents);
    const [loading, setLoading] = useState(initialLoading);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        department: '',
        semester: '',
        sortBy: 'name',
        sortOrder: 'asc'
    });
    
    const [expandedId, setExpandedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    
    const [isAdding, setIsAdding] = useState(false);
    const [addForm, setAddForm] = useState({
        name: '', roll: '', registrationNo: '', department: 'Computer Science', semester: '1st', email: '', phone: ''
    });

    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });

    // Sync with props
    useEffect(() => {
        setStudents(initialStudents);
    }, [initialStudents]);

    useEffect(() => {
        setLoading(initialLoading);
    }, [initialLoading]);

    const teacher = JSON.parse(localStorage.getItem('teacher') || 'null');
    const admin = JSON.parse(localStorage.getItem('admin') || 'null');
    const isAdmin = !!admin;

    const departments = ['Computer Science', 'Electrical Engineering', 'Civil Engineering', 'Mechanical Engineering', 'Electronics & Telecommunication'];
    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

    const handleRefresh = () => {
        if (refreshData) {
            refreshData();
        } else {
            // Fallback if no refreshData prop
            fetchStudents();
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/students');
            const studentData = Array.isArray(res.data) ? res.data : (res.data.students || []);
            setStudents(studentData);
        } catch (err) {
            toast.error(parseApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (student) => {
        if (expandedId === student._id) {
            setExpandedId(null);
            setIsEditing(false);
        } else {
            setExpandedId(student._id);
            setEditForm(student);
            setIsEditing(false);
        }
    };

    const saveEdit = async () => {
        try {
            await axios.put(`/students/${expandedId}`, editForm);
            toast.success('Updated successfully!');
            setStudents(prev => prev.map(s => s._id === expandedId ? { ...s, ...editForm } : s));
            setIsEditing(false);
            if (refreshData) refreshData();
        } catch (err) {
            toast.error(parseApiError(err));
        }
    };

    const handleDeleteClick = (student, e) => {
        e.stopPropagation();
        setDeleteConfirm({ show: true, id: student._id, name: student.name });
    };

    const handleDeleteConfirm = async () => {
        const id = deleteConfirm.id;
        try {
            await axios.delete(`/students/${id}`);
            toast.success('Student deleted successfully');
            const newStudents = students.filter(s => s._id !== id);
            setStudents(newStudents);
            if (expandedId === id) setExpandedId(null);
            setDeleteConfirm({ show: false, id: null, name: '' });
            if (refreshData) refreshData();
        } catch (err) {
            toast.error(parseApiError(err));
        }
    };

    const handleAdd = async () => {
        if (!addForm.name || !addForm.roll) {
            toast.error('Name and Roll are required');
            return;
        }
        try {
            const res = await axios.post('/students', addForm);
            toast.success('Student added');
            // If we have refreshData, use it to ensure consistency, otherwise update local state
            if (refreshData) {
                refreshData();
            } else {
                setStudents([res.data, ...students]);
            }
            setAddForm({ name: '', roll: '', registrationNo: '', department: 'Computer Science', semester: '1st', email: '', phone: '' });
            setIsAdding(false);
        } catch (err) {
            toast.error(parseApiError(err));
        }
    };

    const filteredStudents = useMemo(() => {
        let result = students.filter(s => {
            const matchSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll?.includes(searchTerm);
            const matchDept = !filters.department || s.department === filters.department;
            const matchSem = !filters.semester || s.semester === filters.semester;
            return matchSearch && matchDept && matchSem;
        });
        result.sort((a, b) => {
            const valA = (a[filters.sortBy] || '').toLowerCase();
            const valB = (b[filters.sortBy] || '').toLowerCase();
            return filters.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
        return result;
    }, [students, searchTerm, filters]);

    const activeFilterCount = [filters.department, filters.semester].filter(Boolean).length;
    const clearFilters = () => setFilters({ department: '', semester: '', sortBy: 'name', sortOrder: 'asc' });

    return (
        <div className="space-y-4">
            {/* Toolbar & Filters */}
            <StudentFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filters={filters}
                setFilters={setFilters}
                activeFilterCount={activeFilterCount}
                clearFilters={clearFilters}
                loading={loading}
                fetchStudents={handleRefresh}
                setIsAdding={setIsAdding}
                departments={departments}
                semesters={semesters}
            />

            {/* List */}
            <StudentTable 
                loading={loading}
                students={students}
                filteredStudents={filteredStudents}
                expandedId={expandedId}
                toggleRow={toggleRow}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editForm={editForm}
                setEditForm={setEditForm}
                saveEdit={saveEdit}
                handleDeleteClick={handleDeleteClick}
                isAdmin={isAdmin}
                teacher={teacher}
                departments={departments}
                semesters={semesters}
            />

            {/* Add Modal */}
            <AddStudentModal 
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                addForm={addForm}
                setAddForm={setAddForm}
                handleAdd={handleAdd}
                departments={departments}
                semesters={semesters}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                onConfirm={handleDeleteConfirm}
                title="Delete Student?"
                message="Are you sure you want to delete this student? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                icon="student"
                itemName={deleteConfirm.name}
            />
        </div>
    );
};

export default StudentList;
