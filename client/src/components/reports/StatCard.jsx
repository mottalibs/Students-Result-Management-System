import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
        
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 bg-gradient-to-br ${color} rounded-2xl shadow-lg shadow-blue-500/20 text-white`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg">
                    {trend}
                </span>
            )}
        </div>
        
        <div>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{label}</p>
        </div>
    </motion.div>
);

export default StatCard;
