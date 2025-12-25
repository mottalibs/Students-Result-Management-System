import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download, FileText } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const BulkUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.csv'))) {
            setFile(selectedFile);
            setStats(null);
            parseFile(selectedFile);
        } else {
            toast.error('Please upload a valid Excel (.xlsx) or CSV file');
        }
    };

    const parseFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length < 2) {
                    toast.error('File is empty or invalid format');
                    return;
                }

                // Process headers and data
                // Expected: Roll | Semester | Sub1 | Marks1 | Sub2 | Marks2 ...
                const headers = jsonData[0];
                const rows = jsonData.slice(1);

                const parsedResults = rows.map(row => {
                    const roll = row[0];
                    const semester = row[1];
                    const subjects = [];

                    // Loop through remaining columns in pairs (Subject, Marks)
                    for (let i = 2; i < row.length; i += 2) {
                        const subName = row[i];
                        const marks = row[i+1];
                        if (subName && marks !== undefined) {
                            subjects.push({ subjectName: subName, marks: parseInt(marks) || 0 });
                        }
                    }

                    return { roll, semester, subjects };
                }).filter(r => r.roll && r.semester && r.subjects.length > 0);

                setPreviewData(parsedResults);
            } catch (err) {
                console.error(err);
                toast.error('Failed to parse file');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleUploadClick = () => {
        if (previewData.length === 0) return;
        setShowConfirm(true);
    };

    const handleUploadConfirm = async () => {

        setLoading(true);
        try {
            const res = await axios.post('/bulk-results', { results: previewData });
            setStats(res.data.stats);
            toast.success('Bulk upload processed!');
            setFile(null);
            setPreviewData([]);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const template = [
            ['Roll', 'Semester', 'Subject 1', 'Marks 1', 'Subject 2', 'Marks 2', 'Subject 3', 'Marks 3'],
            ['1001', '1st', 'Mathematics', '85', 'Physics', '78', 'English', '90'],
            ['1002', '1st', 'Mathematics', '72', 'Physics', '81', 'English', '88']
        ];
        const ws = XLSX.utils.aoa_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "Result_Upload_Template.xlsx");
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <FileSpreadsheet className="w-6 h-6 text-green-600" />
                            Bulk Result Upload
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Upload Excel file with student results</p>
                    </div>
                    <button 
                        onClick={downloadTemplate}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                        <Download className="w-4 h-4" /> Download Template
                    </button>
                </div>

                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <input
                        type="file"
                        id="fileUpload"
                        className="hidden"
                        accept=".xlsx, .csv"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Upload className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {file ? file.name : 'Click to upload Excel file'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Format: Roll | Semester | Subject | Marks ...
                            </p>
                        </div>
                    </label>
                </div>

                {previewData.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Preview ({previewData.length} records)
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden max-h-60 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Roll</th>
                                        <th className="px-4 py-2">Semester</th>
                                        <th className="px-4 py-2">Subjects</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {previewData.slice(0, 5).map((row, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-2 text-slate-800 dark:text-slate-300">{row.roll}</td>
                                            <td className="px-4 py-2 text-slate-800 dark:text-slate-300">{row.semester}</td>
                                            <td className="px-4 py-2 text-slate-600 dark:text-slate-400">
                                                {row.subjects.map(s => `${s.subjectName}: ${s.marks}`).join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                    {previewData.length > 5 && (
                                        <tr>
                                            <td colSpan="3" className="px-4 py-2 text-center text-slate-500 italic">
                                                ...and {previewData.length - 5} more
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <button
                            onClick={handleUploadClick}
                            disabled={loading}
                            className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Upload'}
                        </button>
                    </div>
                )}

                {stats && (
                    <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <div>
                                <p className="font-medium text-green-800 dark:text-green-300">Upload Complete</p>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Successfully processed {stats.success} results. {stats.failed} failed.
                                </p>
                            </div>
                        </div>

                        {stats.errors.length > 0 && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    <p className="font-medium text-red-800 dark:text-red-300">Errors</p>
                                </div>
                                <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400 space-y-1 max-h-32 overflow-y-auto">
                                    {stats.errors.map((err, idx) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Upload Confirmation Modal */}
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleUploadConfirm}
                title="Confirm Upload?"
                message={`You are about to upload ${previewData.length} results. Are you sure?`}
                confirmText="Upload"
                cancelText="Review"
                type="warning"
                icon="file"
            />
        </div>
    );
};

export default BulkUpload;
