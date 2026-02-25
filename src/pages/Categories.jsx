import React from 'react';
import { useSelector } from 'react-redux';
import {
    Shield,
    Plus,
    Edit3,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Categories = () => {
    const { categories } = useSelector(state => state.app);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Category Roles</h1>
                    <p className="text-slate-500 mt-1">Define roles, set default wages, and manage staff privileges.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-blue-500/25">
                    <Plus size={20} />
                    Create Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-surface rounded-3xl border border-border p-8 flex flex-col relative overflow-hidden group hover:shadow-xl transition-all"
                    >
                        {/* Background Accent */}
                        <div className={`absolute -top-12 -right-12 w-32 h-32 blur-3xl opacity-10 rounded-full ${cat.id === 'A' ? 'bg-blue-500' : cat.id === 'B' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`} />

                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl ${cat.id === 'A' ? 'bg-blue-500/10 text-blue-500' : cat.id === 'B' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                <Shield size={28} />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                                    <Edit3 size={18} />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">Boy {cat.id}</h3>
                            <p className="text-slate-500 font-medium">{cat.name}</p>
                        </div>

                        <div className="bg-background p-6 rounded-2xl border border-border mb-8">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Default Wage</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{cat.defaultWage}</span>
                                <span className="text-sm text-slate-500 font-medium">/ per event</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Privileges & Roles</p>
                            <div className="space-y-3">
                                {cat.privileges.map((priv, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                                            <CheckCircle2 size={12} className="text-blue-500" />
                                        </div>
                                        <span className="text-sm text-slate-500 font-medium">{priv}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="mt-10 w-full py-4 bg-background border border-border hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-2xl transition-all">
                            Configure Role
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
