import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { UserPlus, Loader2, Mail, Hash, FileText, BookOpen, Calendar, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const AddStudentForm = ({ refreshData }) => {
    const [formData, setFormData] = useState({
        name: '', roll: '', registrationNo: '', department: '', semester: '', session: '', email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const departments = ['Computer Science', 'Electrical Engineering', 'Civil Engineering', 'Mechanical Engineering', 'Electronics & Telecommunication'];
    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
    const sessions = ['2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'];

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('/students', formData);
            toast.success('Student Added Successfully! 🎉');
            setFormData({ name: '', roll: '', registrationNo: '', department: '', semester: '', session: '', email: '' });
            if (refreshData) refreshData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error adding student');
        } finally {
            setIsSubmitting(false);
        }
    };

    const InputField = ({ icon: Icon, ...props }) => (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <input
                {...props}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
            />
        </div>
    );

    const SelectField = ({ icon: Icon, options, ...props }) => (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <select
                {...props}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800 dark:text-white appearance-none cursor-pointer"
            >
                {props.children}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Quick Add Student</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enter student details to register</p>
                </div>
            </div>

            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <InputField 
                        icon={UserPlus}
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                
                <InputField 
                    icon={Mail}
                    placeholder="Email Address (Optional)"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                />

                <InputField 
                    icon={Hash}
                    placeholder="Roll Number *"
                    value={formData.roll}
                    onChange={e => setFormData({ ...formData, roll: e.target.value })}
                    required
                />

                <InputField 
                    icon={FileText}
                    placeholder="Registration No *"
                    value={formData.registrationNo}
                    onChange={e => setFormData({ ...formData, registrationNo: e.target.value })}
                    required
                />

                <SelectField 
                    icon={BookOpen}
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    required
                >
                    <option value="">Select Department *</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </SelectField>

                <SelectField 
                    icon={Layers}
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                    required
                >
                    <option value="">Select Semester *</option>
                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                </SelectField>

                <SelectField 
                    icon={Calendar}
                    value={formData.session}
                    onChange={e => setFormData({ ...formData, session: e.target.value })}
                    required
                >
                    <option value="">Select Session *</option>
                    {sessions.map(s => <option key={s} value={s}>{s}</option>)}
                </SelectField>

                <div className="lg:col-span-3 mt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Adding Student...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Add Student Record
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default AddStudentForm;
