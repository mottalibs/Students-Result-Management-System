import React from 'react';
import { 
    Edit, Trash2, RefreshCw, Save, 
    Users, Phone, Mail, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentTable = ({ 
    loading, students, filteredStudents, 
    expandedId, toggleRow, 
    isEditing, setIsEditing, editForm, setEditForm, saveEdit, 
    handleDeleteClick, 
    isAdmin, teacher, departments, semesters 
}) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            {loading ? (
                <div className="p-12 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                    <p className="text-slate-500 mt-2">Loading...</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    <div className="p-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
                        {filteredStudents.length} students found <span className="text-xs opacity-70">(Total: {students.length})</span>
                    </div>
                    {filteredStudents.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No students found</div>
                    ) : (
                        filteredStudents.map(student => {
                            const isExpanded = expandedId === student._id;
                            const isOwnDepartment = isAdmin || (teacher && teacher.department === student.department);
                            
                            return (
                                <div key={student._id} className={`group transition-colors ${
                                    isExpanded ? 'bg-blue-50/30 dark:bg-blue-900/10' : 
                                    isOwnDepartment && !isAdmin ? 'bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20' :
                                    'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                                }`}>
                                    {/* Main Row */}
                                    <div 
                                        onClick={() => toggleRow(student)}
                                        className="p-4 flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 dark:bg-blue-600 text-white font-bold text-sm shadow-sm transition-transform ${isExpanded ? 'scale-110' : ''}`}>
                                                {student.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold transition-colors ${isExpanded ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{student.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                                                    <span className="font-mono bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-1.5 py-0.5 rounded">{student.roll}</span>
                                                    <span className="text-slate-400 dark:text-slate-500">•</span>
                                                    <span className="text-slate-600 dark:text-slate-300">{student.department}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="hidden sm:block text-right">
                                                <span className="text-xs font-medium px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                                                    {student.semester} Semester
                                                </span>
                                                {!isOwnDepartment && (
                                                    <span className="ml-2 text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-600">
                                                        View Only
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-slate-400">
                                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }} 
                                                animate={{ height: 'auto', opacity: 1 }} 
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600"
                                            >
                                                <div className="p-4 sm:p-6">
                                                    {isEditing ? (
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Name</label><input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded bg-white dark:bg-slate-600 text-sm text-slate-900 dark:text-white" /></div>
                                                                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Roll</label><input value={editForm.roll} onChange={e => setEditForm({...editForm, roll: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded bg-white dark:bg-slate-600 text-sm text-slate-900 dark:text-white" /></div>
                                                                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Department</label><select value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded bg-white dark:bg-slate-600 text-sm text-slate-900 dark:text-white">{departments.map(d => <option key={d}>{d}</option>)}</select></div>
                                                                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Semester</label><select value={editForm.semester} onChange={e => setEditForm({...editForm, semester: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded bg-white dark:bg-slate-600 text-sm text-slate-900 dark:text-white">{semesters.map(s => <option key={s}>{s}</option>)}</select></div>
                                                                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label><input value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded bg-white dark:bg-slate-600 text-sm text-slate-900 dark:text-white" /></div>
                                                                <div><label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Phone</label><input value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded bg-white dark:bg-slate-600 text-sm text-slate-900 dark:text-white" /></div>
                                                            </div>
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 rounded">Cancel</button>
                                                                <button onClick={saveEdit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col sm:flex-row gap-6">
                                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                                <div className="flex items-center gap-3">
                                                                    <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                                                    <div><p className="text-xs font-medium text-slate-500 dark:text-slate-300">Registration No</p><p className="text-slate-900 dark:text-white font-medium">{student.registrationNo || 'N/A'}</p></div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <Mail className="w-4 h-4 text-green-500 dark:text-green-400" />
                                                                    <div><p className="text-xs font-medium text-slate-500 dark:text-slate-300">Email</p><p className="text-slate-900 dark:text-white font-medium">{student.email || 'N/A'}</p></div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <Phone className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                                                    <div><p className="text-xs font-medium text-slate-500 dark:text-slate-300">Phone</p><p className="text-slate-900 dark:text-white font-medium">{student.phone || 'N/A'}</p></div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-4 sm:pt-0 sm:pl-6">
                                                                {isOwnDepartment ? (
                                                                    <>
                                                                        <button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">
                                                                            <Edit className="w-4 h-4" /> Edit
                                                                        </button>
                                                                        <button onClick={(e) => handleDeleteClick(student, e)} className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/30 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-2">
                                                                            <Trash2 className="w-4 h-4" /> Delete
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="text-sm text-slate-400 italic text-center w-full">
                                                                        Actions restricted to {student.department} department
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentTable;
