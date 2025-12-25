import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import axios from '../utils/axiosInstance';
import { 
    Search, Edit, Trash2, CheckCircle2, XCircle, 
    RefreshCw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
    FileText, ChevronsLeft, ChevronsRight, Filter, BookOpen,
    ArrowUp, ArrowDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import EditResultModal from './EditResultModal';
import ConfirmModal from './ConfirmModal';
import { generateTranscript } from '../utils/pdfGenerator';
import { AnimatePresence, motion } from 'framer-motion';

// Result Row Component
const ResultRow = memo(({ result, isExpanded, onToggle, onEdit, onDelete, onPDF, isOwnDepartment }) => {
    return (
        <div className={`group transition-colors ${
            isExpanded ? 'bg-blue-50/30 dark:bg-blue-900/10' : 
            isOwnDepartment ? 'bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20' :
            'hover:bg-slate-50 dark:hover:bg-slate-700/30'
        }`}>
            {/* Main Row */}
            <div 
                onClick={onToggle}
                className="p-4 flex items-center justify-between cursor-pointer"
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 dark:bg-blue-600 text-white font-bold text-sm shadow-sm transition-transform ${isExpanded ? 'scale-110' : ''}`}>
                        {result.studentId?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                        <h4 className={`font-semibold transition-colors ${isExpanded ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                            {result.studentId?.name || 'Unknown'}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                            <span className="font-mono bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-1.5 py-0.5 rounded">
                                {result.studentId?.roll || 'N/A'}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500">•</span>
                            <span className="text-slate-600 dark:text-slate-300">{result.semester}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Quick Actions on hover */}
                    <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button onClick={(e) => { e.stopPropagation(); onPDF(); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition" title="Download PDF">
                            <FileText className="w-4 h-4" />
                        </button>
                        {isOwnDepartment && (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition" title="Edit Result">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(e); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition" title="Delete Result">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                    
                    {/* CGPA */}
                    <div className="hidden sm:block text-right min-w-[50px]">
                        <span className={`text-lg font-bold ${
                            result.cgpa >= 3.75 ? 'text-emerald-600 dark:text-emerald-400' : 
                            result.cgpa >= 2.0 ? 'text-slate-700 dark:text-slate-200' : 
                            'text-red-600 dark:text-red-400'
                        }`}>
                            {result.cgpa?.toFixed(2)}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">CGPA</p>
                    </div>
                    
                    {/* Status */}
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        result.status === 'Passed' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                        {result.status}
                    </span>
                    
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
                        <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-800/50">
                            {/* Subject Details - Minimal Table Design */}
                            <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="px-4 py-3">Subject</th>
                                            <th className="px-4 py-3 text-center">Marks</th>
                                            <th className="px-4 py-3 text-center">Grade</th>
                                            <th className="px-4 py-3 text-center">Point</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {result.subjects?.map((sub, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{sub.subjectName}</td>
                                                <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{sub.marks}</td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <span className={`inline-block w-6 text-center font-semibold rounded ${
                                                        sub.grade === 'F' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 
                                                        sub.grade === 'A+' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 
                                                        'text-slate-600 dark:text-slate-400'
                                                    }`}>
                                                        {sub.grade}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-center text-slate-500 dark:text-slate-400">{sub.point || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Actions - Minimal */}
                            <div className="flex items-center justify-end gap-3">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onPDF(); }}
                                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition flex items-center gap-1.5"
                                >
                                    <FileText className="w-3.5 h-3.5" /> Download PDF
                                </button>
                                {isOwnDepartment ? (
                                    <>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md transition flex items-center gap-1.5"
                                        >
                                            <Edit className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 dark:bg-slate-800 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md transition flex items-center gap-1.5"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs text-slate-400 italic px-2">View Only</span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

const ResultList = ({ results: initialResults, loading: initialLoading, refreshData }) => {
    const [results, setResults] = useState(initialResults || []);
    const [loading, setLoading] = useState(initialLoading);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ status: '', semester: '', sortBy: 'name', sortOrder: 'asc' });
    const [expandedRow, setExpandedRow] = useState(null);
    const [editingResult, setEditingResult] = useState(null);
    
    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    
    // Get current user info
    const teacher = JSON.parse(localStorage.getItem('teacher') || 'null');
    const admin = JSON.parse(localStorage.getItem('admin') || 'null');
    const isAdmin = !!admin;

    useEffect(() => {
        if (!initialResults) {
            fetchResults();
        } else {
            setResults(initialResults);
            setLoading(initialLoading);
        }
    }, [initialResults, initialLoading]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/results');
            setResults(res.data);
        } catch (error) {
            toast.error('Failed to fetch results');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = useCallback((result, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setDeleteConfirm({ 
            show: true, 
            id: result._id, 
            name: result.studentId?.name || 'Unknown Student' 
        });
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        const id = deleteConfirm.id;
        try {
            await axios.delete(`/results/${id}`);
            toast.success('Result deleted successfully');
            setResults(prev => {
                const newResults = prev.filter(r => r._id !== id);
                return newResults;
            });
            if (expandedRow === id) setExpandedRow(null);
            if (refreshData) refreshData();
        } catch (error) {
            toast.error('Failed to delete');
        }
    }, [deleteConfirm.id, expandedRow, refreshData]);

    // Get unique semesters
    const semesters = useMemo(() => {
        const unique = [...new Set(results.map(r => r.semester).filter(Boolean))];
        return unique.sort();
    }, [results]);

    const filteredResults = useMemo(() => {
        let filtered = results.filter(result => {
            const matchesSearch = 
                result.studentId?.roll?.toString().includes(searchTerm) ||
                result.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesSemester = !filters.semester || result.semester === filters.semester;
            const matchesStatus = !filters.status || result.status === filters.status;
            
            return matchesSearch && matchesSemester && matchesStatus;
        });

        // Sorting
        filtered.sort((a, b) => {
            let valA, valB;
            switch (filters.sortBy) {
                case 'cgpa':
                    valA = a.cgpa || 0;
                    valB = b.cgpa || 0;
                    break;
                case 'roll':
                    valA = a.studentId?.roll || '';
                    valB = b.studentId?.roll || '';
                    break;
                default:
                    valA = (a.studentId?.name || '').toLowerCase();
                    valB = (b.studentId?.name || '').toLowerCase();
            }
            
            if (typeof valA === 'string') {
                return filters.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
        });

        return filtered;
    }, [results, searchTerm, filters]);

    const paginatedResults = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredResults.slice(start, start + pageSize);
    }, [filteredResults, currentPage, pageSize]);

    const toggleExpand = useCallback((id) => {
        setExpandedRow(prev => prev === id ? null : id);
    }, []);

    const activeFilterCount = [filters.status, filters.semester].filter(Boolean).length;
    const clearFilters = () => setFilters({ status: '', semester: '', sortBy: 'name', sortOrder: 'asc' });
    const totalPages = Math.ceil(filteredResults.length / pageSize);

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name or roll..." 
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                        </div>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg border transition-all ${showFilters || activeFilterCount > 0 ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                        <button onClick={fetchResults} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {filteredResults.length} results <span className="text-xs opacity-70">(Total: {results.length})</span>
                    </div>
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
                                <select 
                                    value={filters.status} 
                                    onChange={e => { setFilters({...filters, status: e.target.value}); setCurrentPage(1); }} 
                                    className="px-3 py-1.5 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="Passed">Passed</option>
                                    <option value="Failed">Failed</option>
                                </select>
                                <select 
                                    value={filters.semester} 
                                    onChange={e => { setFilters({...filters, semester: e.target.value}); setCurrentPage(1); }} 
                                    className="px-3 py-1.5 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Semesters</option>
                                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select 
                                    value={filters.sortBy} 
                                    onChange={e => setFilters({...filters, sortBy: e.target.value})} 
                                    className="px-3 py-1.5 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="roll">Sort by Roll</option>
                                    <option value="cgpa">Sort by CGPA</option>
                                </select>
                                <button 
                                    onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})} 
                                    className="px-3 py-1.5 text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                                >
                                    {filters.sortOrder === 'asc' ? <ArrowUp className="w-4 h-4 inline" /> : <ArrowDown className="w-4 h-4 inline" />}
                                </button>
                                {activeFilterCount > 0 && <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium ml-auto">Clear Filters</button>}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Loading...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {filteredResults.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">No results found</div>
                        ) : (
                            paginatedResults.map(result => (
                                <ResultRow
                                    key={result._id}
                                    result={result}
                                    isExpanded={expandedRow === result._id}
                                    onToggle={() => toggleExpand(result._id)}
                                    onEdit={() => setEditingResult(result)}
                                    onDelete={(e) => handleDeleteClick(result, e)}
                                    onPDF={() => generateTranscript(result.studentId, result)}
                                    isOwnDepartment={isAdmin || (teacher && teacher.department === result.studentId?.department)}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span>Per page:</span>
                        <select 
                            value={pageSize}
                            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                            className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300">
                            <ChevronsLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <span className="px-3 text-sm text-slate-600 dark:text-slate-300">
                            Page {currentPage} of {totalPages}
                        </span>
                        
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-600 dark:text-slate-300">
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {filteredResults.length} total
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingResult && (
                <EditResultModal 
                    result={editingResult} 
                    onClose={() => setEditingResult(null)} 
                    onUpdate={() => {
                        if (refreshData) {
                            refreshData();
                        } else {
                            fetchResults();
                        }
                        setEditingResult(null);
                    }} 
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                onConfirm={handleDeleteConfirm}
                title="Delete Result?"
                message="This result will be permanently deleted and cannot be recovered."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                icon="result"
                itemName={deleteConfirm.name}
            />
        </div>
    );
};

export default ResultList;
