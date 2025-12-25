import React from 'react';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const ResultPreview = ({ 
    cgpa, 
    status, 
    isSubmitting, 
    isValid, 
    onSubmit 
}) => {
    return (
        <div className={`p-5 rounded-xl border-2 ${
            status === 'Failed' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
            status === 'Passed' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
            'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
        }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">CGPA</p>
                        <p className={`text-3xl font-bold ${
                            parseFloat(cgpa) >= 3.5 ? 'text-green-600' :
                            parseFloat(cgpa) >= 3.0 ? 'text-blue-600' :
                            parseFloat(cgpa) >= 2.0 ? 'text-amber-600' :
                            'text-red-600'
                        }`}>{cgpa || '0.00'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                        <div className="flex items-center gap-2">
                            {status === 'Passed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {status === 'Failed' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                            <p className={`text-xl font-bold ${status === 'Failed' ? 'text-red-600' : 'text-green-600'}`}>
                                {status || '-'}
                            </p>
                        </div>
                    </div>
                </div>
                
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting || !isValid}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
                >
                    {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</>
                    ) : (
                        <><CheckCircle className="w-5 h-5" /> Publish Result</>
                    )}
                </button>
            </div>
            <p className="text-xs text-slate-400 mt-3">💡 Ctrl+Enter to publish quickly</p>
        </div>
    );
};

export default ResultPreview;
