import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddStudentModal = ({ isAdding, setIsAdding, addForm, setAddForm, handleAdd, departments, semesters }) => {
    return (
        <AnimatePresence>
            {isAdding && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsAdding(false)}>
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-900 dark:text-white">Add Student</h3><button onClick={() => setIsAdding(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X className="w-5 h-5" /></button></div>
                        <div className="space-y-3">
                            <input placeholder="Name *" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" autoFocus />
                            <div className="grid grid-cols-2 gap-3">
                                <input placeholder="Roll *" value={addForm.roll} onChange={e => setAddForm({...addForm, roll: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                                <input placeholder="Reg No" value={addForm.registrationNo} onChange={e => setAddForm({...addForm, registrationNo: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                            </div>
                            <select value={addForm.department} onChange={e => setAddForm({...addForm, department: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white">{departments.map(d => <option key={d}>{d}</option>)}</select>
                            <select value={addForm.semester} onChange={e => setAddForm({...addForm, semester: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white">{semesters.map(s => <option key={s}>{s}</option>)}</select>
                            <input placeholder="Email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                            <input placeholder="Phone" value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setIsAdding(false)} className="flex-1 py-3 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
                            <button onClick={handleAdd} className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-sm">Add</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddStudentModal;
