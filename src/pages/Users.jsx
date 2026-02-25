import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Trash2,
    Edit3,
    Star,
    Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
    const { boys, categories } = useSelector(state => state.app);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const filteredBoys = boys.filter(boy => {
        const matchesSearch = boy.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterCategory === 'All' || boy.category === filterCategory;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                    <p className="text-slate-500 mt-1">Manage and monitor all event workforce registered in the system.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-background hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all font-medium border border-border">
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-blue-500/25">
                        <Plus size={18} />
                        Add New Boy
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-surface p-4 rounded-2xl border border-border flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, ID..."
                        className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-xl border border-border">
                        <Filter size={18} className="text-slate-500" />
                        <select
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium pr-8 outline-none"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>Boy {c.id}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-bold text-xs uppercase tracking-widest border-b border-border">
                                <th className="px-6 py-5">Boy Name</th>
                                <th className="px-6 py-5">Category</th>
                                <th className="px-6 py-5">Wage/Event</th>
                                <th className="px-6 py-5">Performance</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <AnimatePresence>
                                {filteredBoys.map((boy) => (
                                    <motion.tr
                                        key={boy.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-border shadow-inner group-hover:scale-110 transition-transform">
                                                    <span className="font-bold">{boy.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{boy.name}</p>
                                                    <p className="text-xs text-slate-500 mt-1">ID: #CBR-{1000 + boy.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${boy.category === 'A' ? 'bg-blue-500' : boy.category === 'B' ? 'bg-emerald-500' : 'bg-amber-500'
                                                    }`} />
                                                <span className="text-sm font-semibold tracking-wide">Category {boy.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                                <span>₹</span>
                                                <span>{boy.wage}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5">
                                                <Star size={16} className="text-amber-500 fill-amber-500" />
                                                <span className="text-sm font-bold">{boy.performance}</span>
                                                <span className="text-xs text-slate-500 ml-1 font-medium">({boy.bookingCount})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${boy.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${boy.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                {boy.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900 dark:text-white">1-{filteredBoys.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{filteredBoys.length}</span> boys</p>
                    <div className="flex items-center gap-2">
                        <button disabled className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">Previous</button>
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
