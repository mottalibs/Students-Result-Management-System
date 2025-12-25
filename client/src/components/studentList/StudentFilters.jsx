import React from 'react';
import { Search, Filter, RefreshCw, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentFilters = ({ 
    searchTerm, setSearchTerm, 
    showFilters, setShowFilters, 
    filters, setFilters, 
    activeFilterCount, clearFilters, 
    loading, fetchStudents, setIsAdding,
    departments, semesters 
}) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or roll..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-lg border transition-all ${showFilters || activeFilterCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        <Filter className="w-4 h-4" />
                    </button>
                    <button onClick={fetchStudents} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm hover:shadow transition-all">
                    <UserPlus className="w-4 h-4" /> Add Student
                </button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
                            <select value={filters.department} onChange={e => setFilters({...filters, department: e.target.value})} className="px-3 py-1.5 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">All Departments</option>
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select value={filters.semester} onChange={e => setFilters({...filters, semester: e.target.value})} className="px-3 py-1.5 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">All Semesters</option>
                                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select value={filters.sortBy} onChange={e => setFilters({...filters, sortBy: e.target.value})} className="px-3 py-1.5 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="name">Sort by Name</option>
                                <option value="roll">Sort by Roll</option>
                            </select>
                            <button onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})} className="px-3 py-1.5 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition">
                                {filters.sortOrder === 'asc' ? 'Asc' : 'Desc'}
                            </button>
                            {activeFilterCount > 0 && <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium ml-auto">Clear Filters</button>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentFilters;
