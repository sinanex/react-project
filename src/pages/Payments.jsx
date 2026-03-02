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
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Finances</h1>
                    <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Track payments, wages, and financial summaries.</p>
                </div>
                <button className="btn-primary">
                    <Download size={18} />
                    Export Salary Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Total Wage Paid</p>
                    <h3 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>₹1,85,000</h3>
                </div>
                <div className="card p-6" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Pending Approval</p>
                    <h3 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>₹12,400</h3>
                </div>
                <div className="card p-6" style={{ borderLeft: '4px solid #10b981' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Budget Remaining</p>
                    <h3 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>₹45,000</h3>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="p-6 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-sidebar)' }}>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Recent Transactions</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} size={16} />
                        <input type="text" placeholder="Search..." className="border rounded-lg pl-9 pr-4 py-2 text-sm outline-none" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)' }}>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Staff Member</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Event</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-400/5 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{tx.boy}</td>
                                    <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{tx.event}</td>
                                    <td className="px-6 py-4 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{tx.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold font-mono" style={{ color: 'var(--color-primary)' }}>₹{tx.amount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${tx.status === 'Paid' ? 'badge-active' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {tx.status === 'Paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
