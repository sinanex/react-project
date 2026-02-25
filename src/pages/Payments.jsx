import React from 'react';
import { IndianRupee, Download, Filter, Search, Calendar, CheckCircle2, Clock } from 'lucide-react';

const Payments = () => {
    const transactions = [
        { id: 1, boy: 'Rahul Sharma', event: 'Grand Wedding', date: '2026-02-10', amount: 1200, status: 'Paid' },
        { id: 2, boy: 'Amit Kumar', event: 'Grand Wedding', date: '2026-02-10', amount: 800, status: 'Processing' },
        { id: 3, boy: 'Suresh Singh', event: 'Corp Dinner', date: '2026-02-05', amount: 500, status: 'Paid' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Finances</h1>
                    <p className="text-slate-500 mt-1">Track payments, wages, and financial summaries.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-emerald-500/25">
                    <Download size={18} />
                    Export Salary Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">Total Wage Paid</p>
                    <h3 className="text-3xl font-black text-white">₹1,85,000</h3>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 border-l-4 border-l-amber-500">
                    <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">Pending Approval</p>
                    <h3 className="text-3xl font-black text-white">₹12,400</h3>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 border-l-4 border-l-emerald-500">
                    <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">Budget Remaining</p>
                    <h3 className="text-3xl font-black text-white">₹45,000</h3>
                </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-white text-lg uppercase tracking-tight">Recent Transactions</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search..." className="bg-slate-800 border-none rounded-lg pl-9 pr-4 py-1.5 text-xs text-white" />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-800/40 text-slate-400 font-bold text-xs uppercase tracking-widest border-b border-slate-800">
                            <th className="px-6 py-4">Staff Member</th>
                            <th className="px-6 py-4">Event</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-800/20 transition-all">
                                <td className="px-6 py-4 font-bold text-white text-sm uppercase">{tx.boy}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{tx.event}</td>
                                <td className="px-6 py-4 text-xs text-slate-500">{tx.date}</td>
                                <td className="px-6 py-4">
                                    <span className="font-mono font-bold text-emerald-400">₹{tx.amount}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        {tx.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payments;
