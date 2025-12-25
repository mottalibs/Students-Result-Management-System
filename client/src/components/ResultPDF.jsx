import React, { useState } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { generateTranscript } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

const ResultPDF = ({ result, student }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);

    const handleDownload = async () => {
        console.log('Download requested for:', { student, result });

        if (!student || !result) {
            console.error('Missing data:', { student, result });
            toast.error('Student or Result data is missing');
            return;
        }

        if (!result.subjects || result.subjects.length === 0) {
            console.error('No subjects in result:', result);
            toast.error('No subjects found in result');
            return;
        }

        setIsGenerating(true);
        try {
            // Small delay for visual feedback
            await new Promise(resolve => setTimeout(resolve, 800));

            console.log('Calling generateTranscript...');
            generateTranscript(student, result);

            setGenerated(true);
            toast.success('Transcript downloaded successfully! 📄');

            // Reset generated state after 3 seconds
            setTimeout(() => setGenerated(false), 3000);
        } catch (err) {
            console.error('PDF generation error:', err);
            toast.error('Failed to generate PDF. Please check console for details.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={handleDownload}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all text-sm font-bold shadow-lg ${generated
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-slate-800 hover:bg-slate-900'
                    } text-white disabled:opacity-50 group`}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating PDF...
                    </>
                ) : generated ? (
                    <>
                        <CheckCircle className="w-5 h-5" />
                        Transcript Saved!
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                        Download Official Transcript
                    </>
                )}
            </button>
            {!generated && !isGenerating && (
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> PDF will be saved to your downloads
                </p>
            )}
        </div>
    );
};

export default ResultPDF;
