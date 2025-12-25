import React from 'react';

// Base Skeleton with enhanced styling
const Skeleton = ({ className = '', variant = 'default' }) => {
    const baseClasses = 'animate-pulse rounded';
    const variantClasses = {
        default: 'bg-slate-200 dark:bg-slate-700',
        light: 'bg-slate-100 dark:bg-slate-800',
        primary: 'bg-blue-100 dark:bg-blue-900/30'
    };
    
    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
    );
};

// Dashboard Stats Skeleton
export const StatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-10 rounded-xl" variant="primary" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>
                <Skeleton className="h-8 w-20 mt-4" />
                <Skeleton className="h-4 w-24 mt-2" variant="light" />
            </div>
        ))}
    </div>
);

// Table Row Skeleton
export const TableSkeleton = ({ rows = 5 }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24 ml-auto" />
            <Skeleton className="h-4 w-20" />
        </div>
        {/* Rows */}
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0 border-slate-100 dark:border-slate-700">
                <Skeleton className="h-10 w-10 rounded-full" variant="primary" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" variant="light" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-lg" variant="light" />
            </div>
        ))}
    </div>
);

// Card Grid Skeleton
export const CardSkeleton = ({ count = 3 }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-xl" variant="primary" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" variant="light" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-3 w-full" variant="light" />
                    <Skeleton className="h-3 w-4/5" variant="light" />
                    <Skeleton className="h-3 w-2/3" variant="light" />
                </div>
            </div>
        ))}
    </div>
);

// Form Skeleton
export const FormSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" variant="primary" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" variant="light" />
            </div>
        </div>
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" variant="light" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            ))}
        </div>
        {/* Button */}
        <div className="flex justify-end">
            <Skeleton className="h-10 w-32 rounded-lg" variant="primary" />
        </div>
    </div>
);

// Dashboard Welcome Banner Skeleton
export const BannerSkeleton = () => (
    <div className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 md:p-8 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
                <Skeleton className="h-4 w-40" variant="light" />
                <Skeleton className="h-10 w-72" variant="light" />
                <Skeleton className="h-4 w-56" variant="light" />
            </div>
            <div className="flex gap-3">
                <Skeleton className="h-12 w-32 rounded-xl" variant="light" />
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
        </div>
    </div>
);

// Page Loading Skeleton (Full Page)
export const PageSkeleton = () => (
    <div className="space-y-8 max-w-[1600px] mx-auto">
        <BannerSkeleton />
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CardSkeleton count={1} />
            <CardSkeleton count={1} />
            <CardSkeleton count={1} />
        </div>
    </div>
);

// Inline Skeleton (for text placeholders)
export const TextSkeleton = ({ width = 'w-24' }) => (
    <Skeleton className={`h-4 ${width} inline-block`} />
);

export default Skeleton;
